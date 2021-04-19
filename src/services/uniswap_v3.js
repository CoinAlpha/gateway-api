import { logger } from './logger';

const debug = require('debug')('router')
const math =  require('mathjs')
const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const routerArtifact = require('../static/uniswap_v3_router_abi.json')
// const routeTokens = require('../static/uniswap_route_tokens.json')

// constants
const FeeAmount = { LOW: 500, MEDIUM: 3000, HIGH: 10000 };
const ROUTER = process.env.UNISWAP_V3_ROUTER
const GAS_LIMIT = process.env.UNISWAP_GAS_LIMIT || 150688;
const TTL = process.env.UNISWAP_TTL || 300;
const UPDATE_PERIOD = process.env.UNISWAP_UPDATE_PERIOD || 300000;  // stop updating pair after 5 minutes from last request

export default class UniswapV3 {
  constructor (network = 'mainnet') {
    this.providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl)
    this.router = ROUTER;
    this.slippage = math.fraction(process.env.UNISWAP_ALLOWED_SLIPPAGE)
    this.allowedSlippage = new uni.Percent(this.slippage.n, (this.slippage.d * 100))
    this.pairsCacheTime = process.env.UNISWAP_PAIRS_CACHE_TIME
    this.gasLimit = GAS_LIMIT
    this.expireTokenPairUpdate = UPDATE_PERIOD
    this.zeroReserveCheckInterval = process.env.UNISWAP_NO_RESERVE_CHECK_INTERVAL
    this.zeroReservePairs = {} // No reserve pairs
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

  async extend_update_pairs(tokens=[]){
      for (let token of tokens){
        if (!this.tokenList.hasOwnProperty(token)){
          this.tokenList[token] = await uni.Fetcher.fetchTokenData(this.chainID, token);
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
              pairAddressRequests.push(uni.Fetcher.fetchPairData(this.tokenList[tokens[firstToken]], this.tokenList[tokens[secondToken]]));
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
    const tokenAmountIn = new uni.TokenAmount(tIn, ethers.utils.parseUnits(tokenInAmount, tIn.decimals));
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
    const tokenAmountOut = new uni.TokenAmount(tOut, ethers.utils.parseUnits(tokenOutAmount, tOut.decimals));
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

    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet)
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

    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet)
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

  // LP section

  async getPosition (wallet, tokenId) {
    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet);
    return await contract.positions(tokenId);
  }

  async addPosition (wallet, token0, token1, amount0, amount1, fee, tick0, tick1) {
    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet);
    const priceSqrt = require('./uniswap-v3/encodePriceSqrt');
    const initPool = await contract.createAndInitializePoolIfNecessary(
        token0.address,
        token1.address,
        FeeAmount.MEDIUM,
        encodePriceSqrt(1, 1)
      );
    console.log(initPool);
    const mintTx = await contract.mint({
          token0: token0.address,
          token1: token1.address,
          tickLower: tick0,
          tickUpper: tick1,
          amount0Desired: amount0,
          amount1Desired: amount1,
          amount0Min: 0,
          amount1Min: 0,
          recipient: wallet.address,
          deadline: TTL,
          fee: fee
        });
    return mintTx;
  }

  async removePosition (wallet, tokenId) {
  // Reduce position and burn
  let positionData = this.getPosition(wallet, tokenId);
  let amount0, amount1;
  // calulate amount of token0 and token1 from position liquidity

  let decreaseTx = await contract.decreaseLiquidity(tokenId, amount0, amount1, amount0, amount1, TTL);
  // To-Do: check success of decrease before burn
  positionData = this.getPosition(wallet, tokenId);
  return await contract.collect(tokenId, wallet.address, positionData.tokensOwed0, positionData.tokensOwed1);
  }

  async adjustLiquidity (wallet, action, tokenId, amount0, amount1) {
    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet);
    if (action === "INCREASE") {
      return await contract.increaseLiquidity(tokenId, amount0, amount1, amount0Min, amount1Min, TTL);
    } else {
      return await contract.decreaseLiquidity(tokenId, amount0, amount1, amount0Min, amount1Min, TTL);
    }
  }

  async collectFees (wallet, tokenId, amount0, amount1) {
    const contract = new ethers.Contract(this.router, routerArtifact.abi, wallet);
    return await contract.collect(tokenId, wallet.address, amount0, amount1);
}
