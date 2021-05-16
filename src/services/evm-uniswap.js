import { logger } from './logger';

const debug = require('debug')('router')
const math =  require('mathjs')
const uni = require('@uniswap/v2-sdk')
const uniCore = require('@uniswap/sdk-core')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')
const routeTokens = require('../static/uniswap_route_tokens.json')
const { Fetcher } = require('./evm-uni-v2-fetcher')
const JSBI = require('jsbi')

// constants
const GAS_LIMIT = Number(process.env.EVM_UNISWAP_GAS_LIMIT || 150688);
const TTL = process.env.EVM_UNISWAP_TTL || 300;
const UPDATE_PERIOD = process.env.EVM_UNISWAP_UPDATE_PERIOD || 300000;  // stop updating pair after 5 minutes from last request

const ZERO = /*#__PURE__*/JSBI.BigInt(0);
const ONE = /*#__PURE__*/JSBI.BigInt(1);
const FIVE = /*#__PURE__*/JSBI.BigInt(5);
const _997 = /*#__PURE__*/JSBI.BigInt(997);
const _1000 = /*#__PURE__*/JSBI.BigInt(1000);

export default class EVMUniswap {
  constructor (name = 'mainnet', id, provider) {
    this.providerUrl = process.env.EVM_RPC_URL
    this.network = name || process.env.EVM_CHAIN
    this.chainID = Number(process.env.EVM_CHAIN_ID)
    const ensAddress = process.env.EVM_ENS_RESOLVER
    const network = {
      name,
      chainId: this.chainID,
      ensAddress
    }
    this.provider = provider || new ethers.providers.JsonRpcProvider(this.providerUrl, network)
    this.router = process.env[`EVM_UNISWAP_${id}_ROUTER`]
    this.factoryAddress = process.env[`EVM_UNISWAP_${id}_FACTORY`]
    this.initCodeHash = process.env[`EVM_UNISWAP_${id}_INIT_CODE_HASH`]
    this.slippage = math.fraction(process.env.EVM_UNISWAP_ALLOWED_SLIPPAGE)
    this.allowedSlippage = new uniCore.Percent(this.slippage.n, (this.slippage.d * 100))
    this.pairsCacheTime = process.env.EVM_UNISWAP_PAIRS_CACHE_TIME
    this.gasLimit = GAS_LIMIT
    this.expireTokenPairUpdate = UPDATE_PERIOD
    this.zeroReserveCheckInterval = process.env.EVM_UNISWAP_NO_RESERVE_CHECK_INTERVAL
    this.zeroReservePairs = {} // No reserve pairs
    this.tokenList = {}
    this.pairs = []
    this.tokenSwapList = {}
    this.cachedRoutes = {}
  }

  async fetch_route(tIn, tOut){
      var route, pair, pairOne, pairTwo

      try {
        pair = await Fetcher.fetchPairData(this.chainID, tIn, tOut, this.provider, this.factoryAddress, this.initCodeHash);
        route = new uni.Route([pair], tIn, tOut);
      }
      catch(err) {
        logger.error(err);
      }
      return route;
  }


  generate_tokens() {
    if (!routeTokens[this.network]) {
      return logger.error(`No route tokens defined for ${this.network} in uniswap_route_tokens.json`);
    }
    for (let token of routeTokens[this.network]) {
      this.tokenList[token["address"]] = new uniCore.Token(this.chainID, token["address"], token["decimals"], token["symbol"], token["name"]);
    }
  }

  async extend_update_pairs(tokens=[]){
      for (let token of tokens){
        if (!this.tokenList.hasOwnProperty(token)){
          this.tokenList[token] = await Fetcher.fetchTokenData(this.chainID, token, this.provider);
        }
        this.tokenSwapList[token] = Date.now() + this.expireTokenPairUpdate;
      }
  }

  async update_pairs(){
    // Remove banned pairs after ban period
    if (Object.keys(this.zeroReservePairs).length > 0){
      for (let pair in this.zeroReservePairs){
        if (this.zeroReservePairs[pair] <= Date.now()) {
          delete this.zeroReservePairs[pair];
          // delete this.tokenList[token];
        }
      }
    }
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
      var firstToken, secondToken, position;
      let length = tokens.length;
      let pairs = [];
      let pairAddressRequests = [];
      let pairAddressResponses = [];
      for (firstToken = 0; firstToken < length; firstToken++){
        for (secondToken = firstToken + 1; secondToken < length; secondToken++){
          try{
            let pairString = this.tokenList[tokens[firstToken]].address + '-' + this.tokenList[tokens[secondToken]].address;
            if (!this.zeroReservePairs.hasOwnProperty(pairString)){
              pairs.push(pairString);
              pairAddressRequests.push(Fetcher.fetchPairData(this.tokenList[tokens[firstToken]], this.tokenList[tokens[secondToken]], this.provider, this.factoryAddress, this.initCodeHash));
            }
          }
          catch(err) {
            logger.error(err);
          }
        }
      }

      await Promise.allSettled(pairAddressRequests).then(values => { for (position = 0; position < pairAddressRequests.length; position++) {
                                                                      if (values[position].status === "fulfilled"){pairAddressResponses.push(values[position].value)}
                                                                      else {this.zeroReservePairs[pairs[position]] = Date.now() + this.zeroReserveCheckInterval;}}})
      this.pairs = pairAddressResponses;
    }
    setTimeout(this.update_pairs.bind(this), 1000);
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount) {
    await this.extend_update_pairs([tokenIn, tokenOut]);
    const tIn = this.tokenList[tokenIn];
    const tOut = this.tokenList[tokenOut];
    const tokenAmountIn = new uniCore.TokenAmount(tIn, ethers.utils.parseUnits(tokenInAmount, tIn.decimals));
    if (this.pairs.length === 0){
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactIn(route, tokenAmountIn);
      if ( trade !== undefined ){
        const expectedAmount = trade.minimumAmountOut(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedAmount }
      }
      return "Can't find route to swap, kindly update "
    }
    const trade = uni.Trade.bestTradeExactIn(this.pairs, tokenAmountIn, this.tokenList[tokenOut], { maxHops: 5 })[0];
    if (trade === undefined){trade = this.cachedRoutes[tIn.symbol + tOut.Symbol];}
    else{this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;}
    const expectedAmount = trade.minimumAmountOut(this.allowedSlippage);
    return { trade, expectedAmount }
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount) {
    await this.extend_update_pairs([tokenIn, tokenOut]);
    const tOut = this.tokenList[tokenOut];
    const tIn = this.tokenList[tokenIn];
    const tokenAmountOut = new uniCore.TokenAmount(tOut, ethers.utils.parseUnits(tokenOutAmount, tOut.decimals));
    if (this.pairs.length === 0){
      const route = await this.fetch_route(tIn, tOut);
      const trade = uni.Trade.exactOut(route, tokenAmountOut);
      if ( trade !== undefined ){
        const expectedAmount = trade.maximumAmountIn(this.allowedSlippage);
        this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;
        return { trade, expectedAmount }
      }
      return
    }
    const trade = uni.Trade.bestTradeExactOut(this.pairs, this.tokenList[tokenIn], tokenAmountOut, { maxHops: 5 })[0];
    if (trade === undefined){trade = this.cachedRoutes[tIn.symbol + tOut.Symbol];}
    else{this.cachedRoutes[tIn.symbol + tOut.Symbol] = trade;}
    const expectedAmount = trade.maximumAmountIn(this.allowedSlippage);
    return { trade, expectedAmount }
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

    debug(`Tx Hash: ${tx.hash}`);
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

    debug(`Tx Hash: ${tx.hash}`);
    return tx
  }
}