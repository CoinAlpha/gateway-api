const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

import { PoolsApi, AssetsApi, Configuration, NetworkApi } from '../../sifchain';

// constants

export default class Sifchain {
  private lcdUrl;
  private basePath;
  private config;
  private networkApi;
  private assetsApi;
  private poolsApi;

  constructor() {
    this.lcdUrl = globalConfig.getConfig('SIFCHAIN_LCD_URL');
    this.basePath = globalConfig.getConfig('SIFCHAIN_BASE_PATH');
    this.config = new Configuration({ basePath: this.basePath });
    this.networkApi = new NetworkApi(this.config);
    this.assetsApi = new AssetsApi(this.config);
    this.poolsApi = new PoolsApi(this.config);
  }
  getLCDURL(): string {
    return this.lcdUrl;
  }
  getBasePath(): string {
    return this.basePath;
  }
  getConfig(): any {
    return this.config;
  }
  async getNetworkInfo(): Promise<any> {
    return this.networkApi.getNetworkInfo();
  }
  // get Sifchain Swap Rate
  async getSwapRate(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string
  ): Promise<any> {
    try {
      const basePriceRes = await this.assetsApi.getTokenValue(baseToken);
      const quotePriceRes = await this.assetsApi.getTokenValue(quoteToken);

      const basePriceData = basePriceRes.data;
      const quotePriceData = quotePriceRes.data;
      return {
        basePriceData,
        quotePriceData,
        amount,
        tradeType,
      };
    } catch (err) {
      console.log(err);
      return 'failed';
    }
  }
  // get Sifchain Pool
  async getPool(token: string): Promise<any> {
    try {
      const poolRes = await this.poolsApi.getPool(token);
      const poolData = poolRes.data;
      return {
        poolData,
      };
    } catch (err) {
      console.log(err);
      return 'failed';
    }
  }
}
