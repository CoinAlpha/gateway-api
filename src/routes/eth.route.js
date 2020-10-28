import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import Ethereum from '../services/eth';

const router = express.Router()
const eth = new Ethereum(process.env.BALANCER_NETWORK)
const debug = require('debug')('router')

router.post('/balances', async (req, res) => {
  /*
      POST: /balances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, eth.provider)

  const balances = {}
  balances.ETH = await eth.getETHBalance(wallet, privateKey)
  try {
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
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/allowances', async (req, res) => {
  /*
      POST: /allowances
      x-www-form-urlencoded: {
        spender:{{address}}
        privateKey:{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: spender (required)
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, eth.provider)
  const spender = paramData.spender

  const approvals = {}
  try {
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
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/approve', async (req, res) => {
  /*
      POST: /approve
      x-www-form-urlencoded: {
        symbol:WETH
        spender:{{address}}
        privateKey:{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), symbol (required), spender (required), amount (optional), gasPrice (optional)
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, eth.provider)
  const symbol = paramData.symbol
  const spender = paramData.spender
  let amount
  paramData.amount  ? amount = ethers.utils.parseEther(paramData.amount)
                    : amount = ethers.utils.parseEther('1000000000') // approve for 1 billion units if no amount specified
  const tokenAddress = eth.erc20Tokens[symbol]
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  try {
    // call approve function
    const approval = await eth.approveERC20(wallet, spender, tokenAddress, amount, gasPrice)

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
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }
})

// Faucet to get test tokens
router.post('/get-weth', async (req, res) => {
  /*
      POST: /get-weth
      x-www-form-urlencoded: {
        gasPrice:{gasPrice}
        amount:{{amount}}
        privateKey:{{privateKey}}
      }
  */
  const initTime = Date.now()
  // params: primaryKey (required), amount (required), gasPrice (optional)
  const paramData = getParamData(req.body)
  const privateKey = '0x' + paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, eth.provider)
  const amount = ethers.utils.parseEther(paramData.amount)
  const tokenAddress = eth.erc20Tokens['WETH']
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  }

  try {
    // call deposit function
    const response = await eth.deposit(wallet, tokenAddress, amount, gasPrice)

    // submit response
    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      amount: parseFloat(amount),
      result: response
    })
  } catch (err) {
    res.status(500).json({
      error: statusMessages.operation_error,
      message: err
    })
  }

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
