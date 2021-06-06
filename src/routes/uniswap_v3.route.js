import { ethers } from 'ethers';
import express from 'express';
import {
  getNonceManager,
  getParamData,
  latency,
  statusMessages
} from '../services/utils';

import { logger } from '../services/logger';
import Ethereum from '../services/eth';
import UniswapV3 from '../services/uniswap_v3';
import Fees from '../services/fees';

const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const debug = require('debug')('router');

const router = express.Router();
const eth = new Ethereum(globalConfig.getConfig('ETHEREUM_CHAIN'));
const uniswap = new UniswapV3(globalConfig.getConfig('ETHEREUM_CHAIN'));

const fees = new Fees();

// const swapMoreThanMaxPriceError = 'Price too high'
// const swapLessThanMaxPriceError = 'Price too low'

const estimateGasLimit = () => uniswap.gasLimit;

const getErrorMessage = (err) => {
  /*
    [WIP] Custom error message based-on string match
  */
  let message = err;
  if (err.includes('failed to meet quorum')) {
    message = 'Failed to meet quorum in Uniswap';
  } else if (err.includes('Invariant failed: ADDRESSES')) {
    message = 'Invariant failed: ADDRESSES';
  } else if (err.includes('"call revert exception')) {
    message = statusMessages.no_pool_available;
  } else if (err.includes('"trade" is read-only')) {
    message = statusMessages.no_pool_available;
  }
  return message;
};

router.post('/', async (req, res) => {
  /*
    POST /
  */
  res.status(200).json({
    network: uniswap.network,
    provider: uniswap.provider.connection.url,
    uniswap_router: uniswap.router,
    connection: true,
    timestamp: Date.now()
  });
});

router.post('/gas-limit', async (req, res) => {
  /*
    POST: /gas-limit
  */
  const gasLimit = estimateGasLimit();

  try {
    res.status(200).json({
      network: uniswap.network,
      gasLimit,
      timestamp: Date.now()
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

router.post('/result', async (req, res) => {
  /*
    POST: /eth/uniswap/v3/result
      x-www-form-urlencoded: {
        "logs":"[...]"
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const logs = JSON.parse(paramData.logs);

  const result = {
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    info: uniswap.abiDecoder.decodeLogs(logs)
  };
  res.status(200).json(result);
});

router.post('/trade', async (req, res) => {
  /*
      POST: /trade
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
        "amount":0.1
        "limitPrice":1
        "tier": {low|medium|high}
        "gasPrice":10
        "privateKey":{{privateKey}}
        "side":{buy|sell}
      }
*/
  const initTime = Date.now();
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const amount = paramData.amount;

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote);
  const baseTokenAddress = baseTokenContractInfo.address;
  const quoteTokenAddress = quoteTokenContractInfo.address;
  const side = paramData.side.toUpperCase();
  const tier = paramData.tier.toUpperCase();

  let limitPrice;
  if (paramData.limitPrice) {
    limitPrice = parseFloat(paramData.limitPrice);
  } else {
    limitPrice = 0;
  }
  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    if (side === 'BUY') {
      const tx = await uniswap.swapExactOut(
        wallet,
        baseTokenContractInfo, // tokenIn is quote asset
        quoteTokenContractInfo, // tokenOut is base asset
        amount,
        limitPrice,
        tier,
        gasPrice
      );
      // submit response
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount,
        expectedIn: tx.expectedAmount,
        price: limitPrice,
        gasPrice,
        gasLimit,
        gasCost,
        txHash: tx.hash
      });
    } else {
      // sell
      const tx = await uniswap.swapExactIn(
        wallet,
        baseTokenContractInfo, // tokenIn is quote asset
        quoteTokenContractInfo, // tokenOut is base asset
        amount,
        limitPrice,
        tier,
        gasPrice
      );

      // submit response
      res.status(200).json({
        network: uniswap.network,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        base: baseTokenAddress,
        quote: quoteTokenAddress,
        amount: parseFloat(paramData.amount),
        expectedOut: tx.expectedAmount,
        price: limitPrice,
        gasPrice,
        gasLimit,
        gasCost,
        txHash: tx.hash
      });
    }
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

router.post('/price', async (req, res) => {
  /*
    POST: /price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
      }
      */
  const initTime = Date.now();
  // params: base (required), quote (required), amount (required)
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.quote);
  const baseTokenAddress = baseTokenContractInfo.address;
  const quoteTokenAddress = quoteTokenContractInfo.address;

  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    // fetch pools for all tiers
    const prices = await uniswap.currentPrice(
      wallet,
      baseTokenAddress,
      quoteTokenAddress
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseTokenAddress,
      quote: quoteTokenAddress,
      prices,
      gasPrice,
      gasLimit,
      gasCost
    };
    debug(
      `Mid Price ${baseTokenContractInfo.symbol}-${
        quoteTokenContractInfo.symbol
      } | (rate:${JSON.stringify(
        prices
      )}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    let errCode = 500;
    if (Object.keys(err).includes('isInsufficientReservesError')) {
      errCode = 200;
      reason = `${statusMessages.insufficient_reserves} at Uniswap`;
    } else if (Object.getOwnPropertyNames(err).includes('message')) {
      reason = getErrorMessage(err.message);
      if (reason === statusMessages.no_pool_available) {
        errCode = 200;
        res.status(errCode).json({
          info: reason,
          message: err
        });
      }
    } else {
      err.reason
        ? (reason = err.reason)
        : (reason = statusMessages.operation_error);
    }
    res.status(errCode).json({
      error: reason,
      message: err
    });
  }
});

// LP section

router.post('/position', async (req, res) => {
  /*
    POST: /position
      x-www-form-urlencoded: {
        "tokenId":"tokenId"
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = paramData.tokenId;

  try {
    // fetch position data
    const positionData = await uniswap.getPosition(wallet, tokenId);

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      position: positionData
    };
    debug(`Position data: ${positionData} `);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    res.status(500).json({
      info: statusMessages.operation_error,
      position: {}
    });
  }
});

router.post('/add-position', async (req, res) => {
  /*
    POST: /add-position
      x-www-form-urlencoded: {
        "token0":"BAT"
        "token1":"DAI"
        "fee":1
        "lowerPrice": 1
        "upperPrice": 2
        "amount0": amount0
        "amount1": amount1
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );

  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.token0);
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.token1);
  const fee = paramData.fee;
  const lowerPrice = parseFloat(paramData.lowerPrice);
  const upperPrice = parseFloat(paramData.upperPrice);
  const amount0 = paramData.amount0;
  const amount1 = paramData.amount1;

  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    // add position to pool
    const newPosition = await uniswap.addPosition(
      wallet,
      baseTokenContractInfo,
      quoteTokenContractInfo,
      amount0,
      amount1,
      fee,
      lowerPrice,
      upperPrice
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      token0: paramData.token0,
      token1: paramData.token1,
      fee,
      amount0,
      amount1,
      lowerPrice,
      upperPrice,
      hash: newPosition.hash,
      gasPrice,
      gasLimit,
      gasCost
    };
    debug(`New Position: ${newPosition.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    res.status(200).json({
      info: statusMessages.operation_error,
      message: err
    });
  }
});

router.post('/remove-position', async (req, res) => {
  /*
    POST: /remove-position
      x-www-form-urlencoded: {
        "tokenId":"12"
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = paramData.tokenId;

  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    const removelp = await uniswap.removePosition(wallet, tokenId);

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      hash: removelp.hash,
      gasPrice,
      gasLimit,
      gasCost
    };
    debug(`Remove lp: ${removelp.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    const errCode = 500;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(errCode).json({
      error: reason,
      message: err
    });
  }
});

router.post('/replace-position', async (req, res) => {
  /*
    POST: /replace-position
      x-www-form-urlencoded: {
        "tokenId":"tokenId"
        "token0":"BAT"
        "token1":"DAI"
        "fee":1
        "lowerPrice": 1
        "upperPrice": 2
        "amount0": amount0
        "amount1": amount1
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = paramData.tokenId;
  const baseTokenContractInfo = eth.getERC20TokenAddresses(paramData.token0);
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(paramData.token1);
  const fee = paramData.fee;
  const lowerPrice = parseFloat(paramData.lowerPrice);
  const upperPrice = parseFloat(paramData.upperPrice);
  const amount0 = paramData.amount0;
  const amount1 = paramData.amount1;

  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    // const position = await uniswap.getPosition(wallet, tokenId)
    // const token0 = eth.getERC20TokenByAddress(position.token0)
    // const token1 = eth.getERC20TokenByAddress(position.token1)
    const positionChange = await uniswap.replacePosition(
      wallet,
      tokenId,
      baseTokenContractInfo,
      quoteTokenContractInfo,
      amount0,
      amount1,
      fee,
      lowerPrice,
      upperPrice
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      tokenId,
      amount0,
      amount1,
      hash: positionChange.hash,
      gasPrice,
      gasLimit,
      gasCost
    };
    debug(`Position change ${positionChange.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    res.status(200).json({
      info: statusMessages.operation_error,
      message: err
    });
  }
});

router.post('/collect-fees', async (req, res) => {
  /*
    POST: /position
      x-www-form-urlencoded: {
      "tokenId":"tokenId"
      "amount0": amount0
      "amount1": amount1
      }
  */
  const initTime = Date.now();
  const paramData = getParamData(req.body);
  const privateKey = paramData.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = paramData.tokenId;

  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    // withdraw fees
    const collect = await uniswap.collectFees(wallet, tokenId);

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      tokenId,
      hash: collect.hash,
      gasPrice,
      gasLimit,
      gasCost
    };
    debug(`Fees: ${collect.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    res.status(200).json({
      info: statusMessages.operation_error,
      message: err
    });
  }
});

export default router;
