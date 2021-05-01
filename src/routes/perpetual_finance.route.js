import { ethers } from 'ethers'
import express from 'express'

import { getParamData, latency, statusMessages } from '../services/utils'
import { logger } from '../services/logger'
import PerpetualFinance from '../services/perpetual_finance'

require('dotenv').config()

const router = express.Router()
const perpFi = new PerpetualFinance(process.env.ETHEREUM_CHAIN)
setTimeout(perpFi.update_price_loop.bind(perpFi), 2000)

/*
  GET /
*/
router.get('/', async (req, res) => {
  res.status(200).json({
    network: perpFi.network,
    provider: perpFi.provider.connection.url,
    loadedMetadata: perpFi.loadedMetadata,
    connection: true,
    timestamp: Date.now()
  })
})

/*
  GET /
*/
router.get('/load-metadata', async (req, res) => {
  const loadedMetadata = await perpFi.load_metadata()
  res.status(200).json({
    network: perpFi.network,
    provider: perpFi.provider.connection.url,
    loadedMetadata: loadedMetadata,
    connection: true,
    timestamp: Date.now()
  })
})

/*
  POST: /balances
  x-www-form-urlencoded: {
    privateKey:{{privateKey}}
  }
*/
router.post('/balances', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  const balances = {}
  balances['XDAI'] = await perpFi.getXdaiBalance(wallet)
  balances['USDC'] = await perpFi.getUSDCBalance(wallet)

  try {
    res.status(200).json({
      network: perpFi.network,
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
  }
*/
router.post('/allowances', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey

  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  const approvals = {}
  approvals['USDC'] = await perpFi.getAllowance(wallet)
  try {
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
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
    amount:{{amount}}
  }
*/
router.post('/approve', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let amount
  paramData.amount ? (amount = paramData.amount) : (amount = '1000000000')
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  try {
    // call approve function
    const approval = await perpFi.approve(wallet, amount)
    logger.info('perpFi.route - Approving allowance')
    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      amount: amount,
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

/*
  POST: /open
  x-www-form-urlencoded: {
    side:{{side}}
    pair:{{pair}}
    margin:{{margin}}
    leverage:{{leverage}}
    minBaseAssetAmount:{{minBaseAssetAmount}}
    privateKey:{{privateKey}}
  }
*/
router.post('/open', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const side = paramData.side
  const pair = paramData.pair
  const margin = paramData.margin
  const leverage = paramData.leverage
  const minBaseAssetAmount = paramData.minBaseAssetAmount
  console.log(minBaseAssetAmount)
  const privateKey = paramData.privateKey
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  try {
    // call openPosition function
    const tx = await perpFi.openPosition(
      side,
      margin,
      leverage,
      pair,
      minBaseAssetAmount,
      wallet
    )
    logger.info('perpFi.route - Opening position')
    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      margin: margin,
      side: side,
      leverage: leverage,
      minBaseAssetAmount: minBaseAssetAmount,
      txHash: tx.hash
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
  POST: /close
  x-www-form-urlencoded: {
    minimalQuoteAsset:{{minimalQuoteAsset}}
    privateKey:{{privateKey}}
    pair:{{pair}}
  }
*/
router.post('/close', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const minimalQuoteAsset = paramData.minimalQuoteAsset
  const privateKey = paramData.privateKey
  const pair = paramData.pair
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  try {
    // call closePosition function
    const tx = await perpFi.closePosition(wallet, pair, minimalQuoteAsset)
    logger.info('perpFi.route - Closing position')

    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      minimalQuoteAsset: minimalQuoteAsset,
      txHash: tx.hash
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
  POST: /position
  x-www-form-urlencoded: {
    privateKey:{{privateKey}}
    pair:{{pair}}
  }
*/
router.post('/position', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const pair = paramData.pair
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  try {
    // call getPosition function
    const position = await perpFi.getPosition(wallet, pair)
    logger.info('perpFi.route - getting active position')
    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      position: position
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
  POST: /margin
  x-www-form-urlencoded: {
    privateKey:{{privateKey}}
  }
*/
router.post('/margin', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  let wallet

  try {
    wallet = new ethers.Wallet(privateKey, perpFi.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || 'Error getting wallet',
      message: err
    })
    return
  }

  try {
    // call getAllBalances function
    const allBalances = await perpFi.getActiveMargin(wallet)
    logger.info('perpFi.route - Getting all balances')
    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      margin: allBalances
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
  POST: /receipt
  x-www-form-urlencoded: {
    txHash:{{txHash}}
  }
*/
router.post('/receipt', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const txHash = paramData.txHash
  const txReceipt = await perpFi.provider.getTransactionReceipt(txHash)
  const receipt = {}
  const confirmed = txReceipt && txReceipt.blockNumber ? true : false

  if (txReceipt !== null) {
    receipt.gasUsed = ethers.utils.formatEther(txReceipt.gasUsed)
    receipt.blockNumber = txReceipt.blockNumber
    receipt.confirmations = txReceipt.confirmations
    receipt.status = txReceipt.status
  }

  logger.info(`eth.route - Get TX Receipt: ${txHash}`, {
    message: JSON.stringify(receipt)
  })

  res.status(200).json({
    network: perpFi.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    txHash: txHash,
    confirmed: confirmed,
    receipt: receipt
  })

  return txReceipt
})

/*
  POST: /price
  x-www-form-urlencoded: {
    side:{{side}}
    pair:{{pair}}
    amount:{{amount}}
  }
*/
router.post('/price', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const side = paramData.side
  const pair = paramData.pair
  const amount = paramData.amount

  try {
    // call getPrice function
    const price = await perpFi.getPrice(side, amount, pair)
    logger.info('perpFi.route - Getting price')

    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      side: side,
      price: price
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
  GET
*/
router.get('/pairs', async (req, res) => {
  const initTime = Date.now()

  try {
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      pairs: Object.keys(perpFi.amm)
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
  POST: /funding
  x-www-form-urlencoded: {
    pair:{{pair}}
  }
*/
router.post('/funding', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const pair = paramData.pair

  try {
    // call getFundingRate function
    const fr = await perpFi.getFundingRate(pair)
    logger.info('perpFi.route - Getting funding info')
    // submit response
    res.status(200).json({
      network: perpFi.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      fr: fr
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

export default router
