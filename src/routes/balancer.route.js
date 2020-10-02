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

  // params: tokenIn (required), tokenOut (required), amount (required)
  const tokenIn = req.query.tokenIn
  const tokenOut = req.query.tokenOut
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))

  // fetch the optimal pool mix from balancer-sor
  const { swaps, expectedOut } = await balancer.getSwaps(
    balancer.erc20Tokens[tokenIn], 
    balancer.erc20Tokens[tokenOut], 
    amount,
  )

  res.status(200).json({
    network: balancer.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amount: parseFloat(req.query.amount),
    expectedOut: parseInt(expectedOut)/1e18,
    swaps: swaps,
  })
})

router.get('/trade', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  // params: tokenIn (required), tokenOut (required), amount (required), maxPrice (optional)
  const tokenIn = req.query.tokenIn
  const tokenOut = req.query.tokenOut
  const amount =  new BigNumber(parseInt(req.query.amount*1e18))
  const amountString = (parseInt(req.query.amount*1e18)).toString()

  let maxPrice
  req.query.maxPrice  ? maxPrice = new BigNumber(req.query.maxPrice)
                      : maxPrice = new BigNumber('0')

  // fetch the optimal pool mix from balancer-sor and pass them to exchange-proxy
  const { swaps, expectedOut } = await balancer.getSwaps(
    balancer.erc20Tokens[tokenIn], 
    balancer.erc20Tokens[tokenOut], 
    amount
  )
  // pass swaps to exchange-proxy to complete trade
  const totalAmountOut = await balancer.batchSwapExactIn(
    wallet, 
    swaps, 
    balancer.erc20Tokens[tokenIn], 
    balancer.erc20Tokens[tokenOut],
    amountString,
  )

  // submit response
  res.status(200).json({
    network: network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amount: parseFloat(req.query.amount),
    totalAmountOut: totalAmountOut,
  })

})

// router.get('/get-swaps', async (req, res) => {
//   const initTime = Date.now()

//   const amount = req.query.amount ? new BigNumber(req.query.amount) : new BigNumber('10000000000000000000');
//   const { swaps, expectedOut } = await balancer.getSwaps(amount);

//   res.status(200).json({
//     network: balancer.network,
//     timestamp: initTime,
//     latency: latency(initTime, Date.now()),
//     amount: amount,
//     swaps: swaps,
//     expectedOut: expectedOut
//   })
// })

// router.get('/buy', async (req, res) => {
//   const initTime = Date.now()
//   const privateKey = `0${process.env.ETH_PRIVATE_KEY}` // replace by passing this in as param
//   const wallet = new ethers.Wallet(privateKey, balancer.provider)

//   // const amount =  new BigNumber(req.query.amount)
//   const amount = ethers.utils.parseEther(req.query.amount)
//   const { swaps } = await balancer.getSwaps(amount);
//   const totalAmountOut = await balancer.batchSwapExactIn(wallet, swaps, balancer.tokenIn, balancer.tokenOut, amount)

//   res.status(200).json({
//     network: balancer.network,
//     timestamp: initTime,
//     latency: latency(initTime, Date.now()),
//     swaps: swaps,
//     totalAmountOut: totalAmountOut
//   })
// })

export default router;
