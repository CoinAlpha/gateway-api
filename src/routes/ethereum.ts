import { EthereumService, TokenERC20Info } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';
// import { EthereumGasService } from '../services/ethereum_gas';
import { Request, Response } from 'express';
import { Wallet } from 'ethers';

const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

export class EthereumRoutes {
  constructor(
    private ethereumService: EthereumService, // private readonly ethereumGasService: EthereumGasService
    private readonly config: EthereumConfigService
  ) {}

  getNetworkInformation() {
    return {
      network: this.config.networkName,
      rpcUrl: this.config.rpcUrl,
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
        network: this.config.networkName,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        balances: balances,
      });
    } catch (err) {
      // this.logger.error(err);
      res.status(500).send(err);
    }
  }

  async allowances(req: Request, res: Response) {
    const initTime = Date.now();

    // Getting spender
    const spender = this.config.spenders[req.body.connector];
    if (!spender) {
      res.status(500).send('Wrong connector');
    }

    // Getting Wallet
    try {
      const wallet = this.ethereumService.getWallet(req.body.privateKey);
      // Populate token contract info using token symbol list
      let tokenContractList: Record<string, TokenERC20Info> = {};
      tokenContractList = this.ethereumService.getERC20TokensAddresses(
        req.body.tokenList
      );

      const approvals: Record<string, BigInt> = {};
      await Promise.all(
        Object.keys(tokenContractList).map(async (symbol) => {
          const address = tokenContractList[symbol].address;
          const decimals = tokenContractList[symbol].decimals;
          approvals[symbol] = await this.ethereumService.getERC20Allowance(
            wallet,
            spender,
            address,
            decimals
          );
        })
      );

      // this.logger.log('eth.route - Getting allowances');

      res.status(500).json({
        network: this.config.networkName,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        spender: spender,
        approvals: approvals,
      });
    } catch (err) {
      // this.logger.error(err);
      // throw new InternalServerErrorException('Error getting wallet');
      res.status(500).send(err);
    }
  }
}
