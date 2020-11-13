'use strict'

import express from 'express'
import BigNumber from 'bignumber.js'
import { MnemonicKey, Coin, MsgSwap } from '@terra-money/terra.js'
import { getParamData, latency, reportConnectionError, statusMessages } from '../services/utils';
import { getConfig } from '../services/config';

import Terra from '../services/terra';

const debug = require('debug')('router')
const router = express.Router();
const ENV_CONFIG = getConfig()
const terra = new Terra(ENV_CONFIG.TERRA)

// constants
const network = terra.lcd.config.chainID
const denomUnitMultiplier = BigNumber('1e+6')

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: network,
    lcdUrl: terra.lcd.config.URL,
    gasPrices: terra.lcd.config.gasPrices,
    gasAdjustment: terra.lcd.config.gasAdjustment,
    connection: true,
    timestamp: Date.now()
  })
})

router.post('/balances', async (req, res) => {
  /*
    POST:
        address:{{address}}
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const address = paramData.address
  debug(paramData)

  let balances = {}

  try {
    await terra.lcd.bank.balance(address).then(bal => {
      bal.toArray().forEach(async (x) => {
        const item = x.toData()
        const denom = item.denom
        const amount = item.amount / denomUnitMultiplier
        const symbol = terra.tokens[denom].symbol
        balances[symbol] = amount
      })
    })
    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances,
    })
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

router.post('/price', async (req, res) => {
  /*
    POST:
    x-www-form-urlencoded: {
      "base":"UST"
      "quote":"KRT"
      "amount":1
    }
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const amount = parseFloat(paramData.amount)
  debug('paramData', paramData)

  const symbols = [baseToken, quoteToken]
  let exchangeRate, price

  try {
    if (symbols.includes('LUNA')) {
      const target = baseToken !== 'LUNA' ? baseToken : quoteToken
      const denom = terra.getTokenDenom(target)
      await terra.getExchangeRates(denom).then((rate) => {
        price = exchangeRate * amount
      }).catch((err) => {
        reportConnectionError(res, err)
      })
    } else {
      // get the current swap rate
      const offerDenom = terra.getTokenDenom(baseToken)
      const swapDenom = terra.getTokenDenom(quoteToken)

      if ((typeof offerDenom === 'undefined' && offerDenom == null) || (typeof swapDenom === 'undefined' && swapDenom == null)) {
        res.status(500).json({
          error: statusMessages.invalid_token_symbol,
          message: {
            base: baseToken,
            quote: quoteToken
          }
        })
        return
      }

      console.log('offerDenom, swapDenom', offerDenom, swapDenom)

      const offerCoin = new Coin(offerDenom, amount * denomUnitMultiplier);
      await terra.lcd.market.swapRate(offerCoin, swapDenom).then(swapCoin => {
        price = parseFloat(swapCoin.amount) / denomUnitMultiplier
        debug('price', price)
      }).catch((err) => {
        reportConnectionError(res, err)
      })
    }
    debug('price', price)

    res.status(200).json(
      {
        network: network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseToken,
        quote: quoteToken,
        amount: amount,
        exchangeRate: exchangeRate,
        price: price
      }
    )
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      data: {
        "base":"UST"
        "quote":"KRT"
        "trade_type":"buy" or "sell"
        "amount":1
        "secret": "mysupersecret"
      }
  */
  const initTime = Date.now()

  const paramData = getParamData(req.body)
  const baseToken = paramData.base
  const quoteToken = paramData.quote
  const tradeType = paramData.trade_type
  const amount = parseFloat(paramData.amount)
  const secret = paramData.secret
  // debug(paramData)

  const mk = new MnemonicKey({
    mnemonic: secret,
  });
  const wallet = terra.lcd.wallet(mk);
  const address = wallet.key.accAddress
  debug(address)

  // get the current swap rate
  const baseDenom = terra.getTokenDenom(baseToken)
  const quoteDenom = terra.getTokenDenom(quoteToken)

  let offerDenom, swapDenom
  if (tradeType === 'sell') {
    offerDenom = baseDenom
    swapDenom = quoteDenom
  } else {
    // get equivalent of amount in return
    offerDenom = quoteDenom
    swapDenom = baseDenom
  }

  const swapAmount = amount * denomUnitMultiplier
  const offerCoin = new Coin(offerDenom, swapAmount)

  // Create and Sign Transaction
  const swap = new MsgSwap(address, offerCoin, swapDenom);
  const testnetMemo = 'tx: 0xhb034'
  const memo = network.toLowerCase().includes('columbus') ? '' : testnetMemo
  let txAttributes

  try {
    const tx = await wallet.createAndSignTx({
      msgs: [swap],
      memo: memo
    }).then(tx => terra.lcd.tx.broadcast(tx)).then(result => {
      debug(`TX hash: ${result.txhash}`);
      const txHash = result.txhash
      const events = JSON.parse(result.raw_log)[0].events
      const swap = events.find(obj => {
        return obj.type === 'swap'
      })
      txAttributes = terra.getTxAttributes(swap.attributes)
      const buyCoin = Coin.fromString(txAttributes.swap_coin).toDecCoin()
      const sellCoin = Coin.fromString(txAttributes.offer)
      // const feeCoin = Coin.fromString(txAttributes.swap_fee)

      res.status(200).json(
        {
          network: network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseToken,
          quote: quoteToken,
          tradeType: tradeType,
          amount: amount,
          buy: buyCoin.amount / denomUnitMultiplier,
          sell: sellCoin.amount / denomUnitMultiplier,
          // fee: feeCoin.amount / denomUnitMultiplier,
          txHash: txHash
        }
      )
    })
  } catch (err) {
    let message
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      reason = err.response.status
      message = err.response.statusText
    } else {
      message = err
    }
    res.status(500).json({
      error: reason,
      message: message
    })
  }
})

module.exports = router;
