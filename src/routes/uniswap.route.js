import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';
import Uniswap from '../services/uniswap';

require('dotenv').config()
const debug = require('debug')('router')

const router = express.Router()
const uniswap = new Uniswap(process.env.ETHEREUM_CHAIN)
uniswap.generate_tokens()
setTimeout(uniswap.update_pairs.bind(uniswap), 2000)

const swapMoreThanMaxPriceError = 'Price too high'
const swapLessThanMaxPriceError = 'Price too low'

const estimateGasLimit = () => {
  return uniswap.gasLimit
}

const getErrorMessage = (err) => {
  /*
    [WIP] Custom error message based-on string match
  */
  let message = err
  if (err.includes('failed to meet quorum')) {
    message = 'Failed to meet quorum'
  } else if (err.includes('Invariant failed: ADDRESSES')) {
    message = 'Invariant failed: ADDRESSES'
  }
  return message
}

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: uniswap.network,
    provider: uniswap.provider.connection.url,
    uniswap_router: uniswap.router,
    connection: true,
    timestamp: Date.now(),
  })
})

router.post('/gas-limit', async (req, res) => {
  /*
    POST: /buy-price
  */
  const gasLimit = estimateGasLimit()

  try {
    res.status(200).json({
      network: uniswap.network,
      gasLimit: gasLimit,
      timestamp: Date.now(),
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/sell-price', async (req, res) => {
  /*
    POST: /sell-price
      x-www-form-urlencoded: {
        "quote":"0x....."
        "base":"0x....."
        "amount":0.1
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount = paramData.amount

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedOut } = await uniswap.priceSwapIn(
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount
    )

    if (trade !== null && expectedOut !== null) {
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: amount,
        expectedOut: expectedOut.toSignificant(8),
        price: trade.executionPrice.toSignificant(8),
        trade: trade,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    let errCode = 500
    if (Object.keys(err).includes('isInsufficientReservesError')) {
      errCode = 200
      reason = statusMessages.insufficient_reserves + ' in Sell at Uniswap'
    } else if (Object.getOwnPropertyNames(err).includes('message')) {
      reason = getErrorMessage(err.message)
    } else {
      err.reason ? reason = err.reason : reason = statusMessages.operation_error
    }
    res.status(errCode).json({
      error: reason,
      message: err
    })
  }
})

router.post('/buy-price', async (req, res) => {
  /*
    POST: /buy-price
      x-www-form-urlencoded: {
        "quote":"0x....."
        "base":"0x....."
        "amount":0.1
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount = paramData.amount

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedIn } = await uniswap.priceSwapOut(
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount
    )
    if (trade !== null && expectedIn !== null) {
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: amount,
        expectedIn: expectedIn.toSignificant(8),
        price: trade.executionPrice.invert().toSignificant(8),
        trade: trade,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    let errCode = 500
    if (Object.keys(err).includes('isInsufficientReservesError')) {
      errCode = 200
      reason = statusMessages.insufficient_reserves + ' in Buy at Uniswap'
    } else if (Object.getOwnPropertyNames(err).includes('message')) {
      reason = getErrorMessage(err.message)
    } else {
      err.reason ? reason = err.reason : reason = statusMessages.operation_error
    }
    res.status(errCode).json({
      error: reason,
      message: err
    })
  }
})

router.post('/sell', async (req, res) => {
  /*
      POST: /sell
      x-www-form-urlencoded: {
        "quote":"0x....."
        "base":"0x....."
        "amount":0.1
        "minPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, uniswap.provider)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount = paramData.amount

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedOut} = await uniswap.priceSwapIn(
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount
    )

    const price = trade.executionPrice.toSignificant(8)
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price >= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const tx = await uniswap.swapExactIn(
        wallet,
        trade,
        baseTokenAddress,
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: amount,
        expectedOut: expectedOut.toSignificant(8),
        price: price,
        txHash: tx.hash,
      })
    } else {
      res.status(200).json({
        error: swapLessThanMaxPriceError,
        message: `Swap price ${price} lower than maxPrice ${maxPrice}`
      })
      debug(`Swap price ${price} lower than maxPrice ${maxPrice}`)
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/buy', async (req, res) => {
  /*
      POST: /buy
      x-www-form-urlencoded: {
        "quote":"0x....."
        "base":"0x....."
        "amount":0.1
        "maxPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, uniswap.provider)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount = paramData.amount

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedIn } = await uniswap.priceSwapOut(
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount,
    )

    const price = trade.executionPrice.invert().toSignificant(8)
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price <= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const tx = await uniswap.swapExactOut(
        wallet,
        trade,
        baseTokenAddress,
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: amount,
        expectedIn: expectedIn.toSignificant(8),
        price: price,
        txHash: tx.hash,
      })
    } else {
      res.status(200).json({
        error: swapMoreThanMaxPriceError,
        message: `Swap price ${price} exceeds maxPrice ${maxPrice}`
      })
      debug(`Swap price ${price} exceeds maxPrice ${maxPrice}`)
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

export default router;
