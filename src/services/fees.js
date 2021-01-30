import { logger } from './logger';
import axios from 'axios'

require('dotenv').config()

// constants
const ethGasStationHost = 'https://ethgasstation.info'
// const ethGasStation = process.env.ETH_GAS_STATION
const ethGasStationApiKey = process.env.ETH_GAS_STATION_API_KEY
const ethGasStationURL = ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey

export default class Fees {
  constructor () {
    this.ethGasStationGasLevel = process.env.ETH_GAS_STATION_GAS_LEVEL
    this.ethGasStationRefreshTime = process.env.ETH_GAS_STATION_REFRESH_TIME
  }

  // get ETH Gas Station
  async getETHGasStationFee (gasLevel = this.ethGasStationGasLevel) {
    try {
      axios.get(ethGasStationURL)
        .then(function (response) {
          // handle success
          const gasFee = response.data[gasLevel]
          // console.log(`getETHGasStationFee(${gasLevel})`, gasFee)
          return gasFee
        })
    } catch (err) {
      console.log(err);
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error ETH gas fee lookup'
      return reason
    }
  }
}
