import { logger } from './logger';

const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')
const routeTokens = require('../static/uniswap_route_tokens.json')

// constants
const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const GAS_LIMIT = 150688;
const TTL = 60;
const UPDATE_PERIOD = 300000;  // stop updating pair after 5 minutes from last request

export default class Uniswap {
  constructor (network = 'mainnet') {
    this.providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl)
    this.router = ROUTER;
    this.allowedSlippage = new uni.Percent('0', '100')
    this.gasLimit = GAS_LIMIT
    this.expireTokenPairUpdate = UPDATE_PERIOD
    this.tokenList = {}
    this.pairs = []
    this.tokenSwapList = {}
    this.cachedRoutes = {}

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

  async fetch_route(tIn, tOut){
      var route, pair, pairOne, pairTwo

      try {
        pair = await uni.Fetcher.fetchPairData(tIn, tOut);
        route = new uni.Route([pair], tIn, tOut);
      }
      catch(err) {
        logger.error(err);
      }
      return route;
  }


  generate_tokens(){
    for (let token of routeTokens[this.network]){
      this.tokenList[token["address"]] = new uni.Token(this.chainID, token["address"], token["decimals"], token["symbol"], token["name"]);
    }
  }

  async update_tokens(tokens=[]){
      for (let token of tokens){
        if (!this.tokenList.hasOwnProperty(token)){
          this.tokenList[token] = await uni.Fetcher.fetchTokenData(this.chainID, token);
        }
        this.tokenSwapList[token] = Date.now() + this.expireTokenPairUpdate;
      }
  }

  async update_pairs(){
    // Generate all possible pair combinations of tokens
    // This is done by generating an upper triangular matrix or right triangular matrix
    if (Object.keys(this.tokenSwapList).length > 0){
      for (let token in this.tokenSwapList){
        if (this.tokenSwapList[token] <= Date.now()) {
          delete this.tokenSwapList[token];
          // delete this.tokenList[token];
        }
      }

      let tokens = Object.keys(this.tokenList);
      var firstToken, secondToken;
      let length = tokens.length;
      let pairAddressRequests = [];
      for (firstToken = 0; firstToken < length; firstToken++){
        for (secondToken = firstToken + 1; secondToken < length; secondToken++){
          try{
            pairAddressRequests.push(await uni.Fetcher.fetchPairData(this.tokenList[tokens[firstToken]], this.tokenList[tokens[secondToken]]));
          }
          catch(err) {
            logger.error(err);
          }
        }
      }
      this.pairs = pairAddressRequests;
    }
    setTimeout(this.update_pairs.bind(this), 2000); // update every 2 seconds
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount) {
    await this.update_tokens([tokenIn, tokenOut]);
    const tIn = this.tokenList[tokenIn];
    const tOut = this.tokenList[tokenOut];
    const tokenAmountIn = new uni.TokenAmount(tIn, ethers.utils.parseUnits(tokenInAmount, tIn.decimals));
    if (this.pairs.length === 0){
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactIn(route, tokenAmountIn);
      if ( trade !== undefined ){
        const expectedOut = trade.minimumAmountOut(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedOut }
      }
      return "Can't find route to swap, kindly update "
    }
    const trade = uni.Trade.bestTradeExactIn(this.pairs, tokenAmountIn, this.tokenList[tokenOut], { maxHops: 5 })[0];
    if (trade === undefined){trade = this.cachedRoutes[tIn.symbol + tOut.Symbol];}
    else{this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;}
    const expectedOut = trade.minimumAmountOut(this.allowedSlippage);
    return { trade, expectedOut }
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount) {
    await this.update_tokens([tokenIn, tokenOut]);
    const tOut = this.tokenList[tokenOut];
    const tIn = this.tokenList[tokenIn];
    const tokenAmountOut = new uni.TokenAmount(tOut, ethers.utils.parseUnits(tokenOutAmount, tOut.decimals));
    if (this.pairs.length === 0){
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactOut(route, tokenAmountOut);
      if ( trade !== undefined ){
        const expectedIn = trade.maximumAmountIn(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedIn }
      }
      return
    }
    const trade = uni.Trade.bestTradeExactOut(this.pairs, this.tokenList[tokenIn], tokenAmountOut, { maxHops: 5 })[0];
    if (trade === undefined){trade = this.cachedRoutes[tIn.symbol + tOut.Symbol];}
    else{this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;}
    const expectedIn = trade.maximumAmountIn(this.allowedSlippage);
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
