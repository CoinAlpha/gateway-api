import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import Balancer from '../services/balancer';

require('dotenv').config()
const debug = require('debug')('router')

const router = express.Router()
const balancer = new Balancer('kovan')

const denomMultiplier = 1e18
const swapPriceError = 'Swap price exceeds maxPrice'

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

router.get('/sell-price', async (req, res) => {
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.query)
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

    res.status(200).json({
      network: balancer.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: base,
      quote: quote,
      amount: parseFloat(req.query.amount),
      expectedOut: parseInt(expectedOut) / denomMultiplier,
      price: amount / expectedOut,
      swaps: swaps,
    })
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.get('/buy-price', async (req, res) => {
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.query)
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

    res.status(200).json({
      network: balancer.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: base,
      quote: quote,
      amount: parseFloat(req.query.amount),
      expectedIn: parseInt(expectedIn) / denomMultiplier,
      price: amount / expectedIn,
      swaps: swaps,
    })
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/sell', async (req, res) => {
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (optional), gasPrice (optional)
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
    const { swaps, expectedOut } = await balancer.priceSwapIn(
      balancer.erc20Tokens[base],     // tokenIn is base asset
      balancer.erc20Tokens[quote],    // tokenOut is quote asset
      amount,
    )

    const price = amount / expectedOut
    console.log(`Price: ${price.toString()}`)
    if (!maxPrice || price <= maxPrice) {
      // pass swaps to exchange-proxy to complete trade
      const txObj = await balancer.swapExactIn(
        wallet,
        swaps,
        balancer.erc20Tokens[base],   // tokenIn is base asset
        balancer.erc20Tokens[quote],  // tokenOut is quote asset
        amount.toString(),
        gasPrice,
      )

      // submit response
      res.status(200).json({
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: base,
        quote: quote,
        amount: parseFloat(req.query.amount),
        expectedOut: expectedOut / denomMultiplier,
        price: price,
        txHash: txObj.transactionHash,
        status: txObj.status,
      })
    } else {
      res.status(200).json({
        error: swapPriceError,
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

router.post('/buy', async (req, res) => {
  /*
      POST: /buy
      x-www-form-urlencoded: {
        "quote":"DAI"
        "base":"WETH"
        "amount":0.1
        "maxPrice":1
        "privateKey":{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (optional), gasPrice (optional)
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
    console.log(`Price: ${price.toString()}`)
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
        amount: parseFloat(req.query.amount),
        expectedIn: expectedIn / denomMultiplier,
        price: price,
        txHash: txObj.transactionHash,
        status: txObj.status,
      })
    } else {
      res.status(200).json({
        warning: swapPriceError,
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
