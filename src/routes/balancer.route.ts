import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';
import { Request, Response } from 'express';

import { latency, statusMessages } from '../services/utils';

import { EthereumService } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';

import Balancer from '../services/balancer';
import Fees from '../services/fees';
import { logger } from '../services/logger';

const debug = require('debug')('router');
const router = express.Router();

const balancer = new Balancer();
const fees = new Fees();

const ethConfig = new EthereumConfigService();
const eth = new EthereumService(ethConfig);

const swapMoreThanMaxPriceError = 'Price too high';
const swapLessThanMaxPriceError = 'Price too low';

const estimateGasLimit = (swapCost: string) => {
  return parseInt(balancer.gasLimit) + parseInt(swapCost);
};

router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  res.status(200).json({
    network: balancer.network,
    provider: balancer.provider.connection.url,
    vault: balancer.vault,
    subgraphUrl: balancer.subgraphUrl,
    connection: true,
    timestamp: Date.now(),
  });
});

router.post('/gas-limit', async (req: Request, res: Response) => {
  /*
    POST: /gas-limit
  */
  try {
    res.status(200).json({
      network: balancer.network,
      gasLimit: balancer.gasLimit,
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
    GET: /eth/balancer/start?pairs=["BAT-DAI"]&gasPrice=30
  */
  const initTime = Date.now();

  if (typeof req.query.pairs === 'string') {
    const pairs = JSON.parse(req.query.pairs);
    let gasPrice;
    if (typeof req.query.gasPrice === 'string') {
      gasPrice = parseFloat(req.query.gasPrice);
    } else {
      gasPrice = '0';
    }

    // get token contract address pools
    for (let pair of pairs) {
      pair = pair.split('-');
      const baseTokenSymbol = pair[0];
      const quoteTokenSymbol = pair[1];
      const baseTokenContractInfo = eth.getERC20TokenAddress(baseTokenSymbol);
      const quoteTokenContractInfo = eth.getERC20TokenAddress(quoteTokenSymbol);

      // check for valid token symbols

      if (!baseTokenContractInfo && !quoteTokenContractInfo) {
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
    }

    const gasLimit = balancer.gasLimit;
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
    res.status(500).json({ err: 'unexpected pairs type' });
  }
});

router.post('/price', async (req: Request, res: Response) => {
  /*
    POST: /eth/balancer/price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"USDC"
        "amount":0.1
        "side":buy
      }
  */
  const initTime = Date.now();
  // params: base (required), quote (required), amount (required)
  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);

  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const amount = new BigNumber(
      parseFloat(req.body.amount)
    );
    const side = req.body.side.toUpperCase();

    try {
      // fetch the optimal pool mix from balancer-sor
      const { swapInfo, expectedAmount, cost, gasPrice } =
        side === 'BUY'
          ? await balancer.priceSwapOut(
              quoteTokenContractInfo, // tokenIn is quote asset
              baseTokenContractInfo, // tokenOut is base asset
              amount
            )
          : await balancer.priceSwapIn(
              baseTokenContractInfo, // tokenIn is base asset
              quoteTokenContractInfo, // tokenOut is quote asset
              amount
            );

      if (swapInfo != null && parseFloat(expectedAmount) > parseFloat("0")) {
        const gasLimit = estimateGasLimit(cost);
        const gasCost = await fees.getGasCost(gasPrice, gasLimit);

        const tradePrice = expectedAmount.div(amount).toString();

        const result = {
          network: balancer.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenContractInfo.symbol,
          quote: quoteTokenContractInfo.symbol,
          amount: amount.toString(),
          side: side,
          expectedAmount: expectedAmount,
          price: tradePrice,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          gasCost: gasCost,
          swaps: swapInfo.swaps,
        };
        debug(
          `Price ${side} ${baseTokenContractInfo.symbol}-${quoteTokenContractInfo.symbol} | amount:${amount.toString()} (rate:${tradePrice}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`
        );
        res.status(200).json(result);
      } else {
        // no pool available
        res.status(500).json({
          info: statusMessages.no_pool_available,
          message: statusMessages.no_pool_available,
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
      error: 'unknown tokens',
      message: 'unknown tokens',
    });
  }
});

router.post('/trade', async (req: Request, res: Response) => {
  /*
      POST: /trade
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"USDC"
        "amount":0.1
        "limitPrice":1
        "gasPrice":10
        "side":{buy|sell}
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now();
  const privateKey = req.body.privateKey;
  const wallet = new ethers.Wallet(privateKey, balancer.provider);

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);

  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const amount = new BigNumber(
      parseFloat(req.body.amount)
    );

    const side = req.body.side.toUpperCase();

    const limitPrice = parseFloat(req.body.limitPrice || '0');

    try {
      // fetch the optimal pool mix from balancer-sor
      const { swapInfo, expectedAmount, cost, gasPrice } =
        side === 'BUY'
          ? await balancer.priceSwapOut(
              quoteTokenContractInfo, // tokenIn is quote asset
              baseTokenContractInfo, // tokenOut is base asset
              amount
            )
          : await balancer.priceSwapIn(
              baseTokenContractInfo, // tokenIn is base asset
              quoteTokenContractInfo, // tokenOut is quote asset
              amount
            );

      const gasLimit = estimateGasLimit(cost);
      const gasCost = await fees.getGasCost(gasPrice, gasLimit);
      const price = expectedAmount.div(amount).toString();
      logger.info(`Price: ${price}`);

      if (side === 'BUY') {
        if (!limitPrice || parseFloat(price) <= limitPrice) {
          // pass swaps to exchange-proxy to complete trade
          const tx = await balancer.swapExactOut(wallet, swapInfo, gasPrice);

          // submit response
          res.status(200).json({
            network: balancer.network,
            timestamp: initTime,
            latency: latency(initTime, Date.now()),
            base: baseTokenContractInfo.symbol,
            quote: quoteTokenContractInfo.symbol,
            amount: parseFloat(req.body.amount),
            expectedIn: expectedAmount,
            price: price,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            gasCost: gasCost,
            txHash: tx.hash,
          });
        } else {
          res.status(200).json({
            error: swapMoreThanMaxPriceError,
            message: `Swap price ${price} exceeds limitPrice ${limitPrice}`,
          });
          debug(`Swap price ${price} exceeds limitPrice ${limitPrice}`);
        }
      } else { // sell
        if (!limitPrice || parseFloat(price) >= limitPrice) {
          // pass swaps to exchange-proxy to complete trade
          const tx = await balancer.swapExactIn(wallet, swapInfo, gasPrice);
          // submit response
          res.status(200).json({
            network: balancer.network,
            timestamp: initTime,
            latency: latency(initTime, Date.now()),
            base: baseTokenContractInfo.symbol,
            quote: quoteTokenContractInfo.symbol,
            amount: parseFloat(req.body.amount),
            expectedOut: expectedAmount,
            price: price,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            gasCost: gasCost,
            txHash: tx.hash,
          });
        } else {
          res.status(200).json({
            error: swapLessThanMaxPriceError,
            message: `Swap price ${price} lower than limitPrice ${limitPrice}`,
          });
          debug(`Swap price ${price} lower than limitPrice ${limitPrice}`);
        }
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
      error: 'unknown tokens',
      message: 'unknown tokens',
    });
  }
});

export default router;
