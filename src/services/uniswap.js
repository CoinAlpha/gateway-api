const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')
const debug = require('debug')('router')

// constants
const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const GAS_LIMIT = 1200000;
const TTL = 60;

export default class Uniswap {
  constructor (network = 'mainnet') {
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.router = ROUTER;
    this.allowedSlippage = new uni.Percent('0', '100')

    switch (network) {
      case 'mainnet':
        this.chainID = uni.ChainId.MAINNET;
        break;
      case 'kovan':
        this.chainID = uni.ChainId.KOVAN;
        break;
      default:
        throw Error(`Invalid network ${network}`)
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
        console.log('Trying alternative/indirect route.')
        pairOne = await uni.Fetcher.fetchPairData(tIn, uni.WETH[this.chainID])
        pairTwo = await uni.Fetcher.fetchPairData(tOut, uni.WETH[this.chainID])
        route = new uni.Route([pairOne, pairTwo], tIn, tOut)
      }
      return route
  }

  async swapExactIn (wallet, route, tokenAddress, amountIn, gasPrice) {
    const tIn = await uni.Fetcher.fetchTokenData(this.chainID, tokenAddress)
    const tokenAmountIn = new uni.TokenAmount(tIn, amountIn)
    const result = uni.Router.swapCallParameters(
      uni.Trade.exactIn(route, tokenAmountIn),
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

    debug(`Tx Hash: ${tx.hash}`);
    const txObj = await tx.wait()
    return txObj
  }

  async swapExactOut (wallet, route, tokenAddress, amountOut, gasPrice) {
    const tOut = await uni.Fetcher.fetchTokenData(this.chainID, tokenAddress)
    const tokenAmountOut = new uni.TokenAmount(tOut, amountOut)
    const result = uni.Router.swapCallParameters(
      uni.Trade.exactOut(route, tokenAmountOut),
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

    debug(`Tx Hash: ${tx.hash}`);
    const txObj = await tx.wait()
    return txObj
  }
}
