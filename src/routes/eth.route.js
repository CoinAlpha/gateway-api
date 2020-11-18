import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import Ethereum from '../services/eth';

const router = express.Router()
const eth = new Ethereum(process.env.ETHEREUM_CHAIN)
const separator = ','
const spenders = { balancer: process.env.EXCHANGE_PROXY,
                  uniswap: process.env.UNISWAP_ROUTER }

const debug = require('debug')('router')

router.post('/balances', async (req, res) => {
  /*
      POST: /balances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddressList:{{tokenAddressList}}
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = 'Error getting wallet'
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }
  let tokenAddressList
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(separator)
  }
  debug(tokenAddressList)

  const balances = {}
  balances.ETH = await eth.getETHBalance(wallet, privateKey)
  try {
    Promise.all(
      tokenAddressList.map(async (key) =>
        balances[key] = await eth.getERC20Balance(wallet, key)
      )).then(() => {
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        balances: balances
      })
    })
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/allowances', async (req, res) => {
  /*
      POST: /allowances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddressList:{{tokenAddressList}}
        connector:{{connector_name}}"
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const spender = spenders[paramData.connector]
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = 'Error getting wallet'
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }
  let tokenAddressList
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(separator)
  }

  const approvals = {}
  try {
    Promise.all(
      tokenAddressList.map(async (key) =>
      approvals[key] = await eth.getERC20Allowance(wallet, spender, key)
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
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/approve', async (req, res) => {
  /*
      POST: /approve
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddress:"0x....."
        connector:{{connector_name}}"
        amount:{{amount}}
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const spender = spenders[paramData.connector]
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = 'Error getting wallet'
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }
  const tokenAddress = paramData.tokenAddress
  let amount, decimals
  paramData.decimals ? decimals = paramData.decimals
                     : decimals = 18
  paramData.amount  ? amount = ethers.utils.parseUnits(paramData.amount, decimals)
                    : amount = ethers.utils.parseUnits('1000000000', decimals) // approve for 1 billion units if no amount specified
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
      tokenAddress: tokenAddress,
      spender: spender,
      amount: amount / 1e18.toString(),
      approval: approval
    })
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
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
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = 'Error getting wallet'
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }
  const amount = ethers.utils.parseEther(paramData.amount)
  const tokenAddress = eth.erc20KovanTokens['WETH']
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
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

module.exports = router;
