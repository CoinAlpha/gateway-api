'use strict';

const express = require('express');
const router = express.Router();
const BigNumber = require('bignumber.js');
const debug = require('debug')('router');
const spawn = require('child_process').spawn;

const network = 'celo';
const celocli = 'celocli';
const DENOM_UNIT_MULTIPLIER = BigNumber('1e+18');

const hbUtils = require('../services/utils');
const separator = '=>';

router.use((req, res, next) => {
  debug('celo route:', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.status(200).send(network);
});

router.get('/status', (req, res) => {
  /*
    return if the celocli ultralight node is synced
  */

  const nodeSync = spawn(celocli, ['node:synced']);

  let err_message = [],
    out_message = [];

  nodeSync.stdout.on('data', (out) => {
    out_message.push(out.toString().trim());
    debug('out_message', out_message);
  });

  nodeSync.stderr.on('data', (err) => {
    err_message.push(err.toString().trim());
    debug('err_message', err_message);
  });

  nodeSync.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({
        synced: out_message[0].toLowerCase() === 'true',
        message: err_message.join(''),
      });
    } else {
      res.status(401).json({
        error: err_message.join(''),
      });
    }
  });
});

router.get('/price', (req, res) => {
  /*
    api request format:
      /price?trading_pair=CELO-CUSD&trade_type=sell&amount=1.2345
  */
  const keyFormat = ['trading_pair', 'trade_type', 'amount'];

  const initTime = Date.now();

  const paramData = hbUtils.getParamData(req.query, keyFormat);
  const tradingPair = paramData.trading_pair;
  const requestAmount = paramData.amount;
  const amount = parseFloat(requestAmount) * DENOM_UNIT_MULTIPLIER;
  debug('params', req.params);
  debug('paramData', paramData);

  const nodeSync = spawn(celocli, ['exchange:show', '--amount', amount]);

  let err_message = [],
    out_message = [];

  nodeSync.stdout.on('data', (out) => {
    out_message.push(out.toString().trim());
  });

  nodeSync.stderr.on('data', (err) => {
    err_message.push(err.toString().trim());
  });

  nodeSync.on('close', (code) => {
    let exchange_rates = {};
    let price;

    if (code === 0) {
      // extract exchange rate from cli output
      out_message.forEach((item, _index) => {
        if (item.includes(separator)) {
          let exchangeInfo = item.split(separator);
          let base = exchangeInfo[0].trim().split(' ');
          let quote = exchangeInfo[1].trim().split(' ');
          let market = [base[1].toUpperCase(), quote[1].toUpperCase()].join(
            '-'
          );
          exchange_rates[market] = quote[0] / DENOM_UNIT_MULTIPLIER;
          debug(exchangeInfo, exchange_rates);
        }
      });

      price = exchange_rates[tradingPair];

      const result = Object.assign(paramData, {
        price: price,
        timestamp: initTime,
        latency: hbUtils.latency(initTime, Date.now()),
      });
      res.status(200).json(result);
    }
  });
});

router.get('/balance', (req, res) => {
  /*
    api request format:
      /balance?address=0x87A4...b120
  */
  const keyFormat = ['address'];
  const paramData = hbUtils.getParamData(req.query, keyFormat);
  const address = paramData.address;
  debug(paramData);

  const balance = spawn(celocli, ['account:balance', address]);

  let err_message = [],
    out_message = [];
  let walletBalances = {};

  balance.stdout.on('data', (out) => {
    out_message.push(out.toString().trim());
    debug(out_message);
  });

  balance.stderr.on('data', (err) => {
    err_message.push(err.toString().trim());
    debug(err_message);
  });

  balance.on('close', (code) => {
    if (code === 0) {
      out_message.forEach((item, _index) => {
        // key indicator in balance result: "celo", "gold", "lockedcelo", "lockedgold", "usd", "pending"
        if (
          item.toLowerCase().includes('lockedcelo') ||
          item.toLowerCase().includes('lockedgold')
        ) {
          let balanceArray = item.split('\n');
          balanceArray.forEach((x) => {
            let keyValue = x.split(':');
            walletBalances[keyValue[0].trim()] =
              keyValue[1].trim() / DENOM_UNIT_MULTIPLIER;
          });
          debug('walletBalances', walletBalances);
        }
      });

      res.status(200).json({
        address: address,
        balance: walletBalances,
        timestamp: Date.now(),
      });
    } else {
      res.status(401).json({
        error: err_message,
      });
    }
  });
});

router.post('/unlock', (req, res) => {
  /*
    api request format:
      POST: /balance
      data: {
        "address": "0x87A4...b120",
        "secret": "mysupersecret"
      }
  */
  const keyFormat = ['address', 'secret'];
  const paramData = hbUtils.getParamData(req.body, keyFormat);
  const address = paramData.address;
  const secret = paramData.secret;

  debug(paramData);
  debug(req.body);

  const lockStatus = spawn(celocli, [
    'account:unlock',
    address,
    '--password',
    secret,
  ]);

  let err_message = [],
    out_message = [];

  lockStatus.stdout.on('data', (out) => {
    out_message.push(out.toString().trim());
    debug(out_message);
  });

  lockStatus.stderr.on('data', (err) => {
    err_message.push(err.toString().trim());
    debug(err_message);
  });

  lockStatus.on('close', (code) => {
    let unlocked = false;
    if (code === 0) {
      if (out_message.length > 0) {
        out_message.forEach((item, _index) => {
          if (item.includes(separator)) {
            debug('item', item);
          }
        });
      } else {
        unlocked = true;
      }
      res.status(200).json({
        unlocked: unlocked,
        message: out_message.join(),
        timestamp: Date.now(),
      });
    } else {
      res.status(401).json({
        error: err_message.join(),
      });
    }
  });
});

router.post('/trade', (req, res) => {
  /*
    api request format:
      POST: /trade
      data: {
        "trading_pair": "CELO-CUSD",
        "trade_type": "buy",
        "amount": 1.234,
        "price": 3.512
      }
  */
  const keyFormat = ['trading_pair', 'trade_type', 'amount', 'price'];
  const paramData = hbUtils.getParamData(req.body, keyFormat);
  debug(paramData);
  // const result = Object.assign(paramData, {
  //   message: 'WIP',
  //   timestamp: Date.now()
  // })
  res.status(200).json({ status: 'WIP' });
});

module.exports = router;
