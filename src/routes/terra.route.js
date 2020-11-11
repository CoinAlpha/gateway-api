'use strict'

import express from 'express'
import BigNumber from 'bignumber.js'
import { LCDClient, MnemonicKey, Coin, MsgSwap } from '@terra-money/terra.js'
import { getParamData, getSymbols, latency, reportConnectionError, statusMessages } from '../services/utils';

const router = express.Router();
const debug = require('debug')('router')

const TerraTokens = {
  LUNA: { denom: 'uluna' },
  UST: { denom: 'uusd' },
  KRT: { denom: 'ukrw' },
  SDT: { denom: 'usdr' },
  MNT: { denom: 'umnt' },
}

const getTerraSymbol = (denom) => {
  let symbol
  Object.keys(TerraTokens).forEach((item) => {
    if (TerraTokens[item].denom === denom) {
      symbol = item
    }
  })
  return symbol
}

const denomUnitMultiplier = BigNumber('1e+6')

const getTxAttributes = (attributes) => {
  let attrib = {}
  console.log(attributes)
  attributes.forEach((item) => {
    console.log(item)
    attrib[item.key] = item.value
  })
  return attrib
}

// load environment config
const network = 'terra'
const lcdUrl = process.env.TERRA_LCD_URL;
const chain = process.env.TERRA_CHAIN;

/**
 * Connect to network
 */
const connect = () => {
  const terra = new LCDClient({
    URL: lcdUrl,
    chainID: chain,
  })

  terra.market.parameters().catch(() => {
    throw new Error('Connection error')
  })

  return terra
}

router.get('/', async (req, res) => {
  /*
    GET /
  */
  const terra = connect()

  const marketParams = await terra.market.parameters().catch((err) => {
    reportConnectionError(res, err)
  })

  res.status(200).json({
    network: network,
    chain: chain,
    connection: true,
    timestamp: Date.now(),
    market_params: marketParams
  })
})

router.get('/price', async (req, res) => {
  /*
    GET /price?trading_pair=LUNA-UST&trade_type=sell&amount=1.2345
  */
  const initTime = Date.now()
  const keyFormat = ['trading_pair', 'trade_type', 'amount']

  const paramData = getParamData(req.query, keyFormat)
  const tradingPair = paramData.trading_pair
  const requestAmount = paramData.amount
  const amount = parseFloat(requestAmount) * denomUnitMultiplier
  debug('params', req.params)
  debug('paramData', paramData)

  const terra = connect()
  const exchangeRates = await terra.oracle.exchangeRates().catch((err) => {
    reportConnectionError(res, err)
  });

  const symbols = getSymbols(tradingPair)
  const symbolsKeys = Object.keys(symbols)
  let price

  if (symbolsKeys.includes('LUNA')) {
    let targetSymbol
    if (symbolsKeys.includes('UST')) {
      targetSymbol = TerraTokens.UST.denom
    } else if (symbolsKeys.includes('KRT')) {
      targetSymbol = TerraTokens.KRT.denom
    } else if (symbolsKeys.includes('SDT')) {
      targetSymbol = TerraTokens.SDT.denom
    }
    price = exchangeRates.get(targetSymbol) * amount
  } else {
    // get the current swap rate
    const baseDenom = TerraTokens[symbols.base].denom
    const quoteDenom = TerraTokens[symbols.quote].denom

    const offerCoin = new Coin(baseDenom, amount);
    await terra.market.swapRate(offerCoin, quoteDenom).then(swapCoin => {
      price = Number(swapCoin.amount) / denomUnitMultiplier
    }).catch((err) => {
      reportConnectionError(res, err)
    })
  }

  const result = Object.assign(paramData, {
    price: price,
    timestamp: initTime,
    latency: latency(initTime, Date.now())
  })
  res.status(200).json(result)
})

router.get('/balance', async (req, res) => {
  /*
    GET: /balance?address=0x87A4...b120
  */
  const keyFormat = ['address']
  const paramData = getParamData(req.query, keyFormat)
  const address = paramData.address
  debug(paramData)

  const terra = connect()

  let balance = {}
  let txSuccess, message

  try {
    await terra.bank.balance(address).then(bal => {
      bal.toArray().forEach((x) => {
        const item = x.toData()
        const denom = item.denom
        const amount = item.amount / denomUnitMultiplier
        const symbol = getTerraSymbol(denom)
        balance[symbol] = amount
      })
    })
  } catch (err) {
    txSuccess = false
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      const status = err.response.status
      const statusText = err.response.statusText
      message = { error: statusText, status: status, data: err.response.data }
    } else {
      message = err.status
    }
  }

  res.status(200).json({
    success: txSuccess,
    address: address,
    balance: balance,
    timestamp: Date.now(),
    message: message
  })
})

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      data: {
        "trading_pair":SDT-KRT
        "trade_type": "buy"
        "amount": "1.01"
        "address": "0x...123"
        "secret": "mysupersecret"
      }
  */
  const keyFormat = ['trading_pair', 'trade_type', 'amount', 'address', 'secret']
  const paramData = getParamData(req.body, keyFormat)
  const tradeType = paramData.tradeType
  const secret = paramData.secret
  debug(paramData)

  const terra = connect()
  const mk = new MnemonicKey({
    mnemonic: secret,
  });
  const wallet = terra.wallet(mk);
  const address = wallet.key.accAddress

  // get the current swap rate
  const symbols = getSymbols(paramData.trading_pair)
  debug('symbols', symbols)
  const baseDenom = TerraTokens[symbols.base].denom
  const quoteDenom = TerraTokens[symbols.quote].denom

  let offerDenom, swapDenom, swapAmount
  swapAmount = paramData.amount * denomUnitMultiplier
  if (tradeType === 'sell') {
    offerDenom = baseDenom
    swapDenom = quoteDenom
  } else {
    offerDenom = quoteDenom
    swapDenom = baseDenom
  }

  const offerCoin = new Coin(offerDenom, swapAmount);
  debug('base', offerDenom, 'quote', swapDenom)

  // Create and Sign Transaction
  const swap = new MsgSwap(address, offerCoin, swapDenom);
  const memo = 'tx: 0802...1520'

  let txSuccess, txAttributes, message

  try {
    const tx = await wallet.createAndSignTx({
      msgs: [swap],
      memo: memo
    }).then(tx => terra.tx.broadcast(tx)).then(result => {
      debug(`TX hash: ${result.txhash}`);
      txSuccess = true
      const txHash = result.txhash
      const events = JSON.parse(result.raw_log)[0].events
      console.log(events)
      const swap = events.find(obj => {
        return obj.type === 'swap'
      })
      txAttributes = getTxAttributes(swap.attributes)

      message = {
        txHash: txHash
      }
    })
  } catch (err) {
    txSuccess = false
    const isAxiosError = err.isAxiosError
    if (isAxiosError) {
      const status = err.response.status
      const statusText = err.response.statusText
      message = { error: statusText, status: status, data: err.response.data }
    } else {
      message = err.status
    }
  }

  res.status(200).json({
    success: txSuccess,
    timestamp: Date.now(),
    buy: txAttributes.swap_coin,
    sell: txAttributes.offer,
    fee: txAttributes.swap_fee,
    message: message
  })
})

module.exports = router;
