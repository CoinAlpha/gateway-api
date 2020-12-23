import { LCDClient, Coin, MsgSwap, StdTx, StdFee, Dec, MnemonicKey, isTxError, Coins  } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import { getHummingbotMemo } from './utils';

require('dotenv').config()
const debug = require('debug')('router')
const logger = require('../services/logger')

// constants
const TERRA_TOKENS = {
  uluna: { symbol: 'LUNA' },
  uusd: { symbol: 'UST' },
  ukrw: { symbol: 'KRT' },
  usdr: { symbol: 'SDT' },
  umnt: { symbol: 'MNT' },
}
const DENOM_UNIT = BigNumber('1e+6')
const TOBIN_TAX = 0.0025  // a Tobin Tax (set at 0.25%) for spot-converting Terra<>Terra swaps
const MIN_SPREAD = 0.02  // a minimum spread (set at 2%) for Terra<>Luna swaps
const GAS_PRICE = { uluna: 0.16 }
const GAS_ADJUSTMENT = 1.4

export default class Terra {
  constructor () {
    this.lcdUrl = process.env.TERRA_LCD_URL;
    this.network =  process.env.TERRA_CHAIN;
    this.tokens = TERRA_TOKENS
    this.denomUnitMultiplier = DENOM_UNIT
    this.tobinTax = TOBIN_TAX
    this.minSpread = MIN_SPREAD
    this.memo = getHummingbotMemo()

    try {
      this.lcd = this.connect()

      this.lcd.market.parameters().catch(() => {
        throw new Error('Connection error')
      })
      // set gas & fee
      this.lcd.config.gasAdjustment = GAS_ADJUSTMENT
      this.lcd.config.gasPrices = GAS_PRICE
    } catch (err) {
      logger.error(err)
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
      lcd.config.gasAdjustment = GAS_ADJUSTMENT
      lcd.config.gasPrices = GAS_PRICE
      return lcd
    } catch (err) {
      logger.error(err)
      let reason
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
      logger.error(err)
      let reason
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
      logger.error(err)
      let reason
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

  async getEstimateFee (tx) {
    try {
      const fee = await this.lcd.tx.estimateFee(tx)
      return fee
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error Terra estimate fee lookup'
      return reason
    }
  }

  async getExchangeRate (denom) {
    try {
      const exchangeRates = await this.lcd.oracle.exchangeRates()
      return exchangeRates.get(denom)
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error Terra exchange rate lookup'
      return reason
    }
  }

  async getTxFee () {
    try {
      const lunaFee = GAS_PRICE.uluna * GAS_ADJUSTMENT
      let feeList = { uluna: lunaFee }
      await this.lcd.oracle.exchangeRates().then(rates => {
        Object.keys(rates._coins).forEach(key => {
          feeList[key] = rates._coins[key].amount * lunaFee
        })
      })
      debug('lunaFee', lunaFee, feeList)

      return feeList
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error Terra exchange rate lookup'
      return reason
    }
  }

  // get Terra Swap Rate
  async getSwapRate (baseToken, quoteToken, amount, tradeType) {
    try {
      let exchangeRate, offerCoin, offerDenom, swapDenom, cost, costAmount, offer
      let swaps = {}

      if (tradeType.toLowerCase() === 'sell') {
        // sell base
        offerDenom = this.getTokenDenom(baseToken)
        swapDenom = this.getTokenDenom(quoteToken)

        offerCoin = new Coin(offerDenom, amount * DENOM_UNIT);
        await this.lcd.market.swapRate(offerCoin, swapDenom).then(swapCoin => {
          offer = { amount: amount }
          exchangeRate = {
            amount: (swapCoin.amount / DENOM_UNIT) / amount,
            token: quoteToken
          }
          costAmount = amount * exchangeRate.amount
          cost = {
            amount: costAmount,
            token: quoteToken
          }
        })
      } else {
        // buy base
        offerDenom = this.getTokenDenom(quoteToken)
        swapDenom = this.getTokenDenom(baseToken)

        offerCoin = new Coin(offerDenom, 1 * DENOM_UNIT);
        await this.lcd.market.swapRate(offerCoin, swapDenom).then(swapCoin => {
          exchangeRate = {
            amount: (amount / parseInt(swapCoin.amount) * DENOM_UNIT) / amount, // adjusted amount
            token: quoteToken
          }
          costAmount = amount * exchangeRate.amount
          cost = {
            amount: costAmount,
            token: quoteToken
          }
          offer = { amount: cost.amount }
        })
      }

      let txFee
      await this.getTxFee().then(fee => {
        // fee in quote
        txFee = { amount: parseFloat(fee[this.getTokenDenom(quoteToken)]), token: quoteToken }
      })

      swaps.offer = offer
      swaps.price = exchangeRate
      swaps.cost = cost
      swaps.txFee = txFee
      debug('swaps', swaps)
      return swaps
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error swap rate lookup'
      return reason
    }
  }

  // Swap tokens
  async swapTokens (baseToken, quoteToken, amount, tradeType, gasPrice, gasAdjustment, secret) {
    let swapResult
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
        logger.error(err)
        throw Error('Wallet access error')
      }

      const address = wallet.key.accAddress

      // get the current swap rate
      const baseDenom = this.getTokenDenom(baseToken)
      const quoteDenom = this.getTokenDenom(quoteToken)

      let offerDenom, swapDenom
      let swaps, txAttributes
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

      const offerAmount = parseInt((swaps.offer.amount) * DENOM_UNIT)
      const offerCoin = new Coin(offerDenom, offerAmount)
      // debug('offerCoin', offerCoin, offerAmount, 'gasPrice', gasPrice)

      // Create and Sign Transaction
      const msgSwap = new MsgSwap(address, offerCoin, swapDenom);

      let txOptions
      if (gasPrice !== null && gasPrice !== null) { // ignore gasAdjustment when gasPrice is not set
        txOptions = {
          msgs: [msgSwap],
          gasPrices: { uluna: parseFloat(gasPrice) },
          gasAdjustment: gasAdjustment,
          memo: this.memo
        }
      } else {
        txOptions = {
          msgs: [msgSwap],
          memo: this.memo
        }
      }

      await wallet.createAndSignTx(txOptions).then(tx => lcd.tx.broadcast(tx)).then((txResult) => {
        swapResult = txResult

        const swapSuccess = !isTxError(txResult)
        if (swapSuccess) {
          tokenSwap.txSuccess = swapSuccess
        } else {
          tokenSwap.txSuccess = !swapSuccess
          throw new Error(`encountered an error while running the transaction: ${txResult.code} ${txResult.codespace}`);
        }

        const txHash = txResult.txhash
        const events = JSON.parse(txResult.raw_log)[0].events
        const swap = events.find(obj => {
          return obj.type === 'swap'
        })
        txAttributes = this.getTxAttributes(swap.attributes)
        const offer = Coin.fromString(txAttributes.offer)
        const ask = Coin.fromString(txAttributes.swap_coin)
        const fee = Coin.fromString(txAttributes.swap_fee)

        tokenSwap.expectedIn =  {
          amount: parseFloat(offer.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[offer.denom].symbol
        }
        tokenSwap.expectedOut = {
          amount: parseFloat(ask.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[ask.denom].symbol
        }
        tokenSwap.fee = {
          amount: parseFloat(fee.amount) / DENOM_UNIT,
          token: TERRA_TOKENS[fee.denom].symbol
        }
        tokenSwap.txHash = txHash
      })
      return tokenSwap
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = swapResult
      return { txSuccess: false, message: reason }
    }
  }
}
