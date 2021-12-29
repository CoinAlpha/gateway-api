import express from 'express';
import { Request, Response } from 'express';
import Sifchain from '../services/sifchain';
import { latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';

const router = express.Router();

const sifchain: Sifchain = new Sifchain();

/* Sifchain core */
import { Asset, Network, format, Amount } from '../../core';

// This function is only meant to demonstrate how to use the /core module
const testCore = () => {
  console.log('---Running core test---');
  const amount = Amount('200');
  const asset = Asset({
    address: '1234568',
    decimals: 18,
    label: 'ETH',
    name: 'Ethereum',
    displaySymbol: 'ETH',
    network: Network.ETHEREUM,
    symbol: 'eth',
    imageUrl: 'http://fooo',
    homeNetwork: Network.ETHEREUM,
  });
  console.log(format(amount, asset));
  console.log('---End of core test---');
};

/*
Get Sifchain network and configuration information
*/
router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  const networkInfoRes = await sifchain.getNetworkInfo();
  const config = sifchain.getConfig();

  testCore();

  res.status(200).json({
    config,
    networkInfo: networkInfoRes.data,
    lcdUrl: sifchain.getLCDURL(),
    connection: true,
    timestamp: Date.now(),
  });
});

/*
Get prices of two tokens:
base & quote
*/
router.post('/price', async (req, res) => {
  /*
    POST:
    x-www-form-urlencoded: {
      "base":"ROWAN"
      "quote":"ATOM"
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
    const exchangeRate = await sifchain.getSwapRate(
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
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseToken,
        quote: quoteToken,
        amount: amount,
        tradeType: tradeType,
        ...exchangeRate,
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

/*
Get Pool information for 'token'
*/
router.post('/pool', async (req, res) => {
  /*
    POST:
    x-www-form-urlencoded: {
      "token":"ATOM"
    }
  */
  const initTime = Date.now();

  const token = req.body.token;

  try {
    const poolData = await sifchain.getPool(token);

    if (typeof poolData === 'string') {
      res.status(500).json({
        error: 'Unable to getSwapRate',
      });
    } else {
      res.status(200).json({
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        ...poolData,
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

export default router;
