import { LCDClient, Coin, MsgSwap, MnemonicKey, isTxError  } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'

require('dotenv').config()
const debug = require('debug')('router')
const config = require('../services/config')

// constants
const ENV_CONFIG = config.getConfig()
const TERRA_TOKENS = {
  uluna: { symbol: 'LUNA' },
  uusd: { symbol: 'UST' },
  ukrw: { symbol: 'KRT' },
  usdr: { symbol: 'SDT' },
  umnt: { symbol: 'MNT' },
}
const DENOM_UNIT = BigNumber('1e+6')
const TOBIN_TAX = 0.25
const MIN_SPREAD = 2.0
const TESTNET_MEMO = ''

export default class Terra {
  constructor () {
    this.lcdUrl = ENV_CONFIG.TERRA.LCD_URL;
    this.network =  ENV_CONFIG.TERRA.NETWORK;
    this.tokens = TERRA_TOKENS
    this.denomUnitMultiplier = DENOM_UNIT
    this.tobinTax = TOBIN_TAX
    this.minSpread = MIN_SPREAD

    try {
      this.lcd = this.connect()

      this.lcd.market.parameters().catch(() => {
        throw new Error('Connection error')
      })
    } catch (err) {
      throw Error(`Connection failed: ${this.network}`)
    }
  }

  // connect Terra LCD
  connect () {
    try {
      const lcd = new LCDClient({
        URL: this.lcdUrl,
        chainID: this.network,
      })
      return lcd
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra LCD connect'
      return reason
    }
  }

  // get Token Denom
  getTokenDenom (symbol) {
    try {
      let denom
      Object.keys(TERRA_TOKENS).forEach((item) => {
        if (TERRA_TOKENS[item].symbol === symbol) {
          denom = item
        }
      })
      return denom
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra Denom lookup'
      return reason
    }
  }

  // get Token Symbol
  getTokenSymbol (denom) {
    try {
      const symbol = TERRA_TOKENS[denom].symbol
      return symbol
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra Denom lookup'
      return reason
    }
  }
  
  getTxAttributes (attributes) {
    let attrib = {}
    attributes.forEach((item) => {
      attrib[item.key] = item.value
    })
    return attrib
  }

  async getExchangeRate (denom) {
    try {
      const exchangeRates = await this.lcd.oracle.exchangeRates()
      return exchangeRates.get(denom)
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra exchange rate lookup'
      return reason
    }
  }

  // get Terra Swap Rate
  async getSwapRate (baseToken, quoteToken, amount, tradeType) {
    try {
      let exchangeRate
      let swaps = {}
      const offerDenom = this.getTokenDenom(baseToken)
      const swapDenom = this.getTokenDenom(quoteToken)

      const offerCoin = new Coin(offerDenom, amount * DENOM_UNIT);
      await this.lcd.market.swapRate(offerCoin, swapDenom).then(swapCoin => {
        exchangeRate = {
          amount: parseFloat(swapCoin.amount) / DENOM_UNIT,
          token: quoteToken
        }
      })

      if (tradeType.toLowerCase() === 'buy') {
        swaps.swapIn = {
          amount: amount,
          token: baseToken
        }
        swaps.swapOut = exchangeRate
      } else {
        // sell
        swaps.swapIn = exchangeRate
        swaps.swapOut = {
          amount: amount,
          token: baseToken
        }
      }
      return swaps
    } catch (err) {
      debug()
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error swap rate lookup'
      return reason
    }
  }

  // Swap tokens
  async swapTokens (baseToken, quoteToken, amount, tradeType, secret) {
    try {
      // connect to lcd
      const lcd = this.connect()

      const mk = new MnemonicKey({
        mnemonic: secret,
      });
      let wallet
      try {
        wallet = lcd.wallet(mk);
      } catch (err) {
        throw Error('Wallet access error')
      }

      const address = wallet.key.accAddress

      // get the current swap rate
      const baseDenom = this.getTokenDenom(baseToken)
      const quoteDenom = this.getTokenDenom(quoteToken)

      let offerDenom, swapDenom
      let swaps
      let txAttributes
      let tokenSwap = {}

      if (tradeType.toLowerCase() === 'sell') {
        offerDenom = baseDenom
        swapDenom = quoteDenom
      } else {
        offerDenom = quoteDenom
        swapDenom = baseDenom
      }

      await this.getSwapRate(baseToken, quoteToken, amount, tradeType, secret).then((rate) => {
        swaps = rate
      })

      const offerAmount = swaps.swapOut.amount * DENOM_UNIT
      const offerCoin = new Coin(offerDenom, offerAmount)

      // Create and Sign Transaction
      const msgSwap = new MsgSwap(address, offerCoin, swapDenom);
      const memo = lcd.config.chainID.toLowerCase().includes('columbus') ? '' : TESTNET_MEMO

      const tx = await wallet.createAndSignTx({
        msgs: [msgSwap],
        memo: memo
      })

      await lcd.tx.broadcast(tx).then((txResult) => {
        const swapSucces = !isTxError(txResult)
        if (swapSucces) {
          tokenSwap.txSuccess = swapSucces
        } else {
          tokenSwap.txSuccess = !swapSucces
          throw new Error(`encountered an error while running the transaction: ${txResult.code} ${txResult.codespace}`);
        }

        // check for events from the first message
        // debug('event first message', txResult.logs[0].eventsByType.store_code)

        const txHash = txResult.txhash
        const events = JSON.parse(txResult.raw_log)[0].events
        const swap = events.find(obj => {
          return obj.type === 'swap'
        })
        txAttributes = this.getTxAttributes(swap.attributes)
        const offer = Coin.fromString(txAttributes.offer)
        const ask = Coin.fromString(txAttributes.swap_coin)
        const fee = Coin.fromString(txAttributes.swap_fee)

        tokenSwap.swapIn = {
          amount: parseFloat(ask.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[ask.denom].symbol
        }
        tokenSwap.swapOut =  {
          amount: parseFloat(offer.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[offer.denom].symbol
        }
        tokenSwap.fee = {
          amount: parseFloat(fee.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[fee.denom].symbol
        }
        tokenSwap.txHash = txHash
      })
      return tokenSwap
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra tokens swap'
      return { txSuccess: false, message: reason }
    }
  }
}
