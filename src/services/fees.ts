import { logger } from './logger';
import axios from 'axios';

// constants
const ethGasStationHost = 'https://ethgasstation.info';
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;
const ethGasStationEnabled =
  globalConfig.getConfig('ENABLE_ETH_GAS_STATION') || false;
const ethGasStationApiKey = globalConfig.getConfig('ETH_GAS_STATION_API_KEY');
const ethManualGasPrice = parseInt(globalConfig.getConfig('MANUAL_GAS_PRICE'));
const ethGasStationURL =
  ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey;
const defaultRefreshInterval = 120;
const denom = BigInt('1e+9');

export default class Fees {
  ethGasStationGasLevel = 0;
  ethGasStationRefreshTime = 0;
  ethGasPrice = 0;

  constructor() {
    this.ethGasStationGasLevel = globalConfig.getConfig(
      'ETH_GAS_STATION_GAS_LEVEL'
    );
    this.ethGasStationRefreshTime =
      (globalConfig.getConfig('ETH_GAS_STATION_REFRESH_TIME') ||
        defaultRefreshInterval) * 1000;
    this.getETHGasStationFee(this.ethGasStationGasLevel, 0);
  }

  // : Promise<void>
  // get ETH Gas Station
  async getETHGasStationFee(
    gasLevel = this.ethGasStationGasLevel,
    interval = defaultRefreshInterval
  ): Promise<void> {
    try {
      if (
        ethGasStationEnabled === true ||
        ethGasStationEnabled.toString().toLowerCase() === 'true'
      ) {
        const response = await axios.get(ethGasStationURL);
        // divite by 10 to convert it to Gwei)
        this.ethGasPrice = response.data[gasLevel] / 10;
        console.log(
          `get ETHGasStation gas price (${gasLevel}): ${
            this.ethGasPrice
          } / interval: ${this.ethGasStationRefreshTime / 1000} sec`
        );
      } else {
        this.ethGasPrice = ethManualGasPrice;
        console.log(
          `get manual fixed gas price: ${this.ethGasPrice} / interval: ${
            this.ethGasStationRefreshTime / 1000
          } sec`
        );
      }
    } catch (err) {
      console.log(err);
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

  // : Promise:<number>
  // get gas cost
  getGasCost(gasPrice: number, gasLimit: number, inGwei = false): bigint {
    const cost = BigInt(gasPrice * gasLimit);
    return inGwei ? cost : cost / denom;
  }
}