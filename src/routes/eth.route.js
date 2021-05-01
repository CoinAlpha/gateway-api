import { ethers, BigNumber } from 'ethers'
import express from 'express'

import { getParamData, latency, statusMessages } from '../services/utils'
import Ethereum from '../services/eth'
import Fees from '../services/fees'
import { logger } from '../services/logger'

const debug = require('debug')('router')
const router = express.Router()
const eth = new Ethereum(process.env.ETHEREUM_CHAIN)
const spenders = {
  balancer: process.env.EXCHANGE_PROXY,
  uniswap: process.env.UNISWAP_ROUTER
}
const fees = new Fees()

/*
  POST /
*/
router.post('/', async (req, res) => {
  res.status(200).json({
    network: eth.network,
    rpcUrl: eth.provider.connection.url,
    connection: true,
    timestamp: Date.now()
  })
})

/*
    POST: /balances
    x-www-form-urlencoded: {
      privateKey:{{privateKey}}
      tokenList:{{tokenList}}
    }
*/
router.post('/balances', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  // populate token contract info using token symbol list
  const tokenContractList = []
  const tokenList = JSON.parse(paramData.tokenList)
  tokenList.forEach((symbol) => {
    const tokenContractInfo = eth.getERC20TokenAddresses(symbol)
    tokenContractList[symbol] = tokenContractInfo
  })

  const balances = {}

  try {
    balances.ETH = await eth.getETHBalance(wallet, privateKey)
    await Promise.all(
      Object.keys(tokenContractList).map(async (symbol, index) => {
        if (tokenContractList[symbol] !== undefined) {
          const address = tokenContractList[symbol].address
          const decimals = tokenContractList[symbol].decimals
          balances[symbol] = await eth.getERC20Balance(
            wallet,
            address,
            decimals
          )
        } else {
          const err = `Token contract info for ${symbol} not found`
          logger.error('Token info not found', { message: err })
          debug(err)
        }
      })
    )

    console.log('eth.route - Get Account Balance', {
      message: JSON.stringify(tokenList)
    })

    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

/*
    POST: /allowances
    x-www-form-urlencoded: {
      privateKey:{{privateKey}}
      tokenAddressList:{{tokenAddressList}}
      connector:{{connector_name}}
    }
*/
router.post('/allowances', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const spender = spenders[paramData.connector]
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet')
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }

  // populate token contract info using token symbol list
  const tokenContractList = []
  const tokenList = JSON.parse(paramData.tokenList)
  tokenList.forEach((symbol) => {
    const tokenContractInfo = eth.getERC20TokenAddresses(symbol)
    tokenContractList[symbol] = tokenContractInfo
  })

  const approvals = {}
  try {
    await Promise.all(
      Object.keys(tokenContractList).map(async (symbol, index) => {
        const address = tokenContractList[symbol].address
        const decimals = tokenContractList[symbol].decimals
        approvals[symbol] = await eth.getERC20Allowance(
          wallet,
          spender,
          address,
          decimals
        )
      })
    )

    logger.info('eth.route - Getting allowances', {
      message: JSON.stringify(tokenList)
    })

    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      spender: spender,
      approvals: approvals
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

/*
    POST: /balances
    x-www-form-urlencoded: {
      privateKey:{{privateKey}}
      tokenAddressList:{{tokenAddressList}}
      tokenDecimalList:{{tokenDecimalList}}
    }
*/
router.post('/balances-2', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  let tokenAddressList
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(',')
  }

  let tokenDecimalList
  if (paramData.tokenDecimalList) {
    tokenDecimalList = paramData.tokenDecimalList.split(',')
  }

  const balances = {}
  balances.ETH = await eth.getETHBalance(wallet, privateKey)

  try {
    await Promise.all(
      tokenAddressList.map(
        async (value, index) =>
          (balances[value] = await eth.getERC20Balance(
            wallet,
            value,
            tokenDecimalList[index]
          ))
      )
    )

    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances
    })
  } catch (err) {
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

/*
  POST: /allowances
  x-www-form-urlencoded: {
    privateKey:{{privateKey}}
    tokenAddressList:{{tokenAddressList}}
    tokenDecimalList:{{tokenDecimalList}}
    connector:{{connector_name}}
  }
*/
router.post('/allowances-2', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const spender = spenders[paramData.connector]
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  let tokenAddressList
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(',')
  }

  let tokenDecimalList
  if (paramData.tokenDecimalList) {
    tokenDecimalList = paramData.tokenDecimalList.split(',')
  }

  const approvals = {}
  try {
    await Promise.all(
      tokenAddressList.map(
        async (value, index) =>
          (approvals[value] = await eth.getERC20Allowance(
            wallet,
            spender,
            value,
            tokenDecimalList[index]
          ))
      )
    )

    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      spender: spender,
      approvals: approvals
    })
  } catch (err) {
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

/*
  POST: /approve
  x-www-form-urlencoded: {
    privateKey:{{privateKey}}
    tokenAddress:"0x....."
    decimals: {{token_decimals}}
    connector:{{connector_name}}
    amount:{{amount}}
  }
*/
router.post('/approve', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const spender = spenders[paramData.connector]
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  const token = paramData.token
  const tokenContractInfo = eth.getERC20TokenAddresses(token)
  const tokenAddress = tokenContractInfo.address
  const decimals = tokenContractInfo.decimals

  let amount
  paramData.amount
    ? (amount = ethers.utils.parseUnits(paramData.amount, decimals))
    : (amount = ethers.utils.parseUnits('1000000000', decimals)) // approve for 1 billion units if no amount specified

  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }

  try {
    // call approve function
    const approval = await eth.approveERC20(
      wallet,
      spender,
      tokenAddress,
      amount,
      gasPrice
    )
    // console.log('eth.route - Approving allowance', { message: approval })
    // submit response
    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      tokenAddress: tokenAddress,
      spender: spender,
      amount: amount / (1e18).toString(),
      approval: approval
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

router.post('/poll', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const txHash = paramData.txHash
  const txReceipt = await eth.provider.getTransactionReceipt(txHash)
  const receipt = {}
  const confirmed = txReceipt && txReceipt.blockNumber ? true : false

  if (confirmed) {
    receipt.gasUsed = BigNumber.from(txReceipt.gasUsed).toNumber()
    receipt.blockNumber = txReceipt.blockNumber
    receipt.confirmations = txReceipt.confirmations
    receipt.status = txReceipt.status
  }

  logger.info(`eth.route - Get TX Receipt: ${txHash}`, {
    message: JSON.stringify(receipt)
  })

  res.status(200).json({
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    txHash: txHash,
    confirmed: confirmed,
    receipt: receipt
  })

  return txReceipt
})

// Kovan faucet to get test tokens (wip) & weth conversion
// router.post('/get-weth', async (req, res) => {
//   /*
//       POST: /get-weth
//       x-www-form-urlencoded: {
//         gasPrice:{gasPrice}
//         amount:{{amount}}
//         privateKey:{{privateKey}}
//       }
//   */
//   const initTime = Date.now()
//   const paramData = getParamData(req.body)
//   const privateKey = paramData.privateKey
//   let wallet
//   try {
//     wallet = new ethers.Wallet(privateKey, eth.provider)
//   } catch (err) {
//     logger.error(req.originalUrl, { message: err })
//     let reason
//     err.reason ? reason = err.reason : reason = 'Error getting wallet'
//     res.status(500).json({
//       error: reason,
//       message: err
//     })
//     return
//   }
//   const amount = ethers.utils.parseEther(paramData.amount)
//   const tokenAddress = eth.getERC20TokenAddresses('WETH').address
//   let gasPrice
//   if (paramData.gasPrice) {
//     gasPrice = parseFloat(paramData.gasPrice)
//   }

//   try {
//     // call deposit function
//     const response = await eth.deposit(wallet, tokenAddress, amount, gasPrice)

//     // submit response
//     res.status(200).json({
//       network: eth.network,
//       timestamp: initTime,
//       amount: parseFloat(amount),
//       result: response
//     })
//   } catch (err) {
//     logger.error(req.originalUrl, { message: err })
//     let reason
//     err.reason ? reason = err.reason : reason = statusMessages.operation_error
//     res.status(500).json({
//       error: reason,
//       message: err
//     })
//   }
// })

module.exports = router
