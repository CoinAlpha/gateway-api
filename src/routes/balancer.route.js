require('dotenv').config()
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { latency } from '../services/utils';
import Balancer from '../services/balancer';

const router = express.Router()
const balancer = new Balancer('kovan')

router.get('/sell-price', async (req, res) => {
  const initTime = Date.now()

  // params: base (required), quote (required), amount (required)
  const base = req.query.base
  const quote = req.query.quote
  const amount = new BigNumber(parseInt(req.query.amount*1e18))

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
    expectedOut: parseInt(expectedOut)/1e18,
    price: amount / expectedOut,
    swaps: swaps,
  })
})


router.get('/buy-price', async (req, res) => {
  const initTime = Date.now()

  // params: base (required), quote (required), amount (required)
  const base = req.query.base
  const quote = req.query.quote
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))

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
    expectedIn: parseInt(expectedIn)/1e18,
    price: amount / expectedIn,
    swaps: swaps,
  })
})

router.get('/sell', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, balancer.provider)

  // params: base (required), quote (required), amount (required), maxPrice (optional), gasPrice (optional)
  const base = req.query.base
  const quote = req.query.quote
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))
  let maxPrice
  if (req.query.maxPrice) {
    maxPrice = parseFloat(req.query.maxPrice)
  }
  let gasPrice
  if (req.query.gasPrice) {
    gasPrice = parseFloat(req.query.gasPrice)
  }

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
      expectedOut: expectedOut/1e18,
      price: price,
      txHash: txObj.transactionHash,
      status: txObj.status,
    })
  } else {
    console.log(`Swap price ${price} exceeds maxPrice ${maxPrice}`)
  }
})


router.get('/buy', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, balancer.provider)

  // params: base (required), quote (required), amount (required), maxPrice (optional), gasPrice (optional)
  const base = req.query.base
  const quote = req.query.quote
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))
  let maxPrice
  if (req.query.maxPrice) {
    maxPrice = parseFloat(req.query.maxPrice)
  }
  let gasPrice
  if (req.query.gasPrice) {
    gasPrice = parseFloat(req.query.gasPrice)
  }

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
      expectedIn: expectedIn/1e18,
      price: price,
      txHash: txObj.transactionHash,
      status: txObj.status,
    })
  } else {
    console.log(`Swap price ${price} exceeds maxPrice ${maxPrice}`)
  }
})

export default router;
