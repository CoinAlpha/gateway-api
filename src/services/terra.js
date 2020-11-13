import { LCDClient } from '@terra-money/terra.js'
import { reportConnectionError, statusMessages } from '../services/utils';

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

export default class Terra {
  constructor () {
    const lcdUrl = ENV_CONFIG.TERRA.LCD_URL;
    const network =  ENV_CONFIG.TERRA.NETWORK;

    this.tokens = TERRA_TOKENS

    try {
      this.lcd = new LCDClient({
        URL: lcdUrl,
        chainID: network,
      })

      this.lcd.market.parameters().catch(() => {
        throw new Error('Connection error')
      })
    } catch (err) {
      throw Error(`Connection failed: ${network}`)
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

  async getExchangeRates (denom) {
    try {
      const exchangeRates = await this.lcd.oracle.exchangeRates()
      debug('exchangeRates', exchangeRates)
      return exchangeRates.get(denom)
    } catch (err) {
      let reason
      console.log(reason)
      err.reason ? reason = err.reason : reason = 'error Terra exchange rate lookup'
      return reason
    }
  }
}
