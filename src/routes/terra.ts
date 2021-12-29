import express from 'express';
import { Request, Response } from 'express';
import { Coin } from '@terra-money/terra.js';
import {
  latency,
  reportConnectionError,
  statusMessages,
} from '../services/utils';
import { logger } from '../services/logger';

import {
  DENOM_UNIT,
  GAS_ADJUSTMENT,
  TERRA_TOKENS,
  ULUNA_GAS_PRICE,
} from '../services/terra';
import Terra from '../services/terra';

const router = express.Router();
const terra: Terra = new Terra();

// constants
const network = terra.lcd.config.chainID;

router.post('/', async (_req: Request, res: Response) => {
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

router.post('/balances', async (req: Request, res: Response) => {
  /*
    POST:
        address:{{address}}
  */
  const initTime = Date.now();

  const address = req.body.address;

  const balances: Record<string, number> = {};

  try {
    await terra.lcd.bank.balance(address).then((bal: any) => {
      bal.toArray().forEach(async (coin: Coin) => {
        const item = coin.toData();
        const denom = item.denom;
        const amount = parseFloat(item.amount) / DENOM_UNIT;
        const symbol = TERRA_TOKENS[denom];
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
  const baseTokenSymbol = req.body.base;
  const quoteTokenSymbol = req.body.quote;

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

  const baseToken = req.body.base;
  const quoteToken = req.body.quote;
  const tradeType = req.body.side.toUpperCase();
  const amount = parseFloat(req.body.amount);

  try {
    const exchangeRate = await terra.getSwapRate(
      baseToken,
      quoteToken,
      amount,
      tradeType
    );

    if (typeof exchangeRate === 'string') {
      res.status(500).json({
        error: 'Unable to getSwapRate',
      });
    } else {
      res.status(200).json({
        network: network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseToken,
        quote: quoteToken,
        amount: amount,
        tradeType: tradeType,
        price: exchangeRate.exchangeRate,
        cost: exchangeRate.costAmount,
        txFee: exchangeRate.txFee,
      });
    }
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
        "privateKey": "mysupersecret"
      }
  */
  const initTime = Date.now();

  const baseToken = req.body.base;
  const quoteToken = req.body.quote;
  const tradeType = req.body.side.toUpperCase();
  const amount = parseFloat(req.body.amount);

  const gasPrice = parseFloat(req.body.gas_price) || ULUNA_GAS_PRICE;

  const gasAdjustment = req.body.gas_adjustment || GAS_ADJUSTMENT;

  const secret = req.body.privateKey;

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
