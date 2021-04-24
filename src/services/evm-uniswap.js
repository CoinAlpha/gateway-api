import { logger } from './logger';

const debug = require('debug')('router')
const math =  require('mathjs')
const uni = require('@uniswap/v2-sdk')
const uniCore = require('@uniswap/sdk-core')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')
const routeTokens = require('../static/uniswap_route_tokens.json')
const contracts = require('@ethersproject/contracts')
const { ERC20Abi: ERC20 } = require('../static/abi')
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const JSBI = require('jsbi')
const solidity = require('@ethersproject/solidity')
const address = require('@ethersproject/address')

// constants
const ROUTER = process.env.EVM_UNISWAP_ROUTER
const GAS_LIMIT = Number(process.env.EVM_UNISWAP_GAS_LIMIT || 150688);
const TTL = process.env.EVM_UNISWAP_TTL || 300;
const UPDATE_PERIOD = process.env.EVM_UNISWAP_UPDATE_PERIOD || 300000;  // stop updating pair after 5 minutes from last request

const ZERO = /*#__PURE__*/JSBI.BigInt(0);
const ONE = /*#__PURE__*/JSBI.BigInt(1);
const FIVE = /*#__PURE__*/JSBI.BigInt(5);
const _997 = /*#__PURE__*/JSBI.BigInt(997);
const _1000 = /*#__PURE__*/JSBI.BigInt(1000);

export default class EVMUniswap {
  constructor (name = 'mainnet') {
    this.providerUrl = process.env.EVM_RPC_URL
    this.network = name || process.env.EVM_CHAIN
    this.chainID = Number(process.env.EVM_CHAIN_ID)
    const ensAddress = process.env.EVM_ENS_RESOLVER
    const network = {
      name,
      chainId: this.chainID,
      ensAddress
    }
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl, network)
    this.router = ROUTER;
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
        pair = await Fetcher.fetchPairData(this.chainID, tIn, tOut, this.provider);
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
              pairAddressRequests.push(Fetcher.fetchPairData(this.tokenList[tokens[firstToken]], this.tokenList[tokens[secondToken]], this.provider));
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

/// Re-implementation of Pair that supports arbitrary factory

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var computePairAddress = function computePairAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB;

  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1]; // does safety checks


  var salt = solidity.keccak256(['bytes'], [solidity.pack(['address', 'address'], [token0.address, token1.address])])

  return address.getCreate2Address(factoryAddress, salt, process.env.EVM_UNISWAP_INIT_CODE_HASH);
};

var Pair = /*#__PURE__*/function () {
  function Pair(factoryAddress, chainId, tokenAmountA, tokenAmountB) {
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.liquidityToken = new uniCore.Token(chainId, Pair.getAddress(factoryAddress, tokenAmounts[0].token, tokenAmounts[1].token), 18, 'UNI-V2', 'Uniswap V2');
    this.tokenAmounts = tokenAmounts;
  }

  Pair.getAddress = function getAddress(factoryAddress, tokenA, tokenB) {
    return computePairAddress({
      factoryAddress,
      tokenA,
      tokenB
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  var _proto = Pair.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.raw, _997);
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.raw, _1000), inputAmountWithFee);
    var outputAmount = new uniCore.TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new Pair(process.env.EVM_UNISWAP_FACTORY, Number(process.env.EVM_CHAIN_ID), inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO) || JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), _1000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), _997);
    var inputAmount = new uniCore.TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new Pair(process.env.EVM_UNISWAP_FACTORY, Number(process.env.EVM_CHAIN_ID), inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(uniCore.sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new uniCore.TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = JSBI.BigInt(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = uniCore.sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        var rootKLast = uniCore.sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new uniCore.TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new uniCore.TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
  };

  _createClass(Pair, [{
    key: "token0Price",
    get: function get() {
      return new uniCore.Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new uniCore.Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
    }
  }, {
    key: "chainId",
    get: function get() {
      return Number(process.env.EVM_CHAIN_ID);
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

/// Re-implementation of Fetcher that supports arbitrary routers and chains

var _TOKEN_DECIMALS_CACHE;
var TOKEN_DECIMALS_CACHE = (_TOKEN_DECIMALS_CACHE = {}, _TOKEN_DECIMALS_CACHE[process.env.EVM_CHAIN_ID ?? ''] = {
  '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD

}, _TOKEN_DECIMALS_CACHE);

var Fetcher = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Fetcher() {}
  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol optional symbol of the token
   * @param name optional name of the token
   */


  Fetcher.fetchTokenData = function fetchTokenData(chainId, address, provider, symbol, name) {
    try {
      var _TOKEN_DECIMALS_CACHE2, _TOKEN_DECIMALS_CACHE3;

      var _temp3 = function _temp3(parsedDecimals) {
        return new uniCore.Token(chainId, address, parsedDecimals, symbol, name);
      };

      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));

      var _temp4 = typeof ((_TOKEN_DECIMALS_CACHE2 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE2 === void 0 ? void 0 : (_TOKEN_DECIMALS_CACHE3 = _TOKEN_DECIMALS_CACHE2[chainId]) === null || _TOKEN_DECIMALS_CACHE3 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE3[address]) === 'number';

      return Promise.resolve(_temp4 ? _temp3(TOKEN_DECIMALS_CACHE[chainId][address]) : Promise.resolve(new contracts.Contract(address, ERC20, provider).decimals().then(function (decimals) {
        var _TOKEN_DECIMALS_CACHE4, _extends2, _extends3;

        TOKEN_DECIMALS_CACHE = _extends({}, TOKEN_DECIMALS_CACHE, (_extends3 = {}, _extends3[chainId] = _extends({}, (_TOKEN_DECIMALS_CACHE4 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE4 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE4[chainId], (_extends2 = {}, _extends2[address] = decimals, _extends2)), _extends3));
        return decimals;
      })).then(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches information about a pair and constructs a pair from the given two tokens.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchPairData = function fetchPairData(chainId, tokenA, tokenB, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));
      !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
      var address = Pair.getAddress(process.env.EVM_UNISWAP_FACTORY, tokenA, tokenB);
      console.log(address)
      return Promise.resolve(new contracts.Contract(address, IUniswapV2Pair.abi, provider).getReserves()).then(function (_ref) {
        var reserves0 = _ref[0],
            reserves1 = _ref[1];
        var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
        return new Pair(process.env.EVM_UNISWAP_FACTORY, Number(process.env.EVM_CHAIN_ID), new uniCore.TokenAmount(tokenA, balances[0]), new uniCore.TokenAmount(tokenB, balances[1]));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return Fetcher;
}();