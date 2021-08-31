import {
  bigNumberWithDecimalToStr,
  EthereumService,
  TokenERC20Info,
} from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';
// import { EthereumGasService } from '../services/ethereum_gas';
import Fees from '../services/fees';

import { getNonceManager } from '../services/utils';

import { logger } from '../services/logger';
import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';

const router = Router();

const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

const config = new EthereumConfigService();
const ethereumService = new EthereumService(config);
// const ethereumGasService = new EthereumGasService(config);
const fees = new Fees();

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
    const wallet = ethereumService.getWallet(req.body.privateKey);

    // Populate token contract info using token symbol list
    const tokenList: Record<string, TokenERC20Info> = {};
    for (const symbol of JSON.parse(req.body.tokenList)) {
      const token = ethereumService.getERC20Token(symbol) as TokenERC20Info;
      tokenList[symbol] = token;
    }

    const balances: Record<string, string> = {};
    balances.ETH = await ethereumService.getETHBalance(wallet);
    await Promise.all(
      Object.keys(tokenList).map(async (symbol) => {
        if (tokenList[symbol] !== undefined) {
          balances[symbol] = await ethereumService.getERC20Balance(
            wallet,
            tokenList[symbol].address,
            tokenList[symbol].decimals
          );
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
  const spender: string | null = config.spenders[req.body.connector];
  if (!spender) {
    res.status(500).send('Wrong connector');
  }

  // Trying connect to Wallet
  try {
    const wallet = ethereumService.getWallet(req.body.privateKey);

    // Populate token contract info using token symbol list
    const tokenList: Record<string, TokenERC20Info> = {};
    for (const symbol of JSON.parse(req.body.tokenList)) {
      const token = ethereumService.getERC20Token(symbol) as TokenERC20Info;
      tokenList[symbol] = token;
    }

    const approvals: Record<string, string> = {};
    await Promise.all(
      Object.keys(tokenList).map(async (symbol) => {
        try {
          approvals[symbol] = await ethereumService.getERC20Allowance(
            wallet,
            spender,
            tokenList[symbol].address,
            tokenList[symbol].decimals
          );
        } catch (err) {
          logger.error(err);
          // this helps preserve the expected behavior
          approvals[symbol] = 'invalid ENS name';
        }
      })
    );

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
    const wallet = await getNonceManager(
      ethereumService.getWallet(req.body.privateKey)
    );

    // Getting token info
    const token = ethereumService.getERC20Token(req.body.token);

    if (!token) {
      res.status(500).send(`Token "${req.body.token}" is not supported`);
    } else {
      const amount = req.body.amount
        ? ethers.utils.parseUnits(req.body.amount, token.decimals)
        : ethers.constants.MaxUint256;
      // call approve function
      let approval;
      try {
        approval = await ethereumService.approveERC20(
          wallet,
          spender,
          token.address,
          amount,
          fees.ethGasPrice as number
        );
      } catch (err) {
        approval = err;
      }

      res.status(200).json({
        network: config.networkName,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        tokenAddress: token.address,
        spender: spender,
        amount: bigNumberWithDecimalToStr(amount, token.decimals),
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
  if (receipt.gasUsed) {
    receipt.gasUsed = receipt.gasUsed.toNumber();
  }

  res.status(200).json({
    network: config.networkName,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    txHash: req.body.txHash,
    confirmed,
    receipt: confirmed ? receipt : {},
  });
});

router.post('/token', async (req: Request, res: Response) => {
  const token = await ethereumService.getERC20Token(req.body.symbol);
  res.status(200).json(token);
});

export default router;
