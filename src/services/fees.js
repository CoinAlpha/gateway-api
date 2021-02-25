import { logger } from './logger';
import axios from 'axios'

require('dotenv').config()

const debug = require('debug')('router')
// constants
const ethGasStationHost = 'https://ethgasstation.info'
const ethGasStationEnabled = process.env.ENABLE_ETH_GAS_STATION || false
const ethGasStationApiKey = process.env.ETH_GAS_STATION_API_KEY
const ethManualGasPrice = parseInt(process.env.MANUAL_GAS_PRICE)
const ethGasStationURL = ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey
const defaultRefreshInterval = 120

export default class Fees {
  constructor () {
    this.ethGasStationGasLevel = process.env.ETH_GAS_STATION_GAS_LEVEL
    this.ethGasStationRefreshTime = (process.env.ETH_GAS_STATION_REFRESH_TIME || defaultRefreshInterval) * 1000
  }

  // get ETH Gas Station
  async getETHGasStationFee (gasLevel = this.ethGasStationGasLevel) {
    try {
      if (ethGasStationEnabled === true || ethGasStationEnabled.toLowerCase() === 'true') {
        const response = await axios.get(ethGasStationURL)
        // divite by 10 to convert it to Gwei)
        this.ethGasPrice = response.data[gasLevel] / 10
        console.log(`get ETHGasStation gas price (${gasLevel}): ${this.ethGasPrice} / interval: ${this.ethGasStationRefreshTime / 1000} sec`)  
      } else {
        this.ethGasPrice = ethManualGasPrice
      }
    } catch (err) {
      console.log(err);
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error ETH gas fee lookup'
      return reason
    }
    setTimeout(this.getETHGasStationFee.bind(this), this.ethGasStationRefreshTime); // update every x seconds
  }
}
