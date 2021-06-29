import { EthereumService, TokenERC20Info } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';
import { EthereumGasService } from '../services/ethereum_gas';
import { logger } from '../services/logger';
import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';

const router = Router();

const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

const config = new EthereumConfigService();
const ethereumService = new EthereumService(config);
const ethereumGasService = new EthereumGasService(config);

router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  res.status(200).json({
    network: config.networkName,
    rpcUrl: config.rpcUrl,
    connection: true,
    timestamp: Date.now(),
  });
});

router.post('/balances', async (req: Request, res: Response) => {
  const initTime = Date.now();

  // Trying connect to Wallet
  try {
    const wallet: ethers.Wallet = ethereumService.getWallet(
      req.body.privateKey || ''
    );

    // Populate token contract info using token symbol list
    let tokenContractList: Record<string, TokenERC20Info> = {};
    tokenContractList = ethereumService.getERC20TokenAddresses(
      JSON.parse(req.body.tokenList)
    );

    // Getting user balancers
    const balances: Record<string, string> = {};
    balances.ETH = (await ethereumService.getETHBalance(wallet)).toString();
    await Promise.all(
      Object.keys(tokenContractList).map(async (symbol) => {
        if (tokenContractList[symbol] !== undefined) {
          const address = tokenContractList[symbol].address;
          const decimals = tokenContractList[symbol].decimals;
          balances[symbol] = (
            await ethereumService.getERC20Balance(wallet, address, decimals)
          ).toString();
        } else {
          logger.error(`Token contract info for ${symbol} not found`);
        }
      })
    );

    res.status(200).json({
      network: config.networkName,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      balances: balances,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.post('/allowances', async (req: Request, res: Response) => {
  const initTime = Date.now();
  // Getting spender
  const spender = config.spenders[req.body.connector];
  if (!spender) {
    res.status(500).send('Wrong connector');
  }

  // Getting Wallet
  try {
    const wallet = ethereumService.getWallet(req.body.privateKey);
    // Populate token contract info using token symbol list
    let tokenContractList: Record<string, TokenERC20Info> = {};
    tokenContractList = ethereumService.getERC20TokenAddresses(
      JSON.parse(req.body.tokenList)
    );
    const approvals: Record<string, BigInt | string> = {};
    await Promise.all(
      Object.keys(tokenContractList).map(async (symbol) => {
        const address = tokenContractList[symbol].address;
        const decimals = tokenContractList[symbol].decimals;
        try {
          approvals[symbol] = await ethereumService.getERC20Allowance(
            wallet,
            spender,
            address,
            decimals
          );
        } catch (_err) {
          // this helps preserve the expected behavior
          approvals[symbol] = 'invalid ENS name';
        }
      })
    );

    logger.info('eth.route - Getting allowances');

    res.status(200).json({
      network: config.networkName,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      spender: spender,
      approvals: approvals,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send('Error getting wallet');
  }
});

router.post('/approve', async (req: Request, res: Response) => {
  const initTime = Date.now();

  // Getting spender
  const spender = config.spenders[req.body.connector];
  if (!spender) {
    res.status(500).send('Wrong connector');
  }
  // Getting Wallet
  try {
    const wallet = ethereumService.getWallet(req.body.privateKey);

    // Getting token info
    const tokenContractInfo = ethereumService.getERC20TokenAddress(
      req.body.token
    );

    if (!tokenContractInfo) {
      res.status(500).send(`Token "${req.body.token}" is not supported`);
    } else {
      const tokenAddress = tokenContractInfo.address;

      const gasPrice = req.body.gasPrice || ethereumGasService.getGasPrice();

      let amount = ethers.constants.MaxUint256;
      if (req.body.amount) {
        amount = ethers.utils.parseUnits(
          req.body.amount,
          tokenContractInfo.decimals
        );
      }
      console.log('approve');
      // call approve function
      let approval;
      try {
        approval = await ethereumService.approveERC20(
          wallet,
          spender,
          tokenAddress,
          amount,
          gasPrice
        );
      } catch (err) {
        approval = err;
      }

      res.status(200).json({
        network: config.networkName,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        tokenAddress: tokenAddress,
        spender: spender,
        amount: amount
          .div(ethers.BigNumber.from(BigInt(tokenContractInfo.decimals)))
          .toString(),
        approval: approval,
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send('Error getting wallet');
  }
});

router.post('/poll', async (req: Request, res: Response) => {
  const initTime = Date.now();
  const receipt = await ethereumService.getTransactionReceipt(req.body.txHash);
  const confirmed = receipt && receipt.blockNumber ? true : false;

  logger.info(`eth.route - Get TX Receipt: ${req.body.txHash}`);

  res.status(200).json({
    network: config.networkName,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    txHash: req.body.txHash,
    confirmed,
    receipt: confirmed ? receipt : {},
  });
});

export default router;
