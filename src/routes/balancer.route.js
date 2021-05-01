import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import express from 'express'

import { getParamData, latency, statusMessages } from '../services/utils'

import Ethereum from '../services/eth'
import Balancer from '../services/balancer'
import Fees from '../services/fees'
import { logger } from '../services/logger'

const debug = require('debug')('router')
const router = express.Router()
const eth = new Ethereum(process.env.ETHEREUM_CHAIN)
const balancer = new Balancer(process.env.ETHEREUM_CHAIN)
const fees = new Fees()

const swapMoreThanMaxPriceError = 'Price too high'
const swapLessThanMaxPriceError = 'Price too low'

const estimateGasLimit = (maxswaps) => {
  const gasLimit = balancer.gasBase + maxswaps * balancer.gasPerSwap
  return gasLimit
}

/**
 * Return base information about balancer
 */
router.post('/', (req, res) => {
  res.status(200).json({
    network: balancer.network,
    provider: balancer.provider.connection.url,
    exchangeProxy: balancer.exchangeProxy,
    subgraphUrl: balancer.subgraphUrl,
    connection: true,
    timestamp: Date.now()
  })
})

/*
  POST: /buy-price
    x-www-form-urlencoded: {
      "maxSwaps":4
    }
*/
router.post('/gas-limit', (req, res) => {
  const paramData = getParamData(req.body)

  try {
    const swaps = paramData.maxSwaps
    const maxSwaps =
      typeof swaps === 'undefined' || parseInt(swaps) === 0
        ? balancer.maxSwaps
        : parseInt(swaps)
    const gasLimit = estimateGasLimit(maxSwaps)

    res.status(200).json({
      network: balancer.network,
      gasLimit: gasLimit,
      timestamp: Date.now()
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
  POST: /eth/balancer/start
    x-www-form-urlencoded: {
      "pairs":'["ETH-USDT", ...]'
      "gasPrice":30
    }
*/
router.get('/start', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.query)
  const pairs = JSON.parse(paramData.pairs)
  let gasPrice

  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }

  // get token contract address and cache pools
  for (let pair of pairs) {
    pair = pair.split('-')
    const baseTokenSymbol = pair[0]
    const quoteTokenSymbol = pair[1]
    const baseTokenContractInfo = eth.getERC20TokenAddresses(baseTokenSymbol)
    const quoteTokenContractInfo = eth.getERC20TokenAddresses(quoteTokenSymbol)

    // check for valid token symbols
    if (
      baseTokenContractInfo === undefined ||
      quoteTokenContractInfo === undefined
    ) {
      const undefinedToken =
        baseTokenContractInfo === undefined ? baseTokenSymbol : quoteTokenSymbol

      res.status(500).json({
        error: `Token ${undefinedToken} contract address not found`,
        message: `Token contract address not found for ${undefinedToken}. Check token list source`
      })

      return
    }

    await Promise.allSettled([
      balancer.fetchPool(
        baseTokenContractInfo.address,
        quoteTokenContractInfo.address
      ),
      balancer.fetchPool(
        quoteTokenContractInfo.address,
        baseTokenContractInfo.address
      )
    ])
  }

  const gasLimit = estimateGasLimit(balancer.maxSwaps)
  const gasCost = await fees.getGasCost(gasPrice, gasLimit)

  const result = {
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    pairs: pairs,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    gasCost: gasCost
  }

  console.log('Initializing balancer')
  res.status(200).json(result)
})

/*
  POST: /eth/balancer/price
    x-www-form-urlencoded: {
      "quote":"BAT"
      "base":"USDC"
      "amount":0.1
      "side":buy
    }
*/
router.post('/price', async (req, res) => {
  const initTime = Date.now()
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body)
  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base)
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote)
  const baseTokenAddress = baseTokenContractInfo.address
  const quoteTokenAddress = quoteTokenContractInfo.address
  const baseDenomMultiplier = 10 ** baseTokenContractInfo.decimals
  const quoteDenomMultiplier = 10 ** quoteTokenContractInfo.decimals
  const amount = new BigNumber(parseInt(paramData.amount * baseDenomMultiplier))
  const maxSwaps = balancer.maxSwaps
  const side = paramData.side.toUpperCase()

  let gasPrice
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice)
  } else {
    gasPrice = fees.ethGasPrice
  }

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedAmount } =
      side === 'BUY'
        ? await balancer.priceSwapOut(
            quoteTokenAddress, // tokenIn is quote asset
            baseTokenAddress, // tokenOut is base asset
            amount,
            maxSwaps
          )
        : await balancer.priceSwapIn(
            baseTokenAddress, // tokenIn is base asset
            quoteTokenAddress, // tokenOut is quote asset
            amount,
            maxSwaps
          )

    if (swaps != null && expectedAmount != null) {
      const gasLimit = estimateGasLimit(swaps.length)
      const gasCost = await fees.getGasCost(gasPrice, gasLimit)

      const tradeAmount = parseFloat(amount)
      const expectedTradeAmount =
        parseInt(expectedAmount) / quoteDenomMultiplier
      const tradePrice =
        ((expectedAmount / amount) * baseDenomMultiplier) / quoteDenomMultiplier

      const result = {
        network: balancer.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenContractInfo,
        quote: quoteTokenContractInfo,
        amount: tradeAmount,
        side: side,
        expectedAmount: expectedTradeAmount,
        price: tradePrice,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        gasCost: gasCost,
        swaps: swaps
      }
      debug(
        `Price ${side} ${baseTokenContractInfo.symbol}-${quoteTokenContractInfo.symbol} | amount:${amount} (rate:${tradePrice}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`
      )
      res.status(200).json(result)
    } else {
      // no pool available
      res.status(200).json({
        info: statusMessages.no_pool_available,
        message: statusMessages.no_pool_available
      })
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

/*
    POST: /trade
    x-www-form-urlencoded: {
      "quote":"BAT"
      "base":"USDC"
      "amount":0.1
      "limitPrice":1
      "gasPrice":10
      "side":{buy|sell}
      "privateKey":{{privateKey}}
    }
*/
router.post('/trade', async (req, res) => {
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const privateKey = paramData.privateKey
  const wallet = new ethers.Wallet(privateKey, balancer.provider)

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base)
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote)
  const baseTokenAddress = baseTokenContractInfo.address
  const quoteTokenAddress = quoteTokenContractInfo.address
  const baseDenomMultiplier = 10 ** baseTokenContractInfo.decimals
  const quoteDenomMultiplier = 10 ** quoteTokenContractInfo.decimals
  const amount = new BigNumber(parseInt(paramData.amount * baseDenomMultiplier))

  const maxSwaps = balancer.maxSwaps
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

  try {
    // fetch the optimal pool mix from balancer-sor
    const { swaps, expectedAmount } =
      side === 'BUY'
        ? await balancer.priceSwapOut(
            quoteTokenAddress, // tokenIn is quote asset
            baseTokenAddress, // tokenOut is base asset
            amount,
            maxSwaps
          )
        : await balancer.priceSwapIn(
            baseTokenAddress, // tokenIn is base asset
            quoteTokenAddress, // tokenOut is quote asset
            amount,
            maxSwaps
          )

    const gasLimit = estimateGasLimit(swaps.length)
    const gasCost = await fees.getGasCost(gasPrice, gasLimit)

    if (side === 'BUY') {
      const price =
        ((expectedAmount / amount) * baseDenomMultiplier) / quoteDenomMultiplier

      logger.info(`Price: ${price.toString()}`)

      if (!limitPrice || price <= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await balancer.swapExactOut(
          wallet,
          swaps,
          quoteTokenAddress, // tokenIn is quote asset
          baseTokenAddress, // tokenOut is base asset
          expectedAmount.toString(),
          gasPrice
        )

        // submit response
        res.status(200).json({
          network: balancer.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenContractInfo,
          quote: quoteTokenContractInfo,
          amount: parseFloat(paramData.amount),
          expectedIn: expectedAmount / quoteDenomMultiplier,
          price: price,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          gasCost: gasCost,
          txHash: tx.hash
        })
      } else {
        res.status(200).json({
          error: swapMoreThanMaxPriceError,
          message: `Swap price ${price} exceeds limitPrice ${limitPrice}`
        })
        debug(`Swap price ${price} exceeds limitPrice ${limitPrice}`)
      }
    } else {
      // sell
      const minAmountOut = (limitPrice / amount) * baseDenomMultiplier

      debug('minAmountOut', minAmountOut)
      const price =
        ((expectedAmount / amount) * baseDenomMultiplier) / quoteDenomMultiplier

      logger.info(`Price: ${price.toString()}`)
      if (!limitPrice || price >= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await balancer.swapExactIn(
          wallet,
          swaps,
          baseTokenAddress, // tokenIn is base asset
          quoteTokenAddress, // tokenOut is quote asset
          amount.toString(),
          parseInt(expectedAmount) / quoteDenomMultiplier,
          gasPrice
        )
        // submit response
        res.status(200).json({
          network: balancer.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenContractInfo,
          quote: quoteTokenContractInfo,
          amount: parseFloat(paramData.amount),
          expectedOut: expectedAmount / quoteDenomMultiplier,
          price: price,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          gasCost: gasCost,
          txHash: tx.hash
        })
      } else {
        res.status(200).json({
          error: swapLessThanMaxPriceError,
          message: `Swap price ${price} lower than limitPrice ${limitPrice}`
        })
        debug(`Swap price ${price} lower than limitPrice ${limitPrice}`)
      }
    }
  } catch (err) {
    logger.error(req.originalUrl, { message: err })
    res.status(500).json({
      error: err.reason || statusMessages.operation_error,
      message: err
    })
  }
})

export default router
