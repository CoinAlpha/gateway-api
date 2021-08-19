import axios from 'axios';
import { ethers } from 'ethers';
import { EthereumConfigService } from './ethereum_config';
import { logger } from '../services/logger';

export class EthereumGasService {
  private gasPrice = 0;
  private isTracingStarted = false;
  private config: EthereumConfigService;

  constructor(config: EthereumConfigService) {
    this.config = config;
    if (this.config.isGasStationEnabled) {
      logger.info('GasStation enabled');
      if (this.config.refreshTimeForGasPrice) {
        logger.info(
          `Start tracing gas price in background every ${this.config.refreshTimeForGasPrice} sec`
        );
        this.startTracing();
      } else {
        (async () => {
          this.gasPrice = await this.fetchCurrentGasPrice();
        })();

        logger.info(
          `Fetched gas price (${this.config.gasLevel}): ${this.gasPrice}`
        );
      }
    } else {
      this.gasPrice = this.config.manualGasPrice;
      logger.info(`Using fixed gas price: ${this.gasPrice}`);
    }
  }

  /**
   * Tracing gas price in background
   */
  private async trace(): Promise<void> {
    this.gasPrice = await this.fetchCurrentGasPrice();

    if (this.isTracingStarted) {
      setTimeout(() => {
        this.trace();
      }, this.config.refreshTimeForGasPrice * 1000);
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
    level: string = this.config.gasLevel
  ): Promise<number> {
    try {
      const { data } = await axios.get(this.config.gasServiceUrl);

      // divide by 10 to convert it to Gwei
      const gasPrice = data[level] / 10;
      logger.info(`Ethereum GasStation gas price (${level}): ${gasPrice}`);

      return gasPrice;
    } catch (err) {
      logger.error(err);
      throw new Error(err.reason || 'error ETH gas fee lookup');
    }
  }

  getGasPrice(): number {
    return this.gasPrice;
  }

  getGasCost(gasLimit: number, inGwei = false): ethers.BigNumber {
    const cost = ethers.BigNumber.from(this.gasPrice * gasLimit);
    const denom = ethers.BigNumber.from('1000000000');

    return inGwei ? cost : cost.div(denom);
  }
}
