import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import Balancer from '../services/balancer';

require('dotenv').config()
const debug = require('debug')('router')

const router = express.Router()
const balancer = new Balancer(process.env.BALANCER_NETWORK)

const denomMultiplier = 1e18
const swapMoreThanMaxPriceError = 'Swap price exceeds maxPrice'
const swapLessThanMaxPriceError = 'Swap price lower than maxPrice'

router.use((req, res, next) => {
  const cert = req.connection.getPeerCertificate()
  if (req.client.authorized) {
    next()
  } else if (cert.subject) {
    res.status(403).send({ error: statusMessages.ssl_cert_invalid })
  } else {
    res.status(401).send({ error: statusMessages.ssl_cert_required })
  }
})

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: balancer.network,
    provider: balancer.provider.connection.url,
    connection: true,
    timestamp: Date.now(),
  })
})

router.post('/sell-price', async (req, res) => {
  /*
    POST: /sell-price
      x-www-form-urlencoded: {
        "quote":"DAI"
        "base":"WETH"
        "amount":0.1
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const base = paramData.base
  const quote = paramData.quote
  const amount = new BigNumber(parseInt(paramData.amount * denomMultiplier))

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedOut } = await balancer.priceSwapIn(
      balancer.erc20Tokens[base],     // tokenIn is base asset
      balancer.erc20Tokens[quote],    // tokenOut is quote asset
      amount,
    )

    if (swaps != null && expectedOut != null) {
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: base,
        quote: quote,
        amount: parseFloat(paramData.amount),
        expectedOut: parseInt(expectedOut) / denomMultiplier,
        price: amount / expectedOut,
        swaps: swaps,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/buy-price', async (req, res) => {
  /*
    POST: /buy-price
      x-www-form-urlencoded: {
        "quote":"DAI"
        "base":"WETH"
        "amount":0.1
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const base = paramData.base
  const quote = paramData.quote
  const amount =  new BigNumber(parseInt(paramData.amount * denomMultiplier))

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedIn } = await balancer.priceSwapOut(
      balancer.erc20Tokens[quote],    // tokenIn is quote asset
      balancer.erc20Tokens[base],     // tokenOut is base asset
      amount,
    )
    if (swaps != null && expectedIn != null) {
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: base,
        quote: quote,
        amount: parseFloat(paramData.amount),
        expectedIn: parseInt(expectedIn) / denomMultiplier,
        price: amount / expectedIn,
        swaps: swaps,
      })
    } else { // no pool available
      res.status(200).json({
        error: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/sell', async (req, res) => {
  /*
      POST: /sell
      x-www-form-urlencoded: {
        "quote":"DAI"
        "base":"WETH"
        "amount":0.1
        "minPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, balancer.provider)
  const base = paramData.base
  const quote = paramData.quote
  const amount =  new BigNumber(parseInt(paramData.amount * denomMultiplier))

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  const minAmountOut = maxPrice / amount * denomMultiplier
  debug('minAmountOut', minAmountOut)

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedOut } = await balancer.priceSwapIn(
      balancer.erc20Tokens[base],     // tokenIn is base asset
      balancer.erc20Tokens[quote],    // tokenOut is quote asset
      amount,
    )

    const price = amount / expectedOut
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price >= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const txObj = await balancer.swapExactIn(
        wallet,
        swaps,
        balancer.erc20Tokens[base],   // tokenIn is base asset
        balancer.erc20Tokens[quote],  // tokenOut is quote asset
        amount.toString(),
        parseInt(expectedOut) / denomMultiplier,
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: base,
        quote: quote,
        amount: parseFloat(paramData.amount),
        expectedOut: expectedOut / denomMultiplier,
        price: price,
        txHash: txObj.transactionHash,
        status: txObj.status,
      })
    } else {
      res.status(200).json({
        error: swapLessThanMaxPriceError,
        message: `Swap price ${price} lower than maxPrice ${maxPrice}`
      })
      debug(`Swap price ${price} lower than maxPrice ${maxPrice}`)
    }
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/buy', async (req, res) => {
  /*
      POST: /buy
      x-www-form-urlencoded: {
        "quote":"DAI"
        "base":"WETH"
        "amount":0.1
        "maxPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, balancer.provider)
  const base = paramData.base
  const quote = paramData.quote
  const amount =  new BigNumber(parseInt(paramData.amount * denomMultiplier))

  let maxPrice
  if (paramData.maxPrice) {
    maxPrice = parseFloat(paramData.maxPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedIn } = await balancer.priceSwapOut(
      balancer.erc20Tokens[quote],    // tokenIn is quote asset
      balancer.erc20Tokens[base],     // tokenOut is base asset
      amount,
    )

    const price = amount / expectedIn
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price <= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const txObj = await balancer.swapExactOut(
        wallet,
        swaps,
        balancer.erc20Tokens[quote],   // tokenIn is quote asset
        balancer.erc20Tokens[base],    // tokenOut is base asset
        expectedIn.toString(),
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: base,
        quote: quote,
        amount: parseFloat(paramData.amount),
        expectedIn: expectedIn / denomMultiplier,
        price: price,
        txHash: txObj.transactionHash,
        status: txObj.status,
      })
    } else {
      res.status(200).json({
        error: swapMoreThanMaxPriceError,
        message: `Swap price ${price} exceeds maxPrice ${maxPrice}`
      })
      debug(`Swap price ${price} exceeds maxPrice ${maxPrice}`)
    }
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

export default router;
