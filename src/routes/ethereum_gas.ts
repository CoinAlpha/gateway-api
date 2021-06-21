import axios from 'axios';
import BigNumber from 'bignumber.js';
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

export class EthereumGasService {
  private gasPrice: number = 0;
  private isTracingStarted: boolean = false;

  private async onModuleInit(): Promise<void> {
    if (globalConfig.getConfig('ENABLE_ETH_GAS_STATION')) {
      // this.logger.log('GasStation enabled');
      if (globalConfig.getConfig('ETH_GAS_STATION_REFRESH_TIME')) {
        // this.logger.log(
        //   `Start tracing gas price in background every ${this.config.refreshTimeForGasPrice} sec`,
        // );
        this.startTracing();
      } else {
        this.gasPrice = await this.fetchCurrentGasPrice();
        // this.logger.log(
        //   `Fetched gas price (${this.config.gasLevel}): ${this.gasPrice}`,
        // );
      }
    } else {
      this.gasPrice = globalConfig.getConfig('MANUAL_GAS_PRICE');

      // this.logger.log(`Using fixed gas price: ${this.gasPrice}`);
    }
  }

  constructor() {
    this.onModuleInit();
  }
    
  /**
   * Tracing gas price in background
   */
  private async trace(): Promise<void> {
    this.gasPrice = await this.fetchCurrentGasPrice();

    if (this.isTracingStarted) {
      setTimeout(() => {
        this.trace();
      }, globalConfig.getConfig('ETH_GAS_STATION_REFRESH_TIME') * 1000);
    }
  }

  /**
   * Start tracing of changes gas price
   */
  startTracing(): void {
    if (this.isTracingStarted) {
      throw new Error('Tracing already started');
    }

    this.isTracingStarted = true;
    this.trace();
  }

  /**
   * Stop tracing gas price
   */
  stopTracing(): void {
    this.isTracingStarted = false;
  }

  /**
   * Return current gas price in Gwei
   * @return {Promise<number>}
   */
  async fetchCurrentGasPrice(
    level: string = globalConfig.getConfig('ETH_GAS_STATION_GAS_LEVEL')
  ): Promise<number> {
    try {
      const { data } = await axios.get(globalConfig.getConfig(''));

      // divite by 10 to convert it to Gwei)
      const gasPrice = data[level] / 10;
      // this.logger.log(`Ethereum GasStation gas price (${level}): ${gasPrice}`);

      return gasPrice;
    } catch (err) {
      // this.logger.error(err);
      throw new Error(err.reason || 'error ETH gas fee lookup');
    }
  }

  getGasPrice(): number {
    return this.gasPrice;
  }

  getGasCost(gasLimit: number, inGwei = false): BigNumber {
    const cost = new BigNumber(this.gasPrice * gasLimit);
    const denom = new BigNumber('1e+9');

    return inGwei ? cost : cost.div(denom);
  }
}
