import { logger } from './logger';
import axios from 'axios';
import BigNumber from 'bignumber.js';

// constants
const ethGasStationHost = 'https://ethgasstation.info';
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;
const ethGasStationEnabled =
  globalConfig.getConfig('ETH_GAS_STATION_ENABLE') || false;
const ethGasStationApiKey = globalConfig.getConfig('ETH_GAS_STATION_API_KEY');
const ethManualGasPrice = parseInt(
  globalConfig.getConfig('ETH_MANUAL_GAS_PRICE')
);
const ethGasStationURL =
  ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey;
const defaultRefreshInterval = 120;
const denom = BigNumber('1e+9');

export default class Fees {
  constructor() {
    this.ethGasStationGasLevel = globalConfig.getConfig(
      'ETH_GAS_STATION_GAS_LEVEL'
    );
    this.ethGasStationRefreshTime =
      (globalConfig.getConfig('ETH_GAS_STATION_REFRESH_TIME') ||
        defaultRefreshInterval) * 1000;
    this.getETHGasStationFee(this.ethGasStationGasLevel, 0);
  }

  // get ETH Gas Station
  async getETHGasStationFee(
    gasLevel = this.ethGasStationGasLevel,
    interval = defaultRefreshInterval
  ) {
    try {
      if (
        ethGasStationEnabled === true ||
        ethGasStationEnabled.toString().toLowerCase() === 'true'
      ) {
        const response = await axios.get(ethGasStationURL);
        // divite by 10 to convert it to Gwei)
        this.ethGasPrice = response.data[gasLevel] / 10;
        logger.info(
          `get ETHGasStation gas price (${gasLevel}): ${
            this.ethGasPrice
          } / interval: ${this.ethGasStationRefreshTime / 1000} sec`
        );
      } else {
        this.ethGasPrice = ethManualGasPrice;
        logger.info(
          `get manual fixed gas price: ${this.ethGasPrice} / interval: ${
            this.ethGasStationRefreshTime / 1000
          } sec`
        );
      }
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error ETH gas fee lookup');
      return reason;
    }
    if (interval > 0) {
      // set to '0' for one-time retrieval
      setTimeout(
        this.getETHGasStationFee.bind(this),
        this.ethGasStationRefreshTime
      ); // update every x seconds
    }
  }

  // get gas cost
  async getGasCost(gasPrice, gasLimit, inGwei = false) {
    const cost = gasPrice * gasLimit;
    return inGwei ? cost : cost / denom;
  }
}
