import { ethers } from 'ethers';
import express from 'express';
import { Request, Response } from 'express';

import { getNonceManager } from '../services/utils';

import { latency, statusMessages } from '../services/utils';
import { logger } from '../services/logger';

import { EthereumService } from '../services/ethereum';
import { EthereumConfigService } from '../services/ethereum_config';

import UniswapV3 from '../services/uniswap_v3';
import Fees from '../services/fees';

const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const debug = require('debug')('router');
const router = express.Router();

const ethConfig = new EthereumConfigService();
const eth = new EthereumService(ethConfig);

const uniswap = new UniswapV3(globalConfig.getConfig('ETHEREUM_CHAIN'));

const fees = new Fees();

// const swapMoreThanMaxPriceError = 'Price too high';
// const swapLessThanMaxPriceError = 'Price too low';

const estimateGasLimit = () => {
  return uniswap.gasLimit;
};

const getErrorMessage = (err: string) => {
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
  } else if (err.includes('insufficient funds')) {
    message = statusMessages.insufficient_fee;
  } else {
    message = statusMessages.operation_error;
  }
  return message;
};

router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  res.status(200).json({
    network: uniswap.network,
    provider: uniswap.provider.connection.url,
    uniswap_router: uniswap.router,
    connection: true,
    timestamp: Date.now(),
  });
});

router.post('/gas-limit', async (req: Request, res: Response) => {
  /*
    POST: /gas-limit
  */
  const gasLimit = estimateGasLimit();

  try {
    res.status(200).json({
      network: uniswap.network,
      gasLimit: gasLimit,
      timestamp: Date.now(),
    });
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err,
    });
  }
});

router.post('/result', async (req: Request, res: Response) => {
  /*
    POST: /eth/uniswap/v3/result
      x-www-form-urlencoded: {
        "logs":"[...]"
      }
  */
  const initTime = Date.now();
  const logs = JSON.parse(req.body.logs);
  const pair = req.body.pair;
  const baseTokenContractInfo = eth.getERC20TokenAddress(pair.split('-')[0]);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(pair.split('-')[1]);

  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const result = {
      network: eth.networkName,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      info: uniswap.abiDecoder.decodeLogs(logs),
      baseDecimal: baseTokenContractInfo.decimals,
      quoteDecimal: quoteTokenContractInfo.decimals,
    };
    res.status(200).json(result);
  } else {
    res.status(500).json({ err: 'expected a base/quote pair' });
  }
});

router.get('/start', async (req, res) => {
  /*
    GET: /eth/uniswap/v3/start?pairs=["WETH-USDC"]&gasPrice=30
  */
  const orderedPairs = [];
  const initTime = Date.now();
  let pairs;
  if (typeof req.query.pairs === 'string') {
    pairs = JSON.parse(req.query.pairs);
  } else {
    res.status(500).json({
      error: 'pairs query param required',
    });
  }

  // get token contract address and cache paths
  for (let pair of pairs) {
    pair = pair.split('-');
    const baseTokenSymbol = pair[0];
    const quoteTokenSymbol = pair[1];
    const baseTokenContractInfo = eth.getERC20TokenAddress(baseTokenSymbol);
    const quoteTokenContractInfo = eth.getERC20TokenAddress(quoteTokenSymbol);

    if (baseTokenContractInfo && quoteTokenContractInfo) {
      // check for valid token symbols
      // order trading pairs
      if (baseTokenContractInfo.address < quoteTokenContractInfo.address) {
        orderedPairs.push(pair.join('-'));
      } else {
        orderedPairs.push(pair.reverse().join('-'));
      }

      const result = {
        network: eth.networkName,
        timestamp: initTime,
        latency: latency(initTime, Date.now()),
        success: true,
        pairs: orderedPairs,
      };
      res.status(200).json(result);
    } else {
      const undefinedToken =
        baseTokenContractInfo === undefined
          ? baseTokenSymbol
          : quoteTokenSymbol;
      res.status(500).json({
        error: `Token ${undefinedToken} contract address not found`,
        message: `Token contract address not found for ${undefinedToken}. Check token list source`,
      });
    }
  }
});

/*router.post('/trade', async (req: Request, res: Response) => {

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

  const initTime = Date.now();
  // params: privateKey (required), base (required), quote (required), amount (required), maxPrice (required), gasPrice (required)
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const amount = req.body.amount;

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);
  if (baseTokenContractInfo && quoteTokenContractInfo) {
    const baseTokenAddress = baseTokenContractInfo.address;
    const quoteTokenAddress = quoteTokenContractInfo.address;
    const side = req.body.side.toUpperCase();

    let limitPrice;
    if (req.body.limitPrice) {
      limitPrice = parseFloat(req.body.limitPrice);
    } else {
      limitPrice = 0;
    }
    let gasPrice;
    if (req.body.gasPrice) {
      gasPrice = parseFloat(req.body.gasPrice);
    } else {
      gasPrice = fees.ethGasPrice;
    }
    const gasLimit = estimateGasLimit();
    const gasCost = await fees.getGasCost(gasPrice, gasLimit);

    try {
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
        const price = parseFloat(trade.executionPrice.invert().toSignificant(8));
        logger.info(`uniswap.route - Price: ${price.toString()}`);
        if (!limitPrice || price <= limitPrice) {
          // pass swaps to exchange-proxy to complete trade
          const tx = await uniswap.swap(
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
            expectedIn: expectedAmount.toFixed(8),
            price: price,
            gasPrice: gasPrice,
            gasLimit,
            gasCost,
            txHash: tx.hash,
          });
        } else {
          res.status(500).json({
            error: swapMoreThanMaxPriceError,
            message: `Swap price ${price} exceeds limitPrice ${limitPrice}`,
          });
          logger.info(
            `uniswap.route - Swap price ${price} exceeds limitPrice ${limitPrice}`
          );
        }
      } else {
        // sell
        const price = parseFloat(trade.executionPrice.toSignificant(8));
        logger.info(`Price: ${price.toString()}`);
        if (!limitPrice || price >= limitPrice) {
          // pass swaps to exchange-proxy to complete trade
          const tx = await uniswap.swap(
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
            amount: parseFloat(req.body.amount),
            expectedOut: expectedAmount.toSignificant(8),
            price: price,
            gasPrice: gasPrice,
            gasLimit,
            gasCost: gasCost,
            txHash: tx.hash,
          });
        } else {
          res.status(500).json({
            error: swapLessThanMaxPriceError,
            message: `Swap price ${price} lower than limitPrice ${limitPrice}`,
          });
          logger.info(
            `uniswap.route - Swap price ${price} lower than limitPrice ${limitPrice}`
          );
        }
      }
    } catch (err) {
      logger.error(req.originalUrl, { message: err });
      let reason = getErrorMessage(err.message);
      err.reason
        ? (reason = err.reason)
        : (reason = statusMessages.operation_error);
      res.status(500).json({
        error: reason,
        message: err,
      });
    }
  } else {
    res.status(500).json({
      error: 'unknown token addresses',
    });
  }
});
*/
router.post('/price', async (req: Request, res: Response) => {
  /*
    POST: /price
      x-www-form-urlencoded: {
        "quote":"BAT"
        "base":"DAI"
      }
      */
  const initTime = Date.now();
  // params: base (required), quote (required), amount (required)
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.base);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.quote);

  if (baseTokenContractInfo && quoteTokenContractInfo) {
    let gasPrice;
    if (req.body.gasPrice) {
      gasPrice = parseFloat(req.body.gasPrice);
    } else {
      gasPrice = fees.ethGasPrice;
    }
    const gasLimit = estimateGasLimit();
    const gasCost = await fees.getGasCost(gasPrice, gasLimit);
    try {
      // fetch pools for all tiers
      let priceResult;  // , price;
      if (req.body.amount) {
        /*
        // get price at this depth
        const amount = req.body.amount;
        const side = req.body.side.toUpperCase();
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
              ? trade.executionPrice.invert().toFixed(8)
              : trade.executionPrice.toFixed(8);

          priceResult = {
            price: parseFloat(price),
            amount: parseFloat(amount),
            expectedAmount: parseFloat(expectedAmount.toFixed(8)),
          };
        }
        */
      } else {
        // get mid price for all tiers
        priceResult = await uniswap.currentPrice(
          wallet,
          baseTokenContractInfo,
          quoteTokenContractInfo,
          req.body.tier,
          req.body.seconds ? req.body.seconds : 1
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
        gasCost: gasCost,
      };
      logger.info(
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
          reason = statusMessages.insufficient_reserves;
          res.status(errCode).json({
            info: reason,
            message: err,
          });
        }
      } else {
        err.reason
          ? (reason = err.reason)
          : (reason = statusMessages.operation_error);
      }
      res.status(errCode).json({
        error: reason,
        message: err,
      });
    }
  } else {
    res.status(500).json({
      error: 'unknown token addresses',
    });
  }
});

// LP section

router.post('/position', async (req: Request, res: Response) => {
  /*
    POST: /position
      x-www-form-urlencoded: {
        "tokenId":"tokenId"
      }
  */
  const initTime = Date.now();
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = req.body.tokenId;

  try {
    // fetch position data
    const positionData = await uniswap.getPosition(wallet, tokenId, eth);

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      position: positionData,
    };
    debug(`Position data: ${positionData} `);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    res.status(500).json({
      info: statusMessages.operation_error,
      position: {},
    });
  }
});

router.post('/add-position', async (req: Request, res: Response) => {
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
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );

  const baseTokenContractInfo = eth.getERC20TokenAddress(req.body.token0);
  const quoteTokenContractInfo = eth.getERC20TokenAddress(req.body.token1);
  const fee = req.body.fee;
  const lowerPrice = parseFloat(req.body.lowerPrice);
  const upperPrice = parseFloat(req.body.upperPrice);
  const amount0 = req.body.amount0;
  const amount1 = req.body.amount1;

  let gasPrice;
  if (req.body.gasPrice) {
    gasPrice = parseFloat(req.body.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  let tokenId;
  if (req.body.tokenId) {
    tokenId = parseInt(req.body.tokenId);
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
      token0: req.body.token0,
      token1: req.body.token1,
      fee: fee,
      amount0: amount0,
      amount1: amount1,
      lowerPrice: lowerPrice,
      upperPrice: upperPrice,
      hash: newPosition.hash,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost,
    };
    debug(`New Position: ${newPosition.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    const reason = getErrorMessage(err.message);
    res.status(500).json({
      info: reason,
      message: err,
    });
  }
});

router.post('/remove-position', async (req: Request, res: Response) => {
  /*
    POST: /remove-position
      x-www-form-urlencoded: {
        "tokenId":"12"
      }
  */
  const initTime = Date.now();
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = req.body.tokenId;
  const getFee = req.body.getFee.toUpperCase() === 'TRUE' ? true : false;

  let gasPrice;
  if (req.body.gasPrice) {
    gasPrice = parseFloat(req.body.gasPrice);
  } else {
    gasPrice = fees.ethGasPrice;
  }

  let reducePercent;
  if (req.body.reducePercent) {
    reducePercent = parseFloat(req.body.reducePercent);
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
      reducePercent,
      getFee
    );

    const result = {
      network: uniswap.network,
      timestamp: initTime,
      latency: latency(initTime, Date.now()),
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      gasCost: gasCost,
      gasFee: 0,
      hash: '',
    };

    if (getFee && gasPrice) {
      result.gasFee = parseInt(removelp.toString()) * gasPrice;
      debug(`Estimated gas to remove lp: ${result.gasFee}`);
    } else {
      result.hash = removelp.hash;
      debug(`Remove lp: ${result.hash}`);
    }

    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    const reason = getErrorMessage(err.message);
    res.status(500).json({
      error: reason,
      message: err,
    });
  }
});

router.post('/collect-fees', async (req: Request, res: Response) => {
  /*
    POST: /position
      x-www-form-urlencoded: {
      "tokenId":"tokenId"
      "amount0": amount0
      "amount1": amount1
      }
  */
  const initTime = Date.now();
  const privateKey = req.body.privateKey;
  const wallet = await getNonceManager(
    new ethers.Wallet(privateKey, uniswap.provider)
  );
  const tokenId = req.body.tokenId;

  let gasPrice;
  if (req.body.gasPrice) {
    gasPrice = parseFloat(req.body.gasPrice);
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
      gasCost: gasCost,
    };
    debug(`Fees: ${collect.hash}`);
    res.status(200).json(result);
  } catch (err) {
    logger.error(req.originalUrl, { message: err });
    const reason = getErrorMessage(err.message);
    res.status(500).json({
      info: reason,
      message: err,
    });
  }
});

export default router;
