import { logger } from './logger';

const debug = require('debug')('router');
const math = require('mathjs');
const uni = require('@uniswap/sdk');
const ethers = require('ethers');
const proxyArtifact = require('../static/uniswap_v2_router_abi.json');
const routeTokens = require('../static/uniswap_route_tokens.json');

// constants
const ROUTER = process.env.UNISWAP_ROUTER;
const GAS_LIMIT = process.env.UNISWAP_GAS_LIMIT || 150688;
const TTL = process.env.UNISWAP_TTL || 300;
const UPDATE_PERIOD = process.env.UNISWAP_UPDATE_PERIOD || 300000; // stop updating pair after 5 minutes from last request

export default class Uniswap {
  constructor(network = 'mainnet') {
    this.providerUrl = process.env.ETHEREUM_RPC_URL;
    this.network = process.env.ETHEREUM_CHAIN;
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl);
    this.router = ROUTER;
    this.slippage = math.fraction(process.env.UNISWAP_ALLOWED_SLIPPAGE);
    this.allowedSlippage = new uni.Percent(this.slippage.n, (this.slippage.d * 100));
    this.pairsCacheTime = process.env.UNISWAP_PAIRS_CACHE_TIME;
    this.gasLimit = GAS_LIMIT;
    this.expireTokenPairUpdate = UPDATE_PERIOD;
    this.zeroReserveCheckInterval = process.env.UNISWAP_NO_RESERVE_CHECK_INTERVAL;
    this.zeroReservePairs = {}; // No reserve pairs
    this.tokenList = {};
    this.pairs = [];
    this.tokenSwapList = {};
    this.cachedRoutes = {};

    switch (network) {
      case 'mainnet':
        this.chainID = uni.ChainId.MAINNET;
        break;
      case 'kovan':
        this.chainID = uni.ChainId.KOVAN;
        break;
      default:
        const err = `Invalid network ${network}`;
        logger.error(err);
        throw Error(err);
    }
  }

  async fetch_route(tIn, tOut) {
    let route;
    let pair;

    try {
      pair = await uni.Fetcher.fetchPairData(tIn, tOut);
      route = new uni.Route([pair], tIn, tOut);
    } catch (err) {
      logger.error(err);
    }
    return route;
  }

  generate_tokens() {
    for (const token of routeTokens[this.network]) {
      this.tokenList[token.address] = new uni.Token(this.chainID, token.address, token.decimals, token.symbol, token.name);
    }
  }

  async extend_update_pairs(tokens = []) {
    for (const token of tokens) {
      if (!this.tokenList.hasOwnProperty(token)) {
        this.tokenList[token] = await uni.Fetcher.fetchTokenData(this.chainID, token);
      }
      this.tokenSwapList[token] = Date.now() + this.expireTokenPairUpdate;
    }
  }

  async update_pairs() {
    // Remove banned pairs after ban period
    if (Object.keys(this.zeroReservePairs).length > 0) {
      for (const pair in this.zeroReservePairs) {
        if (this.zeroReservePairs[pair] <= Date.now()) {
          delete this.zeroReservePairs[pair];
          // delete this.tokenList[token];
        }
      }
    }
    // Generate all possible pair combinations of tokens
    // This is done by generating an upper triangular matrix or right triangular matrix
    if (Object.keys(this.tokenSwapList).length > 0) {
      for (const token in this.tokenSwapList) {
        if (this.tokenSwapList[token] <= Date.now()) {
          delete this.tokenSwapList[token];
          // delete this.tokenList[token];
        }
      }

      const tokens = Object.keys(this.tokenList);
      let firstToken; let secondToken; let
        position;
      const length = tokens.length;
      const pairs = [];
      const pairAddressRequests = [];
      const pairAddressResponses = [];
      for (firstToken = 0; firstToken < length; firstToken++) {
        for (secondToken = firstToken + 1; secondToken < length; secondToken++) {
          try {
            const pairString = `${this.tokenList[tokens[firstToken]].address}-${this.tokenList[tokens[secondToken]].address}`;
            if (!this.zeroReservePairs.hasOwnProperty(pairString)) {
              pairs.push(pairString);
              pairAddressRequests.push(uni.Fetcher.fetchPairData(this.tokenList[tokens[firstToken]], this.tokenList[tokens[secondToken]]));
            }
          } catch (err) {
            logger.error(err);
          }
        }
      }

      await Promise.allSettled(pairAddressRequests).then((values) => {
        for (position = 0; position < pairAddressRequests.length; position++) {
          if (values[position].status === 'fulfilled') { pairAddressResponses.push(values[position].value); } else { this.zeroReservePairs[pairs[position]] = Date.now() + this.zeroReserveCheckInterval; }
        }
      });
      this.pairs = pairAddressResponses;
    }
    setTimeout(this.update_pairs.bind(this), 1000);
  }

  async priceSwapIn(tokenIn, tokenOut, tokenInAmount) {
    await this.extend_update_pairs([tokenIn, tokenOut]);
    const tIn = this.tokenList[tokenIn];
    const tOut = this.tokenList[tokenOut];
    const tokenAmountIn = new uni.TokenAmount(tIn, ethers.utils.parseUnits(tokenInAmount, tIn.decimals));
    if (this.pairs.length === 0) {
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactIn(route, tokenAmountIn);
      if (trade !== undefined) {
        const expectedAmount = trade.minimumAmountOut(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedAmount };
      }
      return "Can't find route to swap, kindly update ";
    }
    let trade = uni.Trade.bestTradeExactIn(this.pairs, tokenAmountIn, this.tokenList[tokenOut], { maxHops: 5 })[0];
    if (trade === undefined) { trade = this.cachedRoutes[tIn.symbol + tOut.Symbol]; } else { this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade; }
    const expectedAmount = trade.minimumAmountOut(this.allowedSlippage);
    return { trade, expectedAmount };
  }

  async priceSwapOut(tokenIn, tokenOut, tokenOutAmount) {
    await this.extend_update_pairs([tokenIn, tokenOut]);
    const tOut = this.tokenList[tokenOut];
    const tIn = this.tokenList[tokenIn];
    const tokenAmountOut = new uni.TokenAmount(tOut, ethers.utils.parseUnits(tokenOutAmount, tOut.decimals));
    if (this.pairs.length === 0) {
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactOut(route, tokenAmountOut);
      if (trade !== undefined) {
        const expectedAmount = trade.maximumAmountIn(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedAmount };
      }
      return;
    }
    let trade = uni.Trade.bestTradeExactOut(this.pairs, this.tokenList[tokenIn], tokenAmountOut, { maxHops: 5 })[0];
    if (trade === undefined) { trade = this.cachedRoutes[tIn.symbol + tOut.Symbol]; } else { this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade; }
    const expectedAmount = trade.maximumAmountIn(this.allowedSlippage);
    return { trade, expectedAmount };
  }

  async swapExactIn(wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(
      trade,
      {
        ttl: TTL,
        recipient: wallet.address,
        allowedSlippage: this.allowedSlippage,
      },
    );

    const contract = new ethers.Contract(this.router, proxyArtifact.abi, wallet);
    const tx = await contract[result.methodName](
      ...result.args,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT,
        value: result.value,
      },
    );

    debug(`Tx Hash: ${tx.hash}`);
    return tx;
  }

  async swapExactOut(wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(
      trade,
      {
        ttl: TTL,
        recipient: wallet.address,
        allowedSlippage: this.allowedSlippage,
      },
    );

    const contract = new ethers.Contract(this.router, proxyArtifact.abi, wallet);
    const tx = await contract[result.methodName](
      ...result.args,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT,
        value: result.value,
      },
    );

    debug(`Tx Hash: ${tx.hash}`);
    return tx;
  }
}
