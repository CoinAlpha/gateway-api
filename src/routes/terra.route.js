'use strict'

import express from 'express'
import { MnemonicKey, Coin, MsgSwap, isTxError } from '@terra-money/terra.js'
import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import { getConfig } from '../services/config';

import Terra from '../services/terra';
import e from 'express';

const debug = require('debug')('router')
const router = express.Router();
const ENV_CONFIG = getConfig()
const terra = new Terra(ENV_CONFIG.TERRA)

// constants
const network = terra.lcd.config.chainID
const denomUnitMultiplier = terra.denomUnitMultiplier

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
    timestamp: Date.now()
  })
})

router.post('/balances', async (req, res) => {
  /*
    POST:
        address:{{address}}
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const address = paramData.address
  debug(paramData)

  let balances = {}

  try {
    await terra.lcd.bank.balance(address).then(bal => {
      bal.toArray().forEach(async (x) => {
        const item = x.toData()
        const denom = item.denom
        const amount = item.amount / denomUnitMultiplier
        const symbol = terra.tokens[denom].symbol
        balances[symbol] = amount
      })
    })
    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances,
    })
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

router.post('/price', async (req, res) => {
  /*
    POST:
    x-www-form-urlencoded: {
      "base":"UST"
      "quote":"KRT"
      "trade_type":"buy" or "sell"
      "amount":1
    }
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const tradeType = paramData.trade_type
  const amount = parseFloat(paramData.amount)
  debug('paramData', paramData)

  const symbols = [baseToken, quoteToken]
  let exchangeRate

  try {
    await terra.getSwapRate(baseToken, quoteToken, amount, tradeType).then((rate) => {
      exchangeRate = rate
    }).catch((err) => {
      reportConnectionError(res, err)
    })

    debug('exchangeRate', exchangeRate)

    res.status(200).json(
      {
        network: network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseToken,
        quote: quoteToken,
        amount: amount,
        tradeType: tradeType,
        price: {
          amount: exchangeRate.price.amount,
          token: exchangeRate.price.token
        },
        cost: {
          amount: exchangeRate.cost.amount,
          token: exchangeRate.cost.token
        }
        // swapIn: exchangeRate.swapIn,
        // swapOut: exchangeRate.swapOut,
        // tobinTax: terra.tobinTax,
        // minSpread: terra.minSpread
      }
    )
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      data: {
        "base":"UST"
        "quote":"KRT"
        "trade_type":"buy" or "sell"
        "amount":1
        "secret": "mysupersecret"
      }
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const tradeType = paramData.trade_type
  const amount = parseFloat(paramData.amount)
  const gasPrice = parseFloat(paramData.gas_price) || null
  const gasAdjustment = paramData.gas_adjustment || null
  const secret = paramData.secret

  let tokenSwaps

  try {
    await terra.swapTokens(baseToken, quoteToken, amount, tradeType, gasPrice, gasAdjustment, secret).then((swap) => {
      tokenSwaps = swap
    }).catch((err) => {
      reportConnectionError(res, err)
    })

    const swapResult = {
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseToken,
      tradeType: tradeType,
      quote: quoteToken,
      amount: amount,
      // gasPrice: gasPrice
    }
    debug('tokenSwaps', tokenSwaps)
    Object.assign(swapResult, tokenSwaps);
    res.status(200).json(
      swapResult
    )
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

module.exports = router;
