import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { latency } from '../services/utils';
import Ethereum from '../services/eth';

const router = express.Router()
const eth = new Ethereum('kovan')

router.get('/balances', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, eth.provider)

  const balances = {}
  balances.ETH = await eth.getETHBalance(wallet, privateKey)
  Promise.all(
    Object.keys(eth.erc20Tokens).map(async (key) =>
      balances[key] = await eth.getERC20Balance(wallet, eth.erc20Tokens[key])
    )).then(() => {
    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances
    })
  })
})

router.get('/allowances', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, eth.provider)

  // params: spender (required)
  const spender = req.query.spender

  const approvals = {}
  Promise.all(
    Object.keys(eth.erc20Tokens).map(async (key) =>
    approvals[key] = await eth.getERC20Allowance(wallet, spender, eth.erc20Tokens[key])
    )).then(() => {
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        spender: spender,
        approvals: approvals,
      })
    }
  )
})

router.get('/approve', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, eth.provider)

  // params: symbol (required), spender (required), amount (optional)
  const symbol = req.query.symbol
  const spender = req.query.spender
  let amount
  req.query.amount  ? amount = ethers.utils.parseEther(req.query.amount)
                    : amount = ethers.utils.parseEther('1000000000') // approve for 1 billion units if no amount specified
  const tokenAddress = eth.erc20Tokens[symbol]

  // call approve function
  const approval = await eth.approveERC20(wallet, spender, tokenAddress, amount)

  // submit response
  res.status(200).json({
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    symbol: symbol,
    spender: spender,
    amount: amount,
    approval: approval,
  })
})

// Faucet to get test tokens
router.get('/faucet', async (req, res) => {
  const initTime = Date.now()
  const privateKey = `0x${process.env.ETH_PRIVATE_KEY}` // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, eth.provider)

  // params: symbol (optional), amount (optional)
  let symbol
  req.query.symbol  ? symbol = req.query.symbol
                    : symbol = "WETH"
  const tokenAddress = eth.erc20Tokens[symbol]
  let amount
  req.query.amount  ? amount = ethers.utils.parseEther(req.query.amount)
                    : amount = ethers.utils.parseEther("0.5")

  // call deposit function
  const response = await eth.deposit(wallet, tokenAddress, amount)

  // submit response
  res.status(200).json({
    network: eth.network,
    timestamp: initTime,
    symbol: symbol,
    amount: amount,
    result: response
  })

  // When Balancer gives us the faucet ABI, we can use this faucet to get all Kovan tokens
  // const contract = new ethers.Contract(abi.KovanFaucetAddress, abi.KovanFaucetAbi, provider)
  // contract.drip(wallet.address, tokenAddress).then((response) => {
  //   res.status(200).json({
  //     network: network,
  //     timestamp: initTime,
  //     result: response
  //   })
  // })
})

module.exports = router;
