import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';
import Ethereum from '../services/eth';
import Uniswap from '../services/uniswap';
import Fees from '../services/fees';

require('dotenv').config()

const debug = require('debug')('router')
const router = express.Router()
const eth = new Ethereum(process.env.ETHEREUM_CHAIN)
const uniswap = new Uniswap(process.env.ETHEREUM_CHAIN)
uniswap.generate_tokens()
setTimeout(uniswap.update_pairs.bind(uniswap), 2000)
const fees = new Fees()

const swapMoreThanMaxPriceError = 'Price too high'
const swapLessThanMaxPriceError = 'Price too low'

const estimateGasLimit = () => {
  return uniswap.gasLimit
}

const getErrorMessage = (err) => {
  /*
    [WIP] Custom error message based-on string match
  */
  let message = err
  if (err.includes('failed to meet quorum')) {
    message = 'Failed to meet quorum in Uniswap'
  } else if (err.includes('Invariant failed: ADDRESSES')) {
    message = 'Invariant failed: ADDRESSES'
  } else if (err.includes('"call revert exception')) {
    message = statusMessages.no_pool_available
  } else if (err.includes('"trade" is read-only')) {
    message = statusMessages.no_pool_available
  }
  return message
}

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: uniswap.network,
    provider: uniswap.provider.connection.url,
    uniswap_router: uniswap.router,
    connection: true,
    timestamp: Date.now(),
  })
})

router.post('/gas-limit', async (req, res) => {
  /*
    POST: /buy-price
  */
  const gasLimit = estimateGasLimit()

  try {
    res.status(200).json({
      network: uniswap.network,
      gasLimit: gasLimit,
      timestamp: Date.now(),
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/start', async (req, res) => {
  /*
    POST: /eth/uniswap/start
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":0.1
        "gasPrice":30
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const baseTokenSymbol = paramData.base.toUpperCase()
  const quoteTokenSymbol = paramData.quote.toUpperCase()
  const orderType = paramData.side.toUpperCase()
  const privateKey = paramData.privateKey
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }

  // get token contract address and decimal
  const baseTokenContractInfo = eth.getERC20TokenAddresses(baseTokenSymbol)
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(quoteTokenSymbol)

  // check allowance
  const spender = eth.spenders.balancer
  let wallet
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider)
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = 'Error getting wallet'
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }

  const tokenAddressList = {}
  tokenAddressList[baseTokenContractInfo.address] = baseTokenContractInfo.decimals
  tokenAddressList[quoteTokenContractInfo.address] = quoteTokenContractInfo.decimals

  const allowance = {}
  let decimals
  let approvalAmount

  try {
    await fees.getETHGasStationFee()

    Promise.all(
      Object.keys(tokenAddressList).map(async (key, index) =>
      allowance[key] = await eth.getERC20Allowance(wallet, spender, key, tokenAddressList[key])
      )).then(() => {
      const approvals = {}
      Promise.all(
        Object.keys(allowance).map(async (address, index) => {
          decimals = tokenAddressList[address]
          paramData.approvalAmount
            ? approvalAmount = ethers.utils.parseUnits(paramData.approvalAmount, decimals)
            : approvalAmount = ethers.utils.parseUnits('1000000000', decimals) // approve for 1 billion units if no amount specified
          approvals[address] = allowance[address] === 0 ? await eth.approveERC20(wallet, spender, address, approvalAmount, gasPrice) : ''
        })).then(() => {
      })
    })
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
    return
  }

  const gasLimit = estimateGasLimit()
  const gasCost = await fees.getGasCost(gasPrice, gasLimit)

  // update pool
  const tokenList = orderType === 'BUY'
    ? { in: baseTokenContractInfo.address, out: quoteTokenContractInfo.address }
    : { in: quoteTokenContractInfo.address, out: baseTokenContractInfo.address }
  await uniswap.update_tokens([tokenList.in, tokenList.out])

  const result = {
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    base: baseTokenContractInfo,
    quote: quoteTokenContractInfo,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    gasCost: gasCost,
    pools: uniswap.cachedRoutes.length,
  }
  res.status(200).json(result)
})

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":0.1
        "limitPrice":1
        "gasPrice":10
        "privateKey":{{privateKey}}
        "side":{buy|sell}
      }
  */
  const initTime = Date.now()
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, uniswap.provider)
  const amount = paramData.amount

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base)
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote)
  const baseTokenAddress = baseTokenContractInfo.address
  const quoteTokenAddress = quoteTokenContractInfo.address
  const side = paramData.side.toUpperCase()

  let limitPrice
  if (paramData.limitPrice) {
    limitPrice = parseFloat(paramData.limitPrice)
  }
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }
  const gasLimit = estimateGasLimit()
  const gasCost = await fees.getGasCost(gasPrice, gasLimit)

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedAmount } = side === 'BUY'
      ? await uniswap.priceSwapOut(
        quoteTokenAddress,    // tokenIn is quote asset
        baseTokenAddress,     // tokenOut is base asset
        amount
      )
      : await uniswap.priceSwapIn(
        baseTokenAddress,     // tokenIn is base asset
        quoteTokenAddress,    // tokenOut is quote asset
        amount
      )

    if (side === 'BUY') {
      const price = trade.executionPrice.invert().toSignificant(8)
      logger.info(`uniswap.route - Price: ${price.toString()}`)
      if (!limitPrice || price <= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await uniswap.swapExactOut(
          wallet,
          trade,
          baseTokenAddress,
          gasPrice,
        )
        // submit response
        res.status(200).json({
          network: uniswap.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenAddress,
          quote: quoteTokenAddress,
          amount: amount,
          expectedIn: expectedAmount.toSignificant(8),
          price: price,
          gasPrice: gasPrice,
          gasLimit, gasLimit,
          gasCost, gasCost,
          txHash: tx.hash,
        })
      } else {
        res.status(200).json({
          error: swapMoreThanMaxPriceError,
          message: `Swap price ${price} exceeds limitPrice ${limitPrice}`
        })
        logger.info(`uniswap.route - Swap price ${price} exceeds limitPrice ${limitPrice}`)
      }
    } else {
      // sell
      const price = trade.executionPrice.toSignificant(8)
      logger.info(`Price: ${price.toString()}`)
      if (!limitPrice || price >= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await uniswap.swapExactIn(
          wallet,
          trade,
          baseTokenAddress,
          gasPrice,
        )
        // submit response
        res.status(200).json({
          network: uniswap.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenAddress,
          quote: quoteTokenAddress,
          amount: parseFloat(paramData.amount),
          expectedOut: expectedAmount.toSignificant(8),
          price: parseFloat(price),
          gasPrice: gasPrice,
          gasLimit, gasLimit,
          gasCost: gasCost,
          txHash: tx.hash,
        })
      } else {
        res.status(200).json({
          error: swapLessThanMaxPriceError,
          message: `Swap price ${price} lower than limitPrice ${limitPrice}`
        })
        logger.info(`uniswap.route - Swap price ${price} lower than limitPrice ${limitPrice}`)
      }
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

router.post('/price', async (req, res) => {
  /*
    POST: /price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":1
      }
  */
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const amount = paramData.amount

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base)
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote)
  const baseTokenAddress = baseTokenContractInfo.address
  const quoteTokenAddress = quoteTokenContractInfo.address
  const side = paramData.side.toUpperCase()
  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }
  const gasLimit = estimateGasLimit()
  const gasCost = await fees.getGasCost(gasPrice, gasLimit)

  try {
    // fetch the optimal pool mix from uniswap
    const { trade, expectedAmount } = side === 'BUY'
      ? await uniswap.priceSwapOut(
        quoteTokenAddress,    // tokenIn is quote asset
        baseTokenAddress,     // tokenOut is base asset
        amount
      )
      : await uniswap.priceSwapIn(
        baseTokenAddress,     // tokenIn is base asset
        quoteTokenAddress,    // tokenOut is quote asset
        amount
      )

    if (trade !== null && expectedAmount !== null) {
      const price = side === 'BUY'
        ? trade.executionPrice.invert().toSignificant(8)
        : trade.executionPrice.toSignificant(8)

      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedAmount: parseFloat(expectedAmount.toSignificant(8)),
        price: parseFloat(price),
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        gasCost: gasCost,
        trade: trade,
      })
    } else { // no pool available
      res.status(200).json({
        info: statusMessages.no_pool_available,
        message: ''
      })
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    let reason
    let errCode = 500
    if (Object.keys(err).includes('isInsufficientReservesError')) {
      errCode = 200
      reason = statusMessages.insufficient_reserves + ' in ' + side + ' at Uniswap'
    } else if (Object.getOwnPropertyNames(err).includes('message')) {
      reason = getErrorMessage(err.message)
      if (reason === statusMessages.no_pool_available) {
        errCode = 200
      }
    } else {
      err.reason ? reason = err.reason : reason = statusMessages.operation_error
    }
    res.status(errCode).json({
      error: reason,
      message: err
    })
  }
})

export default router;
