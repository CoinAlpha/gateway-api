require('dotenv').config()
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { latency } from '../services/utils';
import Balancer from '../services/balancer';

const router = express.Router()
const balancer = new Balancer('kovan')

router.get('/price', async (req, res) => {
  const initTime = Date.now()

  // params: base (required), quote (required), side (required), amount (required)
  const base = req.query.base
  const quote = req.query.quote
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))
  const side = req.query.side

  // fetch the optimal pool mix from balancer-sor
  const { swaps, expectedOut } = await balancer.getSwaps(
    balancer.erc20Tokens[base], 
    balancer.erc20Tokens[quote], 
    amount,
    side,
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

router.get('/trade', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, balancer.provider)

  // params: base (required), quote (required), amount (required), side (required), maxPrice (optional), gasPrice (optional)
  const base = req.query.base
  const quote = req.query.quote
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))
  const side = req.query.side
  let maxPrice
  if (req.query.maxPrice) {
    maxPrice = parseFloat(req.query.maxPrice)
  }
  let gasPrice
  if (req.query.gasPrice) {
    gasPrice = parseFloat(req.query.gasPrice)
  }

  // fetch the optimal pool mix from balancer-sor and pass them to exchange-proxy
  const { swaps, expectedOut } = await balancer.getSwaps(
    balancer.erc20Tokens[base], 
    balancer.erc20Tokens[quote], 
    amount,
    side,
  )
  const price = amount / expectedOut
  if (!maxPrice || price <= maxPrice) {
    // pass swaps to exchange-proxy to complete trade

    let txHash
    if (side === 'sell') {
      txHash = await balancer.batchSwapExactIn(
        wallet, 
        swaps, 
        balancer.erc20Tokens[base], 
        balancer.erc20Tokens[quote],
        amount.toString(),
        gasPrice,
      )
    } else {
      txHash = await balancer.batchSwapExactOut(
        wallet, 
        swaps, 
        balancer.erc20Tokens[base], 
        balancer.erc20Tokens[quote],
        amount.toString(),
        gasPrice,
      )
    }

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
      txHash: txHash,
    })
  } else {
    console.log(`Swap price ${price} exceeds maxPrice ${maxPrice}`)
  }
})

export default router;
