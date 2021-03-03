import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';

import Ethereum from '../services/eth';
import Balancer from '../services/balancer';
import Fees from '../services/fees';
import { logger } from '../services/logger';

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

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: balancer.network,
    provider: balancer.provider.connection.url,
    exchangeProxy: balancer.exchangeProxy,
    subgraphUrl: balancer.subgraphUrl,
    connection: true,
    timestamp: Date.now(),
  })
})

router.post('/gas-limit', async (req, res) => {
  /*
    POST: /buy-price
      x-www-form-urlencoded: {
        "maxSwaps":4
      }
  */
  const paramData = getParamData(req.body)

  try {
    const swaps = paramData.maxSwaps
    const maxSwaps = typeof swaps === 'undefined' || parseInt(swaps) === 0 ? balancer.maxSwaps : parseInt(swaps)
    const gasLimit = estimateGasLimit(maxSwaps)

    res.status(200).json({
      network: balancer.network,
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
    POST: /eth/balancer/start
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"USDC"
        "amount":0.1
        "gasPrice":30
      }
  */
  const initTime = Date.now()
  const paramData = getParamData(req.body)
  const baseTokenSymbol = paramData.base.toUpperCase()
  const quoteTokenSymbol = paramData.quote.toUpperCase()
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

  const gasLimit = estimateGasLimit(balancer.maxSwaps)
  const gasCost = await fees.getGasCost(gasPrice, gasLimit)

  // update pool
  await balancer.fetchPool(baseTokenContractInfo.address, quoteTokenContractInfo.address)

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
    pools: balancer.cachedPools.pools.length,
  }
  console.log('caching swap pools (total)', balancer.cachedPools.pools.length)
  res.status(200).json(result)
})

router.post('/price', async (req, res) => {
  /*
    POST: /eth/balancer/price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"USDC"
        "amount":0.1
        "side":buy
      }
  */
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
    const { swaps, expectedAmount } = side === 'BUY'
      ? await balancer.priceSwapOut(
        quoteTokenAddress,    // tokenIn is quote asset
        baseTokenAddress,     // tokenOut is base asset
        amount,
        maxSwaps,
      )
      : await balancer.priceSwapIn(
        baseTokenAddress,     // tokenIn is base asset
        quoteTokenAddress,    // tokenOut is quote asset
        amount,
        maxSwaps,
      )

    if (swaps != null && expectedAmount != null) {
      const gasLimit = estimateGasLimit(swaps.length)
      const gasCost = await fees.getGasCost(gasPrice, gasLimit)

      const tradeAmount = parseFloat(amount)
      const expectedTradeAmount = parseInt(expectedAmount) / quoteDenomMultiplier
      const tradePrice = expectedAmount / amount * baseDenomMultiplier / quoteDenomMultiplier

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
        swaps: swaps,
      }
      debug(`Price ${baseTokenContractInfo.symbol}-${quoteTokenContractInfo.symbol} | ${expectedTradeAmount}(@${tradePrice}) - ${gasPrice}/${gasLimit}/${gasCost} ETH`)
      res.status(200).json(result)
    } else { // no pool available
      res.status(200).json({
        info: statusMessages.no_pool_available,
        message: statusMessages.no_pool_available
      })
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

router.post('/trade', async (req, res) => {
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
    const { swaps, expectedAmount } = side === 'BUY'
      ? await balancer.priceSwapOut(
        quoteTokenAddress,    // tokenIn is quote asset
        baseTokenAddress,     // tokenOut is base asset
        amount,
        maxSwaps,
      )
      : await balancer.priceSwapIn(
        baseTokenAddress,     // tokenIn is base asset
        quoteTokenAddress,    // tokenOut is quote asset
        amount,
        maxSwaps,
      )

    const gasLimit = estimateGasLimit(swaps.length)
    const gasCost = await fees.getGasCost(gasPrice, gasLimit)

    if (side === 'BUY') {
      const price = expectedAmount / amount * baseDenomMultiplier / quoteDenomMultiplier
      logger.info(`Price: ${price.toString()}`)
      if (!limitPrice || price <= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await balancer.swapExactOut(
          wallet,
          swaps,
          quoteTokenAddress,   // tokenIn is quote asset
          baseTokenAddress,    // tokenOut is base asset
          expectedAmount.toString(),
          gasPrice,
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
          txHash: tx.hash,
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
      const minAmountOut = limitPrice / amount *  baseDenomMultiplier
      debug('minAmountOut', minAmountOut)
      const price = expectedAmount / amount  * baseDenomMultiplier / quoteDenomMultiplier
      logger.info(`Price: ${price.toString()}`)
      if (!limitPrice || price >= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await balancer.swapExactIn(
          wallet,
          swaps,
          baseTokenAddress,   // tokenIn is base asset
          quoteTokenAddress,  // tokenOut is quote asset
          amount.toString(),
          parseInt(expectedAmount) / quoteDenomMultiplier,
          gasPrice,
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
          txHash: tx.hash,
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
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

export default router;
