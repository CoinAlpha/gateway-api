'use strict'

const express = require('express');
const router = express.Router();
const BigNumber = require('bignumber.js');
const debug = require('debug')('router')

const LCDClient = require('@terra-money/terra.js').LCDClient
const Coin = require('@terra-money/terra.js').Coin
// const MsgSend = require('@terra-money/terra.js').MsgSend
const MnemonicKey = require('@terra-money/terra.js').MnemonicKey
// Terra.js includes Dec and Int, which represent decimal numbers and integer numbers, in a Cosmos-SDK compatible way.

const hbUtils = require('../services/utils')

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

const denom_unit_multiplier = BigNumber('1e+6')


// load environment config
const network = 'terra'
const lcdUrl = process.env.TERRA_LCD_URL;
const chain = process.env.TERRA_CHAIN;

/**
 * Connect to network
 */
const connect = () => {
  let terra = new LCDClient({
    URL: lcdUrl,
    chainID: chain,
  })

  terra.market.parameters().catch((err) => {
    throw new Error('Connection error')
  })

  // To use LocalTerra
  // const terra = new LCDClient({
  //   URL: 'http://localhost:1317',
  //   chainID: 'localterra'
  // })
  return terra
}


router.use((req, res, next) => {
  debug('terra route:', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.status(200).send(network)
})

router.get('/status', async (req, res) => {
  /*
    GET /status
  */
  const terra = connect()

  const marketParams = await terra.market.parameters().catch((err) => {
    hbUtils.reportConnectionError(res, err)
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

  const paramData = hbUtils.getParamData(req.query, keyFormat)
  const tradingPair = paramData.trading_pair
  const tradeType = paramData.trade_type
  const requestAmount = paramData.amount
  const amount = parseFloat(requestAmount) * denom_unit_multiplier
  debug('params', req.params)
  debug('paramData', paramData)

  const terra = connect()
  const exchangeRates = await terra.oracle.exchangeRates().catch((err) => {
    hbUtils.reportConnectionError(res, err)
  });

  const symbols = hbUtils.getSymbols(tradingPair)
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
    let baseDenom = TerraTokens[symbols.base].denom
    let quoteDenom = TerraTokens[symbols.quote].denom

    const offerCoin = new Coin(baseDenom, amount);
    await terra.market.swapRate(offerCoin, quoteDenom).then(swapCoin => {
      price = Number(swapCoin.amount)/denom_unit_multiplier
    }).catch((err) => {
      hbUtils.reportConnectionError(res, err)
    })
  }

  let result = Object.assign(paramData, {
    price: price,
    timestamp: initTime,
    latency: hbUtils.latency(initTime, Date.now())
  })
  res.status(200).json(result)
})

router.get('/balance', async (req, res) => {
  /*
    GET: /balance?address=0x87A4...b120
  */
  const keyFormat = ['address']
  const paramData = hbUtils.getParamData(req.query, keyFormat)
  const address = paramData.address
  debug(paramData)

  const terra = connect()

  let balance = {}

  await terra.bank.balance(address).then(bal => {
    bal.toArray().forEach((x) => {
      const item = x.toData()
      const denom = item.denom
      const amount = item.amount/denom_unit_multiplier
      const symbol = getTerraSymbol(denom)
      balance[symbol] = amount
    })
  })

  res.status(200).json({
    address: address,
    balance: balance,
    timestamp: Date.now()
  })
})

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      data: {
        "trading_pair":CELO-CUSD
        "trade_type": "buy"
        "amount": "1.01"
        "price": "2.179"
        "address": "0x...123"
        "secret": "mysupersecret"
      }
  */

  const keyFormat = ['trading_pair', 'trade_type', 'amount', 'price', 'address', 'secret']
  const paramData = hbUtils.getParamData(req.body, keyFormat)
  const secret = paramData.secret
  debug(paramData)

  let accountInfo, coin

  const terra = connect()
  const mk = new MnemonicKey({
    mnemonic: secret,
  });
  const wallet = terra.wallet(mk);
  const address = wallet.key.accAddress

  res.status(200).json({
    _status: 'WIP',
    address: address,
    // balance: walletBalances,
    timestamp: Date.now()
  })
})

module.exports = router;
