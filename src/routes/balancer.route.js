import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import Balancer from '../services/balancer';
import Ethereum from '../services/eth';

require('dotenv').config()
const debug = require('debug')('router')

const router = express.Router()
const balancer = new Balancer(process.env.ETHEREUM_CHAIN)
const eth = new Ethereum(process.env.ETHEREUM_CHAIN)

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
    exchangeProxy: balancer.exchangeProxy,
    subgraphUrl: process.env.REACT_APP_SUBGRAPH_URL,
    connection: true,
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
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount = new BigNumber(parseInt(paramData.amount * denomMultiplier))

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedOut } = await balancer.priceSwapIn(
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount,
    )

    if (swaps != null && expectedOut != null) {
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedOut: parseInt(expectedOut) / denomMultiplier,
        price: expectedOut / amount,
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
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
  const amount =  new BigNumber(parseInt(paramData.amount * denomMultiplier))

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedIn } = await balancer.priceSwapOut(
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount,
    )
    if (swaps != null && expectedIn != null) {
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedIn: parseInt(expectedIn) / denomMultiplier,
        price: expectedIn / amount,
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
        "minPrice":1
        "gasPrice":10
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
      baseTokenAddress,     // tokenIn is base asset
      quoteTokenAddress,    // tokenOut is quote asset
      amount,
    )

    const price = expectedOut / amount
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price >= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const txObj = await balancer.swapExactIn(
        wallet,
        swaps,
        baseTokenAddress,   // tokenIn is base asset
        quoteTokenAddress,  // tokenOut is quote asset
        amount.toString(),
        parseInt(expectedOut) / denomMultiplier,
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
        expectedOut: expectedOut / denomMultiplier,
        price: price,
        gasUsed: parseInt(txObj.gasUsed),
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
  const wallet = new ethers.Wallet(privateKey, balancer.provider)
  const baseTokenAddress = paramData.base
  const quoteTokenAddress = paramData.quote
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
      quoteTokenAddress,    // tokenIn is quote asset
      baseTokenAddress,     // tokenOut is base asset
      amount,
    )

    const price = expectedIn / amount
    debug(`Price: ${price.toString()}`)
    if (!maxPrice || price <= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const txObj = await balancer.swapExactOut(
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
        expectedIn: expectedIn / denomMultiplier,
        price: price,
        gasUsed: parseInt(txObj.gasUsed),
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
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

export default router;
