export class EthereumConfigService {
  private config;
  constructor() {
    this.config = require('configuration_manager').configManagerInstance;
  }

  get spenders(): Record<string, string> {
    return {
      balancer: this.config.getConfig('BALANCER_EXCHANGE_PROXY'),
      uniswap: this.config.getConfig('UNISWAP_ROUTER'),
    };
  }

  get tokenListUrl(): string {
    return this.config.getConfig('ETHEREUM_TOKEN_LIST_URL');
  }

  get approvalGasLimit(): string {
    return this.config.getConfig('APPROVAL_GAS_LIMIT');
  }

  get networkName(): string {
    return this.config.getConfig('ETHEREUM_CHAIN');
  }

  get rpcUrl(): string {
    return this.config.getConfig('ETHEREUM_RPC_URL');
  }

  get gasServiceUrl(): string {
    return (
      this.config.getConfig('ETH_GAS_STATION_URL') +
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
