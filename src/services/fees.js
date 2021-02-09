import { logger } from './logger';
import axios from 'axios'

require('dotenv').config()

// constants
const ethGasStationHost = 'https://ethgasstation.info'
// const ethGasStation = process.env.ETH_GAS_STATION
const ethGasStationApiKey = process.env.ETH_GAS_STATION_API_KEY
const ethGasStationURL = ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey
const defaultRefreshInterval = 60

export default class Fees {
  constructor () {
    this.ethGasStationGasLevel = process.env.ETH_GAS_STATION_GAS_LEVEL
    this.ethGasStationRefreshTime = (process.env.ETH_GAS_STATION_REFRESH_TIME || defaultRefreshInterval) * 1000
  }

  // get ETH Gas Station
  async getETHGasStationFee (gasLevel = this.ethGasStationGasLevel) {
    try {
      const response = await axios.get(ethGasStationURL)
      // divite by 10 to convert it to Gwei)
      this.ethGasPrice = response.data[gasLevel] / 10
      console.log(`get ETHGasStation gas price (${gasLevel}): ${this.ethGasPrice} / interval: ${this.ethGasStationRefreshTime / 1000} sec`)
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
