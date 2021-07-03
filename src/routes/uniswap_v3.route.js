import { ethers } from 'ethers';
import express from 'express';
import { getNonceManager } from '../services/utils';

import { getParamData, latency, statusMessages } from '../services/utils';
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
uniswap.generate_tokens();
setTimeout(uniswap.update_pairs.bind(uniswap), 2000);
const fees = new Fees();

const swapMoreThanMaxPriceError = 'Price too high';
const swapLessThanMaxPriceError = 'Price too low';

const estimateGasLimit = () => {
  return uniswap.gasLimit;
};

const getErrorMessage = (err) => {
  /*
    [WIP] Custom error message based-on string match
  */
  let message = err;
  if (err.includes('Invariant failed: RATIO_CURRENT')) {
    message = 'Cannot find a proper route';
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
      gasLimit: gasLimit,
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
  const pair = paramData.pair;
  const baseTokenContractInfo = eth.getERC20TokenAddresses(pair.split('-')[0]);
  const quoteTokenContractInfo = eth.getERC20TokenAddresses(pair.split('-')[1]);

  const result = {
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    info: uniswap.abiDecoder.decodeLogs(logs),
    baseDecimal: baseTokenContractInfo.decimals,
    quoteDecimal: quoteTokenContractInfo.decimals
  };
  res.status(200).json(result);
});

router.get('/start', async (req, res) => {
  /*
    POST: /eth/uniswap/v3/start
      x-www-form-urlencoded: {
        "pairs":"[ETH-USDT, ...]"
        "gasPrice":30
      }
  */
  let orderedPairs = [];
  const initTime = Date.now();
  const paramData = getParamData(req.query);
  const pairs = JSON.parse(paramData.pairs);
  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  // get token contract address and cache paths
  for (let pair of pairs) {
    pair = pair.split('-');
    const baseTokenSymbol = pair[0];
    const quoteTokenSymbol = pair[1];
    const baseTokenContractInfo = eth.getERC20TokenAddresses(baseTokenSymbol);
    const quoteTokenContractInfo = eth.getERC20TokenAddresses(quoteTokenSymbol);

    // check for valid token symbols
    if (
      baseTokenContractInfo === undefined ||
      quoteTokenContractInfo === undefined
    ) {
      const undefinedToken =
        baseTokenContractInfo === undefined
          ? baseTokenSymbol
          : quoteTokenSymbol;
      res.status(500).json({
        error: `Token ${undefinedToken} contract address not found`,
        message: `Token contract address not found for ${undefinedToken}. Check token list source`
      });
      return;
    }

    //order trading pairs
    if (baseTokenContractInfo.address < quoteTokenContractInfo.address)
      orderedPairs.push(pair.join('-'));
    else orderedPairs.push(pair.reverse().join('-'));

    uniswap.extend_update_pairs([
      baseTokenContractInfo,
      quoteTokenContractInfo
    ]);
  }

  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  const result = {
    network: eth.network,
    timestamp: initTime,
    latency: latency(initTime, Date.now()),
    success: true,
    pairs: orderedPairs,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    gasCost: gasCost
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
    // fetch the optimal pool mix from uniswap
    const { trade, expectedAmount } =
      side === 'BUY'
        ? await uniswap.priceSwapOut(
            quoteTokenContractInfo, // tokenIn is quote asset
            baseTokenContractInfo, // tokenOut is base asset
            amount
          )
        : await uniswap.priceSwapIn(
            baseTokenContractInfo, // tokenIn is base asset
            quoteTokenContractInfo, // tokenOut is quote asset
            amount
          );

    if (side === 'BUY') {
      const price = trade.executionPrice.invert().toFixed();
      logger.info(`uniswap.route - Price: ${price.toString()}`);
      if (!limitPrice || price <= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await uniswap.swapExactOut(
          wallet,
          trade,
          baseTokenContractInfo,
          gasPrice
        );
        // submit response
        res.status(200).json({
          network: uniswap.network,
          timestamp: initTime,
          latency: latency(initTime, Date.now()),
          base: baseTokenAddress,
          quote: quoteTokenAddress,
          amount: amount,
          expectedIn: expectedAmount.toFixed(),
          price: price,
          gasPrice: gasPrice,
          gasLimit,
          gasCost,
          txHash: tx.hash
        });
      } else {
        res.status(200).json({
          error: swapMoreThanMaxPriceError,
          message: `Swap price ${price} exceeds limitPrice ${limitPrice}`
        });
        logger.info(
          `uniswap.route - Swap price ${price} exceeds limitPrice ${limitPrice}`
        );
      }
    } else {
      // sell
      const price = trade.executionPrice.toFixed();
      logger.info(`Price: ${price.toString()}`);
      if (!limitPrice || price >= limitPrice) {
        // pass swaps to exchange-proxy to complete trade
        const tx = await uniswap.swapExactIn(
          wallet,
          trade,
          baseTokenContractInfo,
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
          expectedOut: expectedAmount.toFixed(),
          price: parseFloat(price),
          gasPrice: gasPrice,
          gasLimit,
          gasCost: gasCost,
          txHash: tx.hash
        });
      } else {
        res.status(200).json({
          error: swapLessThanMaxPriceError,
          message: `Swap price ${price} lower than limitPrice ${limitPrice}`
        });
        logger.info(
          `uniswap.route - Swap price ${price} lower than limitPrice ${limitPrice}`
        );
      }
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

  //const side = paramData.side.toUpperCase() // not used for now
  let gasPrice;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  let priceResult, price;
  try {
    if (paramData.amount) {
      // get price at this depth
      const amount = paramData.amount;
      const side = paramData.side.toUpperCase();
      const { trade, expectedAmount } =
        side === 'BUY'
          ? await uniswap.priceSwapOut(
              quoteTokenContractInfo, // tokenIn is quote asset
              baseTokenContractInfo, // tokenOut is base asset
              amount
            )
          : await uniswap.priceSwapIn(
              baseTokenContractInfo, // tokenIn is base asset
              quoteTokenContractInfo, // tokenOut is quote asset
              amount
            );

      if (trade !== null && expectedAmount !== null) {
        price =
          side === 'BUY'
            ? trade.executionPrice.invert().toFixed()
            : trade.executionPrice.toFixed();

        priceResult = {
          price: parseFloat(price),
          amount: parseFloat(amount),
          expectedAmount: parseFloat(expectedAmount.toFixed())
        };
      }
    } else {
      // get mid price for all tiers
      priceResult = await uniswap.currentPrice(
        wallet,
        baseTokenContractInfo,
        quoteTokenContractInfo,
        paramData.tier,
        paramData.seconds ? paramData.seconds : 1
      );
    }

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      base: baseTokenContractInfo.address,
      quote: quoteTokenContractInfo.address,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost
    };
    debug(
      `Mid Price ${baseTokenContractInfo.symbol}-${
        quoteTokenContractInfo.symbol
      } | (rate:${JSON.stringify(
        priceResult
      )}) - gasPrice:${gasPrice} gasLimit:${gasLimit} estimated fee:${gasCost} ETH`
    );
    res.status(200).json({ ...result, ...priceResult });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    let errCode = 500;
    if (Object.keys(err).includes('isInsufficientReservesError')) {
      errCode = 200;
      reason = statusMessages.insufficient_reserves + ' in ' + ' at Uniswap';
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
    const positionData = await uniswap.getPosition(wallet, tokenId, eth);

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

  let gasPrice, tokenId;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  if (paramData.tokenId) {
    tokenId = parseInt(paramData.tokenId);
  } else {
    tokenId = 0;
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
      upperPrice,
      tokenId
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      token0: paramData.token0,
      token1: paramData.token1,
      fee: fee,
      amount0: amount0,
      amount1: amount1,
      lowerPrice: lowerPrice,
      upperPrice: upperPrice,
      hash: newPosition.hash,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost
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

  let gasPrice, reducePercent;
  if (paramData.gasPrice) {
    gasPrice = parseFloat(paramData.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  if (paramData.reducePercent) {
    reducePercent = parseFloat(paramData.reducePercent);
  } else {
    reducePercent = 100;
  }
  const gasLimit = estimateGasLimit();
  const gasCost = await fees.getGasCost(gasPrice, gasLimit);

  try {
    const removelp = await uniswap.reducePosition(
      wallet,
      tokenId,
      eth,
      reducePercent
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      hash: removelp.hash,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost
    };
    debug(`Remove lp: ${removelp.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    let errCode = 500;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(errCode).json({
      error: reason,
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
      tokenId: tokenId,
      hash: collect.hash,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost
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
