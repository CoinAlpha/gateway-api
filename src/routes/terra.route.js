'use strict';

import express from 'express';
import {
  getParamData,
  latency,
  reportConnectionError,
  statusMessages,
} from '../services/utils';
import { logger } from '../services/logger';

import Terra from '../services/terra';

const router = express.Router();
const terra = new Terra();

// constants
const network = terra.lcd.config.chainID;
const denomUnitMultiplier = terra.denomUnitMultiplier;

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: network,
    lcdUrl: terra.lcd.config.URL,
    gasPrices: terra.lcd.config.gasPrices,
    gasAdjustment: terra.lcd.config.gasAdjustment,
    connection: true,
    timestamp: Date.now(),
  });
});

router.post('/balances', async (req, res) => {
  /*
    POST:
        address:{{address}}
  */
  const initTime = Date.now();

  const paramData = getParamData(req.body);
  const address = paramData.address;

  let balances = {};

  try {
    await terra.lcd.bank.balance(address).then((bal) => {
      bal.toArray().forEach(async (x) => {
        const item = x.toData();
        const denom = item.denom;
        const amount = item.amount / denomUnitMultiplier;
        const symbol = terra.tokens[denom].symbol;
        balances[symbol] = amount;
      });
    });
    logger.info('terra.route - Get Account Balance');
    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances,
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let message;
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    const isAxiosError = err.isAxiosError;
    if (isAxiosError) {
      reason = err.response.status;
      message = err.response.statusText;
    } else {
      message = err;
    }
    res.status(500).json({
      error: reason,
      message: message,
    });
  }
});

router.post('/start', async (req, res) => {
  /*
    POST: /terra/start
      x-www-form-urlencoded: {
        "base":"UST"
        "quote":"KRT"
        "amount":1
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const baseTokenSymbol = paramData.base;
  const quoteTokenSymbol = paramData.quote;

  const result = {
    network: network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    base: baseTokenSymbol,
    quote: quoteTokenSymbol,
  };
  res.status(200).json(result);
});

router.post('/price', async (req, res) => {
  /*
    POST:
    x-www-form-urlencoded: {
      "base":"UST"
      "quote":"KRT"
      "side":"buy" or "sell"
      "amount":1
    }
  */
  const initTime = Date.now();

  const paramData = getParamData(req.body);
  const baseToken = paramData.base;
  const quoteToken = paramData.quote;
  const tradeType = paramData.side.toUpperCase();
  const amount = parseFloat(paramData.amount);

  let exchangeRate;

  try {
    await terra
      .getSwapRate(baseToken, quoteToken, amount, tradeType)
      .then((rate) => {
        exchangeRate = rate;
      })
      .catch((err) => {
        reportConnectionError(res, err);
      });

    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseToken,
      quote: quoteToken,
      amount: amount,
      tradeType: tradeType,
      price: exchangeRate.price.amount,
      cost: exchangeRate.cost.amount,
      txFee: exchangeRate.txFee.amount,
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let message;
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    const isAxiosError = err.isAxiosError;
    if (isAxiosError) {
      reason = err.response.status;
      message = err.response.statusText;
    } else {
      message = err;
    }
    res.status(500).json({
      error: reason,
      message: message,
    });
  }
});

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      data: {
        "base":"UST"
        "quote":"KRT"
        "side":"buy" or "sell"
        "amount":1
        "secret": "mysupersecret"
      }
  */
  const initTime = Date.now();

  const paramData = getParamData(req.body);
  const baseToken = paramData.base;
  const quoteToken = paramData.quote;
  const tradeType = paramData.side.toUpperCase();
  const amount = parseFloat(paramData.amount);
  const gasPrice =
    parseFloat(paramData.gas_price) || terra.lcd.config.gasPrices.uluna;
  const gasAdjustment =
    paramData.gas_adjustment || terra.lcd.config.gasAdjustment;
  const secret = paramData.privateKey;

  let tokenSwaps;

  try {
    await terra
      .swapTokens(
        baseToken,
        quoteToken,
        amount,
        tradeType,
        gasPrice,
        gasAdjustment,
        secret
      )
      .then((swap) => {
        tokenSwaps = swap;
      })
      .catch((err) => {
        reportConnectionError(res, err);
      });

    const swapResult = {
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseToken,
      tradeType: tradeType,
      quote: quoteToken,
      amount: amount,
    };
    Object.assign(swapResult, tokenSwaps);
    logger.info(
      `terra.route - ${tradeType}: ${baseToken}-${quoteToken} - Amount: ${amount}`
    );
    res.status(200).json(swapResult);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let message;
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    const isAxiosError = err.isAxiosError;
    if (isAxiosError) {
      reason = err.response.status;
      message = err.response.statusText;
    } else {
      message = err;
    }
    res.status(500).json({
      error: reason,
      message: message,
    });
  }
});

export default router;
