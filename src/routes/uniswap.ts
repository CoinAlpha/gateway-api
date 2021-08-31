import { ethers } from 'ethers';
import express from 'express';
import { Request, Response } from 'express';

import { latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';

import { EthereumService } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';

import Uniswap from '../services/uniswap';
import { EthereumGasService } from '../services/ethereum_gas';
import Fees from '../services/fees';

const debug = require('debug')('router');
const router = express.Router();
const ethConfig = new EthereumConfigService();
const eth = new EthereumService(ethConfig);
const uniswap = new Uniswap();
const fees = new EthereumGasService(ethConfig);
const feesOld = new Fees();

const swapMoreThanMaxPriceError = 'Price too high';
const swapLessThanMaxPriceError = 'Price too low';

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

router.post('/gas-limit', async (_req: Request, res: Response) => {
  /*
    POST: /gas-limit
  */
  res.status(200).json({
    network: uniswap.network,
    gasLimit: uniswap.gasLimit,
    timestamp: Date.now(),
  });
});

router.get('/start', async (req: Request, res: Response) => {
  /*
    GET: /eth/uniswap/start?pairs=["WETH-USDC"]&gasPrice=30
  */
  const initTime = Date.now();

  // get token contract address and cache paths
  const pairs = JSON.parse(req.query.pairs as string);
  for (let pair of pairs) {
    pair = pair.split('-');
    const baseToken = eth.getERC20Token(pair[0]);
    const quoteToken = eth.getERC20Token(pair[1]);

    // check for valid token symbols
    if (baseToken === undefined || quoteToken === undefined) {
      const undefinedToken = baseToken === undefined ? pair[0] : pair[1];
      res.status(500).json({
        error: `Token ${undefinedToken} contract address not found`,
        message: `Token contract address not found for ${undefinedToken}. Check token list source`,
      });
      return;
    }
  }
  const gasCost = await feesOld.getGasCost(
    fees.getGasPrice(),
    uniswap.gasLimit
  );
  const result = {
    network: eth.networkName,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    pairs: pairs,
    gasPrice: fees.getGasPrice(),
    gasLimit: uniswap.gasLimit,
    gasCost: gasCost,
  };
  res.status(200).json(result);
});

router.post('/trade', async (req: Request, res: Response) => {
  /*
      POST: /trade
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":0.1
        "limitPrice?":1
        "privateKey":{{privateKey}}
        "side":{buy|sell}
      }
  */
  const initTime = Date.now();
  const privateKey = req.body.privateKey;
  const wallet = new ethers.Wallet(privateKey, uniswap.provider);
  const amount = req.body.amount;

  const baseToken = eth.getERC20Token(req.body.base);
  const quoteToken = eth.getERC20Token(req.body.quote);

  if (baseToken && quoteToken) {
    const side = req.body.side.toUpperCase();
    const limitPrice = req.body.limitPrice || null;
    const gasCost = await feesOld.getGasCost(
      fees.getGasPrice(),
      uniswap.gasLimit
    );
    try {
      // fetch the optimal pool mix from uniswap
      const result: any =
        side === 'BUY'
          ? await uniswap.priceSwapOut(
              quoteToken, // tokenIn is quote asset
              baseToken, // tokenOut is base asset
              amount
            )
          : await uniswap.priceSwapIn(
              baseToken, // tokenIn is base asset
              quoteToken, // tokenOut is quote asset
              amount
            );
      if (result && result.trade && result.expectedAmount) {
        const trade = result.trade;
        const expectedAmount = result.expectedAmount;
        if (side === 'BUY') {
          const price = trade.executionPrice.invert().toFixed(8);
          if (!limitPrice || price <= limitPrice) {
            // pass swaps to exchange-proxy to complete trade
            const tx = await uniswap.swapExactOut(
              wallet,
              trade,
              baseToken.address,
              fees.getGasPrice()
            );
            // submit response
            res.status(200).json({
              network: uniswap.network,
              timestamp: initTime,
              latency: latency(initTime, Date.now()),
              base: baseToken.address,
              quote: quoteToken.address,
              amount: amount,
              expectedIn: expectedAmount.toFixed(8),
              price: price,
              gasPrice: fees.getGasPrice(),
              gasLimit: uniswap.gasLimit,
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
          const price = trade.executionPrice.toFixed(8);
          logger.info(`Price: ${price.toString()}`);
          if (!limitPrice || price >= limitPrice) {
            // pass swaps to exchange-proxy to complete trade
            const tx = await uniswap.swapExactIn(
              wallet,
              trade,
              baseToken.address,
              fees.getGasPrice()
            );
            // submit response
            res.status(200).json({
              network: uniswap.network,
              timestamp: initTime,
              latency: latency(initTime, Date.now()),
              base: baseToken.address,
              quote: quoteToken.address,
              amount: parseFloat(req.body.amount),
              expectedOut: expectedAmount.toFixed(8),
              price: parseFloat(price),
              gasPrice: fees.getGasPrice(),
              gasLimit: uniswap.gasLimit,
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
        "side":"buy"
      }
  */
  const initTime = Date.now();
  const amount = req.body.amount;
  const baseToken = eth.getERC20Token(req.body.base);
  const quoteToken = eth.getERC20Token(req.body.quote);
  if (baseToken && quoteToken) {
    const side = req.body.side.toUpperCase();
    const gasCost = await feesOld.getGasCost(
      fees.getGasPrice(),
      uniswap.gasLimit
    );

    try {
      const result: any =
        side === 'BUY'
          ? await uniswap.priceSwapOut(
              quoteToken, // tokenIn is quote asset
              baseToken, // tokenOut is base asset
              amount
            )
          : await uniswap.priceSwapIn(
              baseToken, // tokenIn is base asset
              quoteToken, // tokenOut is quote asset
              amount
            );
      if (result && result.trade && result.expectedAmount) {
        const trade = result.trade;
        const expectedAmount = result.expectedAmount;

        if (trade !== null && expectedAmount !== null) {
          const price =
            side === 'BUY'
              ? trade.executionPrice.invert().toFixed(8)
              : trade.executionPrice.toFixed(8);

          const tradeAmount = parseFloat(amount);
          const expectedTradeAmount = parseFloat(expectedAmount.toFixed(8));
          const tradePrice = parseFloat(price);

          const result = {
            network: uniswap.network,
            timestamp: initTime,
            latency: latency(initTime, Date.now()),
            base: baseToken.address,
            quote: quoteToken.address,
            amount: tradeAmount,
            expectedAmount: expectedTradeAmount,
            price: tradePrice,
            gasPrice: fees.getGasPrice(),
            gasLimit: uniswap.gasLimit,
            gasCost: gasCost,
            trade: trade,
          };
          debug(
            `Price ${side} ${baseToken.symbol}-${
              quoteToken.symbol
            } | amount:${amount} (rate:${tradePrice}) - gasPrice:${fees.getGasPrice()} gasLimit:${
              uniswap.gasLimit
            } estimated fee:${gasCost} ETH`
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
