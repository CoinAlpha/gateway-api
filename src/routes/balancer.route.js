const express = require('express')
const router = express.Router()
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const utils = require('../services/utils')
const balancer = require('../services/balancer')

router.get('/', (req, res) => {
  res.status(200).send('Balancer')
})

router.get('/get-swaps', async (req, res) => {
  const initTime = Date.now()

  const amount = req.query.amount ? new BigNumber(req.query.amount) : new BigNumber('10000000000000000000');
  const { swaps, expectedOut } = await balancer.getSwaps(amount);

  res.status(200).json({
    network: balancer.network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    amount: amount,
    swaps: swaps,
    expectedOut: expectedOut
  })
})

router.get('/buy', async (req, res) => {
  const initTime = Date.now()
  const privateKey = `0${process.env.ETH_PRIVATE_KEY}` // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, balancer.provider)

  // const amount =  new BigNumber(req.query.amount)
  const amount = ethers.utils.parseEther(req.query.amount)
  const { swaps } = await balancer.getSwaps(amount);
  const totalAmountOut = await balancer.batchSwapExactIn(wallet, swaps, balancer.tokenIn, balancer.tokenOut, amount)

  res.status(200).json({
    network: balancer.network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    swaps: swaps,
    totalAmountOut: totalAmountOut
  })
})

module.exports = router;
