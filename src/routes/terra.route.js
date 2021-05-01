'use strict'

import express from 'express'
import {
  getParamData,
  latency,
  reportConnectionError,
  statusMessages
} from '../services/utils'
import { logger } from '../services/logger'

import Terra from '../services/terra'

const debug = require('debug')('router')
const router = express.Router()
const terra = new Terra()

// constants
const network = terra.lcd.config.chainID
const denomUnitMultiplier = terra.denomUnitMultiplier

/*
  POST /
*/
router.post('/', async (req, res) => {
  res.status(200).json({
    network: network,
    lcdUrl: terra.lcd.config.URL,
    gasPrices: terra.lcd.config.gasPrices,
    gasAdjustment: terra.lcd.config.gasAdjustment,
    connection: true,
    timestamp: Date.now()
  })
})

/*
  POST:
      address:{{address}}
*/
router.post('/balances', async (req, res) => {
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const address = paramData.address

  let balances = {}

  try {
    await terra.lcd.bank.balance(address).then((bal) => {
      bal.toArray().forEach(async (x) => {
        const item = x.toData()
        const denom = item.denom
        const amount = item.amount / denomUnitMultiplier
        const symbol = terra.tokens[denom].symbol
        balances[symbol] = amount
      })
    })

    logger.info('terra.route - Get Account Balance')

    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let message
    let reason

    if (err.isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      reason = err.reason || statusMessages.operation_error
      message = err
    }

    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

/*
  POST: /terra/start
    x-www-form-urlencoded: {
      "base":"UST"
      "quote":"KRT"
      "amount":1
    }
*/
router.post('/start', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const baseTokenSymbol = paramData.base
  const quoteTokenSymbol = paramData.quote

  const result = {
    network: network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    base: baseTokenSymbol,
    quote: quoteTokenSymbol
  }
  res.status(200).json(result)
})

/*
  POST:
  x-www-form-urlencoded: {
    "base":"UST"
    "quote":"KRT"
    "side":"buy" or "sell"
    "amount":1
  }
*/
router.post('/price', async (req, res) => {
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const tradeType = paramData.side.toUpperCase()
  const amount = parseFloat(paramData.amount)

  let exchangeRate

  try {
    await terra
      .getSwapRate(baseToken, quoteToken, amount, tradeType)
      .then((rate) => {
        exchangeRate = rate
      })
      .catch((err) => {
        reportConnectionError(res, err)
      })

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
      txFee: exchangeRate.txFee.amount
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let message
    let reason

    if (err.isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      reason = err.reason || statusMessages.operation_error
      message = err
    }

    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

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
router.post('/trade', async (req, res) => {
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const tradeType = paramData.side.toUpperCase()
  const amount = parseFloat(paramData.amount)
  const gasPrice =
    parseFloat(paramData.gas_price) || terra.lcd.config.gasPrices.uluna
  const gasAdjustment =
    paramData.gas_adjustment || terra.lcd.config.gasAdjustment
  const secret = paramData.privateKey

  try {
    const tokenSwaps = await terra
      .swapTokens(
        baseToken,
        quoteToken,
        amount,
        tradeType,
        gasPrice,
        gasAdjustment,
        secret
      )
      .catch(() => reportConnectionError(res, err))

    const swapResult = {
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseToken,
      tradeType: tradeType,
      quote: quoteToken,
      amount: amount,
      ...tokenSwaps
    }

    logger.info(
      `terra.route - ${tradeType}: ${baseToken}-${quoteToken} - Amount: ${amount}`
    )

    res.status(200).json(swapResult)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let message
    let reason

    if (err.isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      reason = err.reason || statusMessages.operation_error
      message = err
    }

    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

module.exports = router
