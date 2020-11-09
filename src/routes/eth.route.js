import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import { getConfig } from '../services/config';
import Ethereum from '../services/eth';
import Balancer from '../services/balancer';

const router = express.Router()
const envConfig = getConfig()
const eth = new Ethereum(envConfig.balancer.BALANCER_NETWORK)
const balancer = new Balancer(envConfig.balancer.BALANCER_NETWORK)
const seperator = ','

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
    tokenAddressList = paramData.tokenAddressList.split(seperator)
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
        currentGasPrice: currentGasPrice,
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
  const spender = balancer.exchangeProxy
  let tokenAddressList
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(seperator)
  }
  debug(tokenAddressList)

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
        tokenAddress:"0x....."
        privateKey:{{privateKey}}
        amount:{{amount}}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), tokenAddress (required), amount (optional), gasPrice (required)
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
  const tokenAddress = paramData.tokenAddress
  const spender = balancer.exchangeProxy
  let amount
  paramData.amount  ? amount = ethers.utils.parseEther(paramData.amount)
                    : amount = ethers.utils.parseEther('1000000000') // approve for 1 billion units if no amount specified
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
  // params: primaryKey (required), amount (required), gasPrice (optional)
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
