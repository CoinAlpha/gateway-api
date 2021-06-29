import { ethers } from 'ethers';
import express from 'express';
import { Request, Response } from 'express';

import { latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';

import { EthereumService } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';

import Uniswap from '../services/uniswap';
import Fees from '../services/fees';

const debug = require('debug')('router');
const router = express.Router();
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const ethConfig = new EthereumConfigService();
const eth = new EthereumService(ethConfig);

const uniswap = new Uniswap(globalConfig.getConfig('ETHEREUM_CHAIN'));
uniswap.generate_tokens();
setTimeout(uniswap.update_pairs.bind(uniswap), 2000);
const fees = new Fees();

const swapMoreThanMaxPriceError = 'Price too high';
const swapLessThanMaxPriceError = 'Price too low';

const estimateGasLimit = () => {
  return uniswap.gasLimit;
};

const getErrorMessage = (err: string) => {
  /*
    [WIP] Custom error message based-on string match
  */
  let message = err;
  if (err.includes('failed to meet quorum')) {
    message = 'Failed to meet quorum in Uniswap';
  } else if (err.includes('Invariant failed: ADDRESSES')) {
    message = 'Invariant failed: ADDRESSES';
  } else if (err.includes('"call revert exception')) {
    message = statusMessages.no_pool_available;
  } else if (err.includes('"trade" is read-only')) {
    message = statusMessages.no_pool_available;
  }
  return message;
};

router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  res.status(200).json({
    network: uniswap.network,
    provider: uniswap.provider.connection.url,
    uniswap_router: uniswap.router,
    connection: true,
    timestamp: Date.now(),
  });
});

router.post('/gas-limit', async (req: Request, res: Response) => {
  /*
    POST: /gas-limit
  */
  const gasLimit = estimateGasLimit();

  try {
    res.status(200).json({
      network: uniswap.network,
      gasLimit: gasLimit,
      timestamp: Date.now(),
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err,
    });
  }
});

router.get('/start', async (req: Request, res: Response) => {
  /*
    GET: /eth/uniswap/start?pairs=["WETH-USDC"]&gasPrice=30
  */
  const initTime = Date.now();

  if (typeof req.query.pairs === 'string') {
    const pairs = JSON.parse(req.query.pairs);
    let gasPrice;
    if (typeof req.query.gasPrice === 'string') {
      gasPrice = parseFloat(req.query.gasPrice);
    } else {
      gasPrice = fees.ethGasPrice;
    }

    // get token contract address and cache paths
    for (let pair of pairs) {
      pair = pair.split('-');
      const baseTokenSymbol = pair[0];
      const quoteTokenSymbol = pair[1];
      const baseTokenContractInfo = eth.getERC20TokenAddress(baseTokenSymbol);
      const quoteTokenContractInfo = eth.getERC20TokenAddress(quoteTokenSymbol);

      // check for valid token symbols
      if (
        baseTokenContractInfo === undefined ||
        quoteTokenContractInfo === undefined
      ) {
        const undefinedToken =
          baseTokenContractInfo === undefined
            ? baseTokenSymbol
            : quoteTokenSymbol;
        res.status(500).json({
          error: `Token ${undefinedToken} contract address not found`,
          message: `Token contract address not found for ${undefinedToken}. Check token list source`,
        });
        return;
      }
      await Promise.allSettled([
        uniswap.extend_update_pairs([
          baseTokenContractInfo.address,
          quoteTokenContractInfo.address,
        ]),
      ]);
    }

    const gasLimit = estimateGasLimit();
    const gasCost = await fees.getGasCost(gasPrice, gasLimit);

    const result = {
      network: eth.networkName,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      success: true,
      pairs: pairs,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost,
    };
    res.status(200).json(result);
  } else {
    res.status(500).json({ err: 'error in pair type' });
  }
});

router.post('/trade', async (req: Request, res: Response) => {
  /*
      POST: /trade
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":0.1
        "limitPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
        "side":{buy|sell}
      }
  */
  const initTime = Date.now();
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const privateKey = req.body.privateKey;
  const wallet = new ethers.Wallet(privateKey, uniswap.provider);
  const amount = req.body.amount;

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);

  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const baseTokenAddress = baseTokenContractInfo.address;
    const quoteTokenAddress = quoteTokenContractInfo.address;
    const side = req.body.side.toUpperCase();

    let limitPrice;
    if (req.body.limitPrice) {
      limitPrice = parseFloat(req.body.limitPrice);
    }
    let gasPrice;
    if (req.body.gasPrice) {
      gasPrice = parseFloat(req.body.gasPrice);
    } else {
      gasPrice = fees.ethGasPrice;
    }
    const gasLimit = estimateGasLimit();
    const gasCost = await fees.getGasCost(gasPrice, gasLimit);

    try {
      // fetch the optimal pool mix from uniswap
      const result: any =
        side === 'BUY'
          ? await uniswap.priceSwapOut(
              quoteTokenAddress, // tokenIn is quote asset
              baseTokenAddress, // tokenOut is base asset
              amount
            )
          : await uniswap.priceSwapIn(
              baseTokenAddress, // tokenIn is base asset
              quoteTokenAddress, // tokenOut is quote asset
              amount
            );
      if (result && result.trade && result.expectedAmount) {
        const trade = result.trade;
        const expectedAmount = result.expectedAmount;
        if (side === 'BUY') {
          const price = trade.executionPrice.invert().toSignificant(8);
          if (!limitPrice || price <= limitPrice) {
            // pass swaps to exchange-proxy to complete trade
            const tx = await uniswap.swapExactOut(
              wallet,
              trade,
              baseTokenAddress,
              gasPrice
            );
            // submit response
            res.status(200).json({
              network: uniswap.network,
              timestamp: initTime,
              latency: latency(initTime, Date.now()),
              base: baseTokenAddress,
              quote: quoteTokenAddress,
              amount: amount,
              expectedIn: expectedAmount.toSignificant(8),
              price: price,
              gasPrice: gasPrice,
              gasLimit,
              gasCost,
              txHash: tx.hash,
            });
          } else {
            res.status(500).json({
              error: swapMoreThanMaxPriceError,
              message: `Swap price ${price} exceeds limitPrice ${limitPrice}`,
            });
            logger.info(
              `uniswap.route - Swap price ${price} exceeds limitPrice ${limitPrice}`
            );
          }
        } else {
          // sell
          const price = trade.executionPrice.toSignificant(8);
          logger.info(`Price: ${price.toString()}`);
          if (!limitPrice || price >= limitPrice) {
            // pass swaps to exchange-proxy to complete trade
            const tx = await uniswap.swapExactIn(
              wallet,
              trade,
              baseTokenAddress,
              gasPrice
            );
            // submit response
            res.status(200).json({
              network: uniswap.network,
              timestamp: initTime,
              latency: latency(initTime, Date.now()),
              base: baseTokenAddress,
              quote: quoteTokenAddress,
              amount: parseFloat(req.body.amount),
              expectedOut: expectedAmount.toSignificant(8),
              price: parseFloat(price),
              gasPrice: gasPrice,
              gasLimit,
              gasCost: gasCost,
              txHash: tx.hash,
            });
          } else {
            res.status(500).json({
              error: swapLessThanMaxPriceError,
              message: `Swap price ${price} lower than limitPrice ${limitPrice}`,
            });
            logger.info(
              `uniswap.route - Swap price ${price} lower than limitPrice ${limitPrice}`
            );
          }
        }
      } else {
        res.status(500).json({
          error: 'error',
        });
      }
    } catch (err) {
      logger.error(req.originalUrl, { message: err });
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = statusMessages.operation_error);
      res.status(500).json({
        error: reason,
        message: err,
      });
    }
  } else {
    res.status(500).json({
      error: 'unknown token addresses',
    });
  }
});

router.post('/price', async (req: Request, res: Response) => {
  /*
    POST: /price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":1
      }
  */
  const initTime = Date.now();
  // params: base (required), quote (required), amount (required)
  const amount = req.body.amount;

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);
  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const baseTokenAddress = baseTokenContractInfo.address;
    const quoteTokenAddress = quoteTokenContractInfo.address;
    const side = req.body.side.toUpperCase();
    let gasPrice;
    if (req.body.gasPrice) {
      gasPrice = parseFloat(req.body.gasPrice);
    } else {
      gasPrice = fees.ethGasPrice;
    }
    const gasLimit = estimateGasLimit();
    const gasCost = await fees.getGasCost(gasPrice, gasLimit);

    try {
      // fetch the optimal pool mix from uniswap
      const result: any =
        side === 'BUY'
          ? await uniswap.priceSwapOut(
              quoteTokenAddress, // tokenIn is quote asset
              baseTokenAddress, // tokenOut is base asset
              amount
            )
          : await uniswap.priceSwapIn(
              baseTokenAddress, // tokenIn is base asset
              quoteTokenAddress, // tokenOut is quote asset
              amount
            );
      if (result && result.trade && result.expectedAmount) {
        const trade = result.trade;
        const expectedAmount = result.expectedAmount;

        if (trade !== null && expectedAmount !== null) {
          const price =
            side === 'BUY'
              ? trade.executionPrice.invert().toSignificant(8)
              : trade.executionPrice.toSignificant(8);

          const tradeAmount = parseFloat(amount);
          const expectedTradeAmount = parseFloat(
            expectedAmount.toSignificant(8)
          );
          const tradePrice = parseFloat(price);

          const result = {
            network: uniswap.network,
            timestamp: initTime,
            latency: latency(initTime, Date.now()),
            base: baseTokenAddress,
            quote: quoteTokenAddress,
            amount: tradeAmount,
            expectedAmount: expectedTradeAmount,
            price: tradePrice,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            gasCost: gasCost,
            trade: trade,
          };
          debug(
            `Price ${side} ${baseTokenContractInfo.symbol}-${quoteTokenContractInfo.symbol} | amount:${amount} (rate:${tradePrice}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`
          );
          res.status(200).json(result);
        } else {
          // no pool available
          res.status(200).json({
            info: statusMessages.no_pool_available,
            message: '',
          });
        }
      } else {
        res.status(500).json({
          err: 'parse error',
          message: '',
        });
      }
    } catch (err) {
      logger.error(req.originalUrl, { message: err });
      let reason;
      let errCode = 500;
      if (Object.keys(err).includes('isInsufficientReservesError')) {
        errCode = 200;
        reason =
          statusMessages.insufficient_reserves + ' in ' + side + ' at Uniswap';
      } else if (Object.getOwnPropertyNames(err).includes('message')) {
        reason = getErrorMessage(err.message);
        if (reason === statusMessages.no_pool_available) {
          errCode = 200;
          res.status(errCode).json({
            info: reason,
            message: err,
          });
        }
      } else {
        err.reason
          ? (reason = err.reason)
          : (reason = statusMessages.operation_error);
      }
      res.status(errCode).json({
        error: reason,
        message: err,
      });
    }
  } else {
    res.status(500).json({
      error: 'unknown token addresses',
    });
  }
});

export default router;
