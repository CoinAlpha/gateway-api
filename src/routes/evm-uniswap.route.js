import { ethers } from 'ethers';
import express from 'express';

import { getParamData, latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';
import EVM from '../services/evm';
import EVMUniswap from '../services/evm-uniswap';
import Fees from '../services/fees';

require('dotenv').config()

const makeEvmUniswapRoute = (id) => {

  const debug = require('debug')('router')
  const router = express.Router()
  const eth = new EVM(process.env.EVM_CHAIN)
  const uniswap = new EVMUniswap(process.env.EVM_CHAIN, id, eth.provider)
  uniswap.generate_tokens()
  setTimeout(uniswap.update_pairs.bind(uniswap), 2000)
  const fees = new Fees(process.env.EVM_MANUAL_GAS_PRICE)
  
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
  
  router.get('/start', async (req, res) => {
    /*
      POST: /evm/uniswap/start
        x-www-form-urlencoded: {
          "pairs":"[ETH-USDT, ...]"
          "gasPrice":30
        }
    */
    const initTime = Date.now()
    const paramData = getParamData(req.query)
    const pairs = JSON.parse(paramData.pairs)
    let gasPrice
    if (paramData.gasPrice) {
      gasPrice = parseFloat(paramData.gasPrice)
    } else {
      gasPrice = fees.ethGasPrice
    }
  
    // get token contract address and cache paths
    for (let pair of pairs){
      pair = pair.split("-")
      const baseTokenSymbol = pair[0]
      const quoteTokenSymbol = pair[1]
      const baseTokenContractInfo = eth.getERC20TokenAddresses(baseTokenSymbol)
      const quoteTokenContractInfo = eth.getERC20TokenAddresses(quoteTokenSymbol)
  
      // check for valid token symbols
      if (baseTokenContractInfo === undefined || quoteTokenContractInfo === undefined) {
        const undefinedToken = baseTokenContractInfo === undefined ? baseTokenSymbol : quoteTokenSymbol
        res.status(500).json({
          error: `Token ${undefinedToken} contract address not found`,
          message: `Token contract address not found for ${undefinedToken}. Check token list source`,
        })
        return
      }
      await Promise.allSettled([uniswap.extend_update_pairs([baseTokenContractInfo.address, quoteTokenContractInfo.address])])
    }
  
    const gasLimit = estimateGasLimit()
    const gasCost = await fees.getGasCost(gasPrice, gasLimit)
  
  
    const result = {
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      success: true,
      pairs: pairs,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost,
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
        logger.info(`evm_uniswap.route - Price: ${price.toString()}`)
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
          logger.info(`evm_uniswap.route - Swap price ${price} exceeds limitPrice ${limitPrice}`)
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
          logger.info(`evm_uniswap.route - Swap price ${price} lower than limitPrice ${limitPrice}`)
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
  
        const tradeAmount = parseFloat(amount)
        const expectedTradeAmount = parseFloat(expectedAmount.toSignificant(8))
        const tradePrice = parseFloat(price)
  
        const result = {
          network: uniswap.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenAddress,
          quote: quoteTokenAddress,
          amount: tradeAmount,
          expectedAmount: expectedTradeAmount,
          price: tradePrice,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          gasCost: gasCost,
          trade: trade,
        }
        debug(`Price ${side} ${baseTokenContractInfo.symbol}-${quoteTokenContractInfo.symbol} | amount:${amount} (rate:${tradePrice}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`)
        res.status(200).json(result)
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
          res.status(errCode).json({
            info: reason,
            message: err
          })
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

  return router
}

export default makeEvmUniswapRoute;
