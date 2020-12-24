import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';

import Balancer from '../services/balancer';

// require('dotenv').config()
const debug = require('debug')('router')

const router = express.Router()
const balancer = new Balancer(process.env.ETHEREUM_CHAIN)

const swapMoreThanMaxPriceError = 'Price too high'
const swapLessThanMaxPriceError = 'Price too low'

const estimateGasLimit = (maxswaps) => {
  const gasLimit = balancer.gasBase + maxswaps * balancer.gasPerSwap
  return gasLimit
}

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: balancer.network,
    provider: balancer.provider.connection.url,
    exchangeProxy: balancer.exchangeProxy,
    subgraphUrl: balancer.subgraphUrl,
    connection: true,
    timestamp: Date.now(),
  })
})

router.post('/gas-limit', async (req, res) => {
  /*
    POST: /buy-price
      x-www-form-urlencoded: {
        "maxSwaps":4
      }
  */
  const paramData = getParamData(req.body)
  const swaps = paramData.maxSwaps
  const maxSwaps = typeof swaps === 'undefined' || parseInt(swaps) === 0 ? balancer.maxSwaps : parseInt(swaps)
  const gasLimit = estimateGasLimit(maxSwaps)

  res.status(200).json({
    network: balancer.network,
    gasLimit: gasLimit,
    timestamp: Date.now(),
  })
})

router.post('/sell-price', async (req, res) => {
  /*
    POST: /sell-price
      x-www-form-urlencoded: {
        "quote":"0x....."
        "base":"0x....."
        "amount":0.1
        "maxSwaps":4
        "base_decimals":18
        "quote_decimals":18
      }
  */

  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const baseTokenAddress = paramData.base;
  const quoteTokenAddress = paramData.quote;
  const baseDenomMultiplier = 10 ** paramData.base_decimals;
  const quoteDenomMultiplier = 10 ** paramData.quote_decimals;
  const amount = new BigNumber(parseInt(paramData.amount * baseDenomMultiplier));
  let maxSwaps
  if (paramData.maxSwaps) {
    maxSwaps = parseInt(paramData.maxSwaps);
  }

  try {
    // fetch the optimal pool mix from balancer-sor
    const [swaps, expectedOut] = await balancer.priceSwapIn(
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount,
      maxSwaps,
    )
    console.log(swaps)
    console.log(expectedOut)

    if (swaps != null && expectedOut != null) {
      const gasLimit = estimateGasLimit(swaps.length)
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedOut: parseInt(expectedOut) / quoteDenomMultiplier,
        price: expectedOut / amount * baseDenomMultiplier / quoteDenomMultiplier,
        gasLimit: gasLimit,
        swaps: swaps,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
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
        "maxSwaps":4
        "base_decimals":18
        "quote_decimals":18
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const baseDenomMultiplier = 10 ** paramData.base_decimals
  const quoteDenomMultiplier = 10 ** paramData.quote_decimals
  const amount =  new BigNumber(parseInt(paramData.amount * baseDenomMultiplier))
  let maxSwaps
  if (paramData.maxSwaps) {
    maxSwaps = parseInt(paramData.maxSwaps)
  }

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedIn } = await balancer.priceSwapOut(
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount,
      maxSwaps,
    )

    if (swaps != null && expectedIn != null) {
      const gasLimit = estimateGasLimit(swaps.length)
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedIn: parseInt(expectedIn) / quoteDenomMultiplier,
        price: expectedIn / amount * baseDenomMultiplier / quoteDenomMultiplier,
        gasLimit: gasLimit,
        swaps: swaps,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
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
        "base_decimals":18
        "quote_decimals":18
        "minPrice":1
        "gasPrice":10
        "maxSwaps":4
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, balancer.provider)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const baseDenomMultiplier = 10 ** paramData.base_decimals
  const quoteDenomMultiplier = 10 ** paramData.quote_decimals
  const amount =  new BigNumber(parseInt(paramData.amount * baseDenomMultiplier))

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }
  let maxSwaps
  if (paramData.maxSwaps) {
    maxSwaps = parseInt(paramData.maxSwaps)
  }

  const minAmountOut = maxPrice / amount *  baseDenomMultiplier
  debug('minAmountOut', minAmountOut)

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedOut } = await balancer.priceSwapIn(
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount,
      maxSwaps,
    )

    const price = expectedOut / amount  * baseDenomMultiplier / quoteDenomMultiplier
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price >= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const tx = await balancer.swapExactIn(
        wallet,
        swaps,
        baseTokenAddress,   // tokenIn is base asset
        quoteTokenAddress,  // tokenOut is quote asset
        amount.toString(),
        parseInt(expectedOut) / quoteDenomMultiplier,
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedOut: expectedOut / quoteDenomMultiplier,
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
        "base_decimals":18
        "quote_decimals":18
        "maxPrice":1
        "gasPrice":10
        "maxSwaps":4
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, balancer.provider)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const baseDenomMultiplier = 10 ** paramData.base_decimals
  const quoteDenomMultiplier = 10 ** paramData.quote_decimals
  const amount =  new BigNumber(parseInt(paramData.amount * baseDenomMultiplier))

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }
  let maxSwaps
  if (paramData.maxSwaps) {
    maxSwaps = parseInt(paramData.maxSwaps)
  }

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedIn } = await balancer.priceSwapOut(
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount,
      maxSwaps,
    )

    const price = expectedIn / amount * baseDenomMultiplier / quoteDenomMultiplier
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price <= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const tx = await balancer.swapExactOut(
        wallet,
        swaps,
        quoteTokenAddress,   // tokenIn is quote asset
        baseTokenAddress,    // tokenOut is base asset
        expectedIn.toString(),
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedIn: expectedIn / quoteDenomMultiplier,
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
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

export default router;
