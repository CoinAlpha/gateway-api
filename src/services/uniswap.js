import { logger } from './logger';

const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')

// constants
const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const GAS_LIMIT = 150688;
const TTL = 60;

export default class Uniswap {
  constructor (network = 'mainnet') {
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.router = ROUTER;
    this.allowedSlippage = new uni.Percent('0', '100')
    this.gasLimit = GAS_LIMIT

    switch (network) {
      case 'mainnet':
        this.chainID = uni.ChainId.MAINNET;
        break;
      case 'kovan':
        this.chainID = uni.ChainId.KOVAN;
        break;
      default:
        const err = `Invalid network ${network}`
        logger.error(err)
        throw Error(err)
    }
  }

  async fetch_route(tokenIn, tokenOut){
      var route, pair, pairOne, pairTwo
      var tIn = await uni.Fetcher.fetchTokenData(this.chainID, tokenIn)
      var tOut = await uni.Fetcher.fetchTokenData(this.chainID, tokenOut)

      try {
        pair = await uni.Fetcher.fetchPairData(tIn, tOut)
        route = new uni.Route([pair], tIn, tOut)
      }
      catch(err) {
        logger.error(err)
        logger.info('Trying alternative/indirect route.')
        pairOne = await uni.Fetcher.fetchPairData(tIn, uni.WETH[this.chainID])
        pairTwo = await uni.Fetcher.fetchPairData(tOut, uni.WETH[this.chainID])
        route = new uni.Route([pairOne, pairTwo], tIn, tOut)
      }
      return route
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount) {
    const tIn = await uni.Fetcher.fetchTokenData(this.chainID, tokenIn)
    const tokenAmountIn = new uni.TokenAmount(tIn, ethers.utils.parseUnits(tokenInAmount, tIn.decimals))
    const route = await this.fetch_route(tokenIn, tokenOut)
    const trade = uni.Trade.exactIn(route, tokenAmountIn)
    const expectedOut = trade.minimumAmountOut(this.allowedSlippage)
    return { trade, expectedOut }
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount) {
    const tOut = await uni.Fetcher.fetchTokenData(this.chainID, tokenOut)
    const tokenAmountOut = new uni.TokenAmount(tOut, ethers.utils.parseUnits(tokenOutAmount, tOut.decimals))
    const route = await this.fetch_route(tokenIn, tokenOut)
    const trade = uni.Trade.exactOut(route, tokenAmountOut)
    const expectedIn = trade.maximumAmountIn(this.allowedSlippage)
    return { trade, expectedIn }
  }

  async swapExactIn (wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(
      trade,
      {
        ttl: TTL,
        recipient: wallet.address,
        allowedSlippage: this.allowedSlippage
      }
    )

    const contract = new ethers.Contract(this.router, proxyArtifact.abi, wallet)
    const tx = await contract.[result.methodName](
      ...result.args,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT,
        value: result.value
      }
    )

    logger.debug(`Tx Hash: ${tx.hash}`);
    return tx
  }

  async swapExactOut (wallet, trade, tokenAddress, gasPrice) {
    const result = uni.Router.swapCallParameters(
      trade,
      {
        ttl: TTL,
        recipient: wallet.address,
        allowedSlippage: this.allowedSlippage
      }
    )

    const contract = new ethers.Contract(this.router, proxyArtifact.abi, wallet)
    const tx = await contract.[result.methodName](
      ...result.args,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT,
        value: result.value
      }
    )

    logger.debug(`Tx Hash: ${tx.hash}`);
    return tx
  }
}
