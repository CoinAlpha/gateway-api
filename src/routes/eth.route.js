import { ethers, BigNumber } from 'ethers';
import express from 'express';

import { getParamData, latency, statusMessages } from '../services/utils';
import Ethereum from '../services/eth';
import Fees from '../services/fees';
import { logger } from '../services/logger';

const debug = require('debug')('router');
const router = express.Router();
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;
const eth = new Ethereum(globalConfig.getConfig('ETHEREUM_CHAIN'));
const spenders = {
  balancer: globalConfig.getConfig('EXCHANGE_PROXY'),
  uniswap: globalConfig.getConfig('UNISWAP_ROUTER'),
  uniswapV3Router: globalConfig.getConfig('UNISWAP_V3_ROUTER'),
  uniswapV3NFTManager: globalConfig.getConfig('UNISWAP_V3_NFT_MANAGER')
};
const fees = new Fees();

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: eth.network,
    rpcUrl: eth.provider.connection.url,
    connection: true,
    timestamp: Date.now()
  });
});

router.post('/balances', async (req, res) => {
  /*
      POST: /balances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenList:{{tokenList}}
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet');
    res.status(500).json({
      error: reason,
      message: err
    });
    return;
  }

  // populate token contract info using token symbol list
  const tokenContractList = [];
  const tokenList = JSON.parse(paramData.tokenList);
  tokenList.forEach((symbol) => {
    const tokenContractInfo = eth.getERC20TokenAddresses(symbol);
    tokenContractList[symbol] = tokenContractInfo;
  });

  const balances = {};
  balances.ETH = await eth.getETHBalance(wallet, privateKey);
  try {
    Promise.all(
      Object.keys(tokenContractList).map(async (symbol, _index) => {
        if (tokenContractList[symbol] !== undefined) {
          const address = tokenContractList[symbol].address;
          const decimals = tokenContractList[symbol].decimals;
          balances[symbol] = await eth.getERC20Balance(
            wallet,
            address,
            decimals
          );
        } else {
          const err = `Token contract info for ${symbol} not found`;
          logger.error('Token info not found', { message: err });
          debug(err);
        }
      })
    ).then(() => {
      debug('eth.route - Get Account Balance', {
        message: JSON.stringify(tokenList)
      });
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        balances
      });
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err
    });
  }
});

router.post('/allowances', async (req, res) => {
  /*
      POST: /allowances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddressList:{{tokenAddressList}}
        connector:{{connector_name}}
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const spender = spenders[paramData.connector];
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet');
    res.status(500).json({
      error: reason,
      message: err
    });
    return;
  }

  // populate token contract info using token symbol list
  const tokenContractList = [];
  const tokenList = JSON.parse(paramData.tokenList);
  tokenList.forEach((symbol) => {
    const tokenContractInfo = eth.getERC20TokenAddresses(symbol);
    tokenContractList[symbol] = tokenContractInfo;
  });

  const approvals = {};
  try {
    Promise.all(
      Object.keys(tokenContractList).map(async (symbol, _index) => {
        const address = tokenContractList[symbol].address;
        const decimals = tokenContractList[symbol].decimals;
        approvals[symbol] = await eth.getERC20Allowance(
          wallet,
          spender,
          address,
          decimals
        );
      })
    ).then(() => {
      logger.info('eth.route - Getting allowances', {
        message: JSON.stringify(tokenList)
      });
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        spender,
        approvals
      });
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err
    });
  }
});

router.post('/balances-2', async (req, res) => {
  /*
      POST: /balances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddressList:{{tokenAddressList}}
        tokenDecimalList:{{tokenDecimalList}}
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider);
  } catch (err) {
    let reason;
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet');
    res.status(500).json({
      error: reason,
      message: err
    });
    return;
  }
  let tokenAddressList;
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(',');
  }
  let tokenDecimalList;
  if (paramData.tokenDecimalList) {
    tokenDecimalList = paramData.tokenDecimalList.split(',');
  }

  const balances = {};
  balances.ETH = await eth.getETHBalance(wallet, privateKey);
  try {
    Promise.all(
      tokenAddressList.map(
        async (value, index) =>
          (balances[value] = await eth.getERC20Balance(
            wallet,
            value,
            tokenDecimalList[index]
          ))
      )
    ).then(() => {
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        balances
      });
    });
  } catch (err) {
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err
    });
  }
});

router.post('/allowances-2', async (req, res) => {
  /*
      POST: /allowances
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddressList:{{tokenAddressList}}
        tokenDecimalList:{{tokenDecimalList}}
        connector:{{connector_name}}
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const spender = spenders[paramData.connector];
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider);
  } catch (err) {
    let reason;
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet');
    res.status(500).json({
      error: reason,
      message: err
    });
    return;
  }
  let tokenAddressList;
  if (paramData.tokenAddressList) {
    tokenAddressList = paramData.tokenAddressList.split(',');
  }
  let tokenDecimalList;
  if (paramData.tokenDecimalList) {
    tokenDecimalList = paramData.tokenDecimalList.split(',');
  }

  const approvals = {};
  try {
    Promise.all(
      tokenAddressList.map(
        async (value, index) =>
          (approvals[value] = await eth.getERC20Allowance(
            wallet,
            spender,
            value,
            tokenDecimalList[index]
          ))
      )
    ).then(() => {
      res.status(200).json({
        network: eth.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        spender,
        approvals
      });
    });
  } catch (err) {
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err
    });
  }
});

router.post('/approve', async (req, res) => {
  /*
      POST: /approve
      x-www-form-urlencoded: {
        privateKey:{{privateKey}}
        tokenAddress:"0x....."
        decimals: {{token_decimals}}
        connector:{{connector_name}}
        amount:{{amount}}
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const spender = spenders[paramData.connector];
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, eth.provider);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason ? (reason = err.reason) : (reason = 'Error getting wallet');
    res.status(500).json({
      error: reason,
      message: err
    });
    return;
  }
  const token = paramData.token;
  const tokenContractInfo = eth.getERC20TokenAddresses(token);
  const tokenAddress = tokenContractInfo.address;
  const decimals = tokenContractInfo.decimals;

  let amount;
  paramData.amount
    ? (amount = ethers.utils.parseUnits(paramData.amount, decimals))
    : (amount = ethers.constants.MaxUint256); // approve max possible units if no amount specified
  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  try {
    // call approve function
    const approval = await eth.approveERC20(
      wallet,
      spender,
      tokenAddress,
      amount,
      gasPrice
    );
    // console.log('eth.route - Approving allowance', { message: approval })
    // submit response
    res.status(200).json({
      network: eth.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      tokenAddress,
      spender,
      amount: amount / (1e18).toString(),
      approval
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err
    });
  }
});

router.post('/poll', async (req, res) => {
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const txHash = paramData.txHash;
  const txReceipt = await eth.provider.getTransactionReceipt(txHash);
  const receipt = {};
  const confirmed = !!(txReceipt && txReceipt.blockNumber);
  if (confirmed) {
    receipt.gasUsed = BigNumber.from(txReceipt.gasUsed).toNumber();
    receipt.blockNumber = txReceipt.blockNumber;
    receipt.confirmations = txReceipt.confirmations;
    receipt.status = txReceipt.status;
    receipt.logs = txReceipt.logs;
  }
  logger.info(`eth.route - Get TX Receipt: ${txHash}`, {
    message: JSON.stringify(receipt)
  });
  res.status(200).json({
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    txHash,
    confirmed,
    receipt
  });
  return txReceipt;
});

// Kovan faucet to get test tokens (wip) & weth conversion
// router.post('/get-weth', async (req, res) => {
//   /*
//       POST: /get-weth
//       x-www-form-urlencoded: {
//         gasPrice:{gasPrice}
//         amount:{{amount}}
//         privateKey:{{privateKey}}
//       }
//   */
//   const initTime = Date.now()
//   const paramData = getParamData(req.body)
//   const privateKey = paramData.privateKey
//   let wallet
//   try {
//     wallet = new ethers.Wallet(privateKey, eth.provider)
//   } catch (err) {
//     logger.error(req.originalUrl, { message: err })
//     let reason
//     err.reason ? reason = err.reason : reason = 'Error getting wallet'
//     res.status(500).json({
//       error: reason,
//       message: err
//     })
//     return
//   }
//   const amount = ethers.utils.parseEther(paramData.amount)
//   const tokenAddress = eth.getERC20TokenAddresses('WETH').address
//   let gasPrice
//   if (paramData.gasPrice) {
//     gasPrice = parseFloat(paramData.gasPrice)
//   }

//   try {
//     // call deposit function
//     const response = await eth.deposit(wallet, tokenAddress, amount, gasPrice)

//     // submit response
//     res.status(200).json({
//       network: eth.network,
//       timestamp: initTime,
//       amount: parseFloat(amount),
//       result: response
//     })
//   } catch (err) {
//     logger.error(req.originalUrl, { message: err })
//     let reason
//     err.reason ? reason = err.reason : reason = statusMessages.operation_error
//     res.status(500).json({
//       error: reason,
//       message: err
//     })
//   }
// })

module.exports = router;
