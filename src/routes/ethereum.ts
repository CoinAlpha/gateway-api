import { EthereumService, TokenERC20Info } from '../services/ethereum';
// import { EthereumGasService } from '../services/ethereum_gas';
import { Request, Response } from 'express';
import { Wallet } from 'ethers';
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

export class EthereumRoutes {
  constructor(
    private ethereumService: EthereumService // private readonly ethereumGasService: EthereumGasService
  ) {}

  getNetworkInformation() {
    return {
      network: globalConfig.getConfig('ETHEREUM_CHAIN'),
      rpcUrl: globalConfig.getConfig('ETHEREUM_RPC_URL'),
      connection: true,
      timestamp: Date.now(),
    };
  }

  //
  async getBalances(req: Request, res: Response) {
    const initTime = Date.now();

    // Trying connect to Wallet
    try {
      const wallet: Wallet = this.ethereumService.getWallet(
        req.body.privateKey || ''
      );

      // Populate token contract info using token symbol list
      let tokenContractList: Record<string, TokenERC20Info> = {};
      tokenContractList = this.ethereumService.getERC20TokensAddresses(
        req.body.tokenList
      );

      // Getting user balancers
      const balances: Record<string, string> = {};
      balances.ETH = await this.ethereumService
        .getETHBalance(wallet)
        .toString();
      await Promise.all(
        Object.keys(tokenContractList).map(async (symbol) => {
          if (tokenContractList[symbol] !== undefined) {
            const address = tokenContractList[symbol].address;
            const decimals = tokenContractList[symbol].decimals;
            balances[symbol] = await this.ethereumService
              .getERC20Balance(wallet, address, decimals)
              .toString();
          } else {
            // this.logger.error(`Token contract info for ${symbol} not found`);
          }
        })
      );

      res.status(200).json({
        network: globalConfig.getConfig('ETHEREUM_CHAIN'),
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        balances: balances,
      });
    } catch (err) {
      // this.logger.error(err);
      res.status(500).send(err);
    }
  }
}
