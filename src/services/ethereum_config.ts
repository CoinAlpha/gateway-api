export class EthereumConfigService {
  private config;
  constructor() {
    this.config = require('./configuration_manager').configManagerInstance;
  }

  get spenders(): Record<string, string> {
    return {
      balancer: this.config.getConfig('BALANCER_VAULT'),
      uniswap: this.config.getConfig('UNISWAP_ROUTER'),
      uniswapV3Router: this.config.getConfig('UNISWAP_V3_ROUTER'),
      uniswapV3NFTManager: this.config.getConfig('UNISWAP_V3_NFT_MANAGER'),
    };
  }

  get tokenListUrl(): string {
    return this.config.getConfig('ETHEREUM_TOKEN_LIST_URL');
  }

  get networkName(): string {
    return this.config.getConfig('ETHEREUM_CHAIN');
  }

  get rpcUrl(): string {
    return this.config.getConfig('ETHEREUM_RPC_URL');
  }

  get gasServiceUrl(): string {
    return (
      'https://ethgasstation.info/api/ethgasAPI.json?api-key=' +
      this.config.getConfig('ETH_GAS_STATION_API_KEY')
    );
  }

  get isGasStationEnabled(): boolean {
    return this.config.getConfig('ETH_GAS_STATION_ENABLE');
  }

  get refreshTimeForGasPrice(): number {
    return this.config.getConfig('ETH_GAS_STATION_REFRESH_TIME');
  }

  get manualGasPrice(): number {
    return this.config.getConfig('ETH_MANUAL_GAS_PRICE');
  }

  get gasLevel(): string {
    return this.config.getConfig('ETH_GAS_STATION_GAS_LEVEL');
  }
}
