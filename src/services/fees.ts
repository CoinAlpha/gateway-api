import { debug, logger } from './logger';
import axios from 'axios';

// constants
const ethGasStationHost = 'https://ethgasstation.info';
const ethGasStationEnabled = Boolean(
  process.env.ENABLE_ETH_GAS_STATION || false
);
const ethGasStationApiKey = process.env.ETH_GAS_STATION_API_KEY;
const ethManualGasPrice = process.env.MANUAL_GAS_PRICE
  ? parseInt(process.env.MANUAL_GAS_PRICE)
  : 0;
const ethGasStationURL =
  ethGasStationHost + '/api/ethgasAPI.json?api-key=' + ethGasStationApiKey;
const defaultRefreshInterval = 120;
const denom = BigInt('1e+9');

export default class Fees {
  ethGasStationGasLevel: string =
    process.env.ETH_GAS_STATION_GAS_LEVEL?.toString() || '?'; // what level by default?
  ethGasStationRefreshTime: number =
    (process.env.ETH_GAS_STATION_REFRESH_TIME
      ? parseInt(process.env.ETH_GAS_STATION_REFRESH_TIME)
      : defaultRefreshInterval) * 1000;
  ethGasPrice: number;

  constructor() {
    this.getETHGasStationFee(this.ethGasStationGasLevel, 0);
  }

  // get ETH Gas Station
  async getETHGasStationFee(
    gasLevel = this.ethGasStationGasLevel,
    interval: number = defaultRefreshInterval
  ) {
    try {
      if (ethGasStationEnabled) {
        const response = await axios.get(ethGasStationURL);
        // divite by 10 to convert it to Gwei)
        this.ethGasPrice = response.data[gasLevel] / 10;
        debug.info(
          `get ETHGasStation gas price (${gasLevel}): ${
            this.ethGasPrice
          } / interval: ${this.ethGasStationRefreshTime / 1000} sec`
        );
      } else {
        this.ethGasPrice = ethManualGasPrice;
        debug.info(
          `get manual fixed gas price: ${this.ethGasPrice} / interval: ${
            this.ethGasStationRefreshTime / 1000
          } sec`
        );
      }
    } catch (err) {
      debug.info(err);
      logger.error(err);
      throw new Error(err.reason || 'error ETH gas fee lookup'); // ?? really need?
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
  getGasCost(gasPrice: bigint, gasLimit: bigint, inGwei = false): bigint {
    const cost: bigint = gasPrice * gasLimit;
    return inGwei ? cost : cost / denom;
  }
}
