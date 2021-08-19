import { unit } from 'mathjs';
import { debug } from 'winston';
import { logger } from './logger';

const math = require('mathjs');
const uni = require('@uniswap/sdk');
const ethers = require('ethers');
const proxyArtifact = require('../static/uniswap_v2_router_abi.json');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants
const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const GAS_LIMIT = 200688;
const TTL = 300;

export default class Uniswap {
  constructor() {
    this.providerUrl = globalConfig.getConfig('ETHEREUM_RPC_URL');
    this.network = globalConfig.getConfig('ETHEREUM_CHAIN');
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl);
    this.router = ROUTER;
    this.slippage = math.fraction(
      globalConfig.getConfig('UNISWAP_ALLOWED_SLIPPAGE')
    );
    this.allowedSlippage = new uni.Percent(
      this.slippage.n,
      this.slippage.d * 100
    );
    this.gasLimit = GAS_LIMIT;
  }

  getUniswapToken = (token) =>
    new uni.Token(token.chainId, token.address, token.decimals);

  async priceSwapIn(tIn, tOut, tokenInAmount) {
    const tokenIn = this.getUniswapToken(tIn);
    const tokenOut = this.getUniswapToken(tOut);
    const amountIn = new uni.TokenAmount(
      tokenIn,
      ethers.utils.parseUnits(tokenInAmount, tokenIn.decimals)
    );
    const pair = await uni.Fetcher.fetchPairData(tokenIn, tokenOut);
    const route = new uni.Route([pair], tokenIn);
    const trade = new uni.Trade(route, amountIn, uni.TradeType.EXACT_INPUT);
    logger.info(`Trade: ${trade}`);
    const expectedAmount = trade.minimumAmountOut(this.allowedSlippage);
    return { trade, expectedAmount };
  }

  async priceSwapOut(tIn, tOut, tokenOutAmount) {
    const tokenIn = this.getUniswapToken(tIn);
    const tokenOut = this.getUniswapToken(tOut);
    const amountOut = new uni.TokenAmount(
      tokenOut,
      ethers.utils.parseUnits(tokenOutAmount, tokenOut.decimals)
    );
    const pair = await uni.Fetcher.fetchPairData(tokenIn, tokenOut);
    const route = new uni.Route([pair], tokenIn);
    const trade = new uni.Trade(route, amountOut, uni.TradeType.EXACT_OUTPUT);
    logger.info(`Trade: ${trade}`);
    const expectedAmount = trade.maximumAmountIn(this.allowedSlippage);
    return { trade, expectedAmount };
  }

  async swapExactIn(wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(trade, {
      ttl: TTL,
      recipient: wallet.address,
      allowedSlippage: this.allowedSlippage,
    });

    const contract = new ethers.Contract(
      this.router,
      proxyArtifact.abi,
      wallet
    );
    const tx = await contract[result.methodName](...result.args, {
      gasPrice: gasPrice * 1e9,
      gasLimit: GAS_LIMIT,
      value: result.value,
    });

    logger.info(`Tx Hash: ${tx.hash}`);
    return tx;
  }

  async swapExactOut(wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(trade, {
      ttl: TTL,
      recipient: wallet.address,
      allowedSlippage: this.allowedSlippage,
    });

    const contract = new ethers.Contract(
      this.router,
      proxyArtifact.abi,
      wallet
    );
    const tx = await contract[result.methodName](...result.args, {
      gasPrice: gasPrice * 1e9,
      gasLimit: GAS_LIMIT,
      value: result.value,
    });

    logger.info(`Tx Hash: ${tx.hash}`);
    return tx;
  }
}
