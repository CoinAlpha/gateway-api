import { logger } from './logger';
import { encodePriceSqrt, getLiquidity, getTickAtSqrtRatio } from '../static/uniswap-v3/helper_functions';

const debug = require('debug')('router')
const math =  require('mathjs')
const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const coreArtifact = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const nftArtifact = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json')
const routerArtifact = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')
const poolArtifact = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
//const routeTokens = require('../static/uniswap_route_tokens.json')
const abiDecoder = require('abi-decoder');


// constants
const FeeAmount = { LOW: 500, MEDIUM: 3000, HIGH: 10000 };
const ROUTER = process.env.UNISWAP_V3_ROUTER
const GAS_LIMIT = process.env.UNISWAP_GAS_LIMIT || 5506880;
const TTL = process.env.UNISWAP_TTL || 300;
const UPDATE_PERIOD = process.env.UNISWAP_UPDATE_PERIOD || 300000;  // stop updating pair after 5 minutes from last request
const MaxUint128 = ethers.BigNumber.from(2).pow(128).sub(1)

abiDecoder.addABI(nftArtifact.abi);
abiDecoder.addABI(routerArtifact.abi);

export default class UniswapV3 {
  constructor (network = 'mainnet') {
    this.providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl)
    this.router = process.env.UNISWAP_V3_ROUTER;
    this.nftManager = process.env.UNISWAP_V3_NFT_MANAGER;
    this.core = process.env.UNISWAP_V3_CORE;
    this.slippage = process.env.UNISWAP_ALLOWED_SLIPPAGE
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

  get_contract( contract, wallet ){
    if (contract === "core") { return new ethers.Contract(this.core, coreArtifact.abi, wallet) }
    else if ( contract === "router" ) { return new ethers.Contract(this.router, routerArtifact.abi, wallet) }
    else { return new ethers.Contract(this.nftManager, nftArtifact.abi, wallet) }
  }

  async currentPrice (wallet, tokenIn, tokenOut) {
    let pool, poolContract;
    let poolPrices = [];
    let poolLiquidity = [];
    const keys = ["LOW", "MEDIUM", "HIGH"];
    const coreContract = this.get_contract("core", wallet);

    const poolAddressRequests = [coreContract.getPool(tokenIn, tokenOut, FeeAmount.LOW),
                                 coreContract.getPool(tokenIn, tokenOut, FeeAmount.MEDIUM),
                                 coreContract.getPool(tokenIn, tokenOut, FeeAmount.HIGH)];
     await Promise.allSettled(poolAddressRequests).then(values => {
       for (pool=0; pool<3; pool++){
         if (values[pool].value === ethers.constants.AddressZero) { poolPrices[pool] = 0 }
         else {
           poolContract = new ethers.Contract(values[pool].value, poolArtifact.abi, wallet)
           poolPrices[pool] = poolContract.observe([13]);
         }
       }
     })
     await Promise.allSettled(poolPrices).then(values => {
       for (pool=0; pool<3; pool++){
         poolPrices[pool] = poolLiquidity[pool] = 0;
         if (values[pool].value) {
         for (let tick of values[pool].value.tickCumulatives) {
           poolPrices[pool] = tick.toNumber() - poolPrices[pool];
         }
         poolPrices[pool] /= 13;
         poolPrices[pool] = math.pow(1.0001, poolPrices[pool])
       }
       }
     })
     return Object.assign(...keys.map((k, i) => ({[k]: poolPrices[i]})))
  }


  async swapExactIn (wallet, baseTokenContractInfo, quoteTokenContractInfo, baseAmount, limitPrice, tier, gasPrice) {
    //sell, In => base, Out => quote
    const minPercentOut = (1 - (this.slippage / 100))
    const amountOutMinimum =  math.floor(baseAmount * limitPrice * minPercentOut, quoteTokenContractInfo.decimals)
    //const priceFraction =  math.fraction(limitPrice)
    const contract = this.get_contract("router", wallet);
    const tx = await contract.exactInputSingle({
        tokenIn: baseTokenContractInfo.address,
        tokenOut: quoteTokenContractInfo.address,
        fee: FeeAmount[tier],
        recipient: wallet.address,
        deadline: Date.now() + TTL,
        amountIn: ethers.utils.parseUnits(baseAmount, baseTokenContractInfo.decimals),
        amountOutMinimum: ethers.utils.parseUnits(amountOutMinimum.toString(), quoteTokenContractInfo.decimals),
        //sqrtPriceLimitX96: encodePriceSqrt(priceFraction.d, priceFraction.n)
        sqrtPriceLimitX96: 0
    },
      {
        //gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT
      }
    )

    debug(`Tx Hash: ${tx.hash}`);
    tx.expectedAmount = amountOutMinimum
    return tx
  }

  async swapExactOut (wallet, baseTokenContractInfo, quoteTokenContractInfo, baseAmount, limitPrice, tier, gasPrice) {
    //buy, In => quote, Out => base
    const maxPercentIn = (1 + (this.slippage / 100))
    const amountInMaximum =  math.ceil(baseAmount * limitPrice * maxPercentIn, quoteTokenContractInfo.decimals)
    //const priceFraction = math.fraction(limitPrice)
    const contract = this.get_contract("router", wallet);
    const tx = await contract.exactOutputSingle({
        tokenIn: quoteTokenContractInfo.address,
        tokenOut: baseTokenContractInfo.address,
        fee: FeeAmount[tier],
        recipient: wallet.address,
        deadline: Date.now() + TTL,
        amountOut: ethers.utils.parseUnits(baseAmount, baseTokenContractInfo.decimals),
        amountInMaximum: ethers.utils.parseUnits(amountInMaximum.toString(), quoteTokenContractInfo.decimals),
        //sqrtPriceLimitX96: encodePriceSqrt(priceFraction.d, priceFraction.n)
        sqrtPriceLimitX96: 0
    },
      {
        //gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT
      }
    )

    debug(`Tx Hash: ${tx.hash}`);
    tx.expectedAmount = amountInMaximum
    return tx
  }

  // LP section

  async getPosition (wallet, tokenId) {
    const contract = this.get_contract("nft", wallet);
    const position = await contract.positions(tokenId);
    return {
      nonce: position[0].toString(),
      operator: position[1],
      token0: position[2],
      token1: position[3],
      fee: position[4],
      tickLower: position[5],
      tickUpper: position[6],
      liquidity: position[7].toString(),
      feeGrowthInside0LastX128: position[8].toString(),
      feeGrowthInside1LastX128: position[9].toString(),
      tokensOwed0: position[10].toString(),
      tokensOwed1: position[11].toString()
    }

    return position
  }

  //getMinTick (tickSpacing){ return Math.ceil(-887272 / tickSpacing) * tickSpacing}

  //getMaxTick (tickSpacing){ return Math.floor(887272 / tickSpacing) * tickSpacing}

  async addPosition (wallet, token0, token1, amount0, amount1, fee, lowerPrice, upperPrice) {
    const nftContract = this.get_contract("nft", wallet);
    const coreContract = this.get_contract("core", wallet);
    //const pool = await coreContract.getPool(token0.address, token1.address, FeeAmount[fee]);
    const midPrice = math.fraction((lowerPrice + upperPrice) / 2) // Use mid price to initialize uninitialized pool

    /* TO-DO: Accept price for upper and lower tick from client then convert to ticks
    try{
    const lowerPriceFraction = math.fraction(lowerPrice)
    const upperPriceFraction = math.fraction(upperPrice)
    console.log(lowerPriceFraction)
    console.log(upperPriceFraction)
    console.log(getTickAtSqrtRatio(encodePriceSqrt(lowerPriceFraction.n, lowerPriceFraction.d)))
    console.log(getTickAtSqrtRatio(encodePriceSqrt(upperPriceFraction.n, upperPriceFraction.d)))
  }catch(err){console.log(err)}
  */

    const initPoolData = nftContract.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [
          token0.address,
          token1.address,
          FeeAmount[fee],
          encodePriceSqrt(midPrice.n, midPrice.d)]);
    const mintData = nftContract.interface.encodeFunctionData('mint', [{
          token0: token0.address,
          token1: token1.address,
          tickLower: lowerPrice,
          tickUpper: upperPrice,
          amount0Desired: ethers.utils.parseUnits(amount0, token0.decimals),
          amount1Desired: ethers.utils.parseUnits(amount1, token1.decimals),
          // slippage isn't applied for now
          amount0Min: 0,
          amount1Min: 0,
          recipient: wallet.address,
          deadline: Date.now() + TTL,
          fee: FeeAmount[fee]
        }]);

    let calls = [mintData]

    if (pool === ethers.constants.AddressZero) { const calls = [initPoolData, mintData] }

    const tx = await nftContract.multicall(calls, { gasLimit: GAS_LIMIT });

    return tx;
  }

  async removePosition (wallet, tokenId) {
  // Reduce position and burn
  let positionData = await this.getPosition(wallet, tokenId);
  const contract = this.get_contract("nft", wallet);
  const decreaseLiquidityData = contract.interface.encodeFunctionData('decreaseLiquidity', [{
    tokenId: tokenId,
    liquidity: positionData.liquidity,
    amount0Min: 0,
    amount1Min: 0,
    deadline: Date.now() + TTL}]);
  const collectFeesData = contract.interface.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: wallet.address,
      amount0Max: MaxUint128,
      amount1Max: MaxUint128}]);
  const burnData = contract.interface.encodeFunctionData('burn', [tokenId]);

  return await contract.multicall([decreaseLiquidityData, collectFeesData, burnData], { gasLimit: GAS_LIMIT });
  }

  async adjustLiquidity (wallet, action, tokenId, token0, token1, amount0, amount1) {
    const contract = this.get_contract("nft", wallet);
    const parsedAmount0 = ethers.utils.parseUnits(amount0, token0.decimals)
    const parsedAmount1 = ethers.utils.parseUnits(amount1, token1.decimals)
    if (action === "INCREASE") {
      return await contract.increaseLiquidity({
        tokenId: tokenId,
        amount0Desired: parsedAmount0,
        amount1Desired: parsedAmount1,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Date.now() + TTL},
        { gasLimit: GAS_LIMIT });
    } else {
      const liquidity = getLiquidity(ethers.utils.parseUnits(amount0, 6), ethers.utils.parseUnits(amount1, 6)) // use method from sdk to calculate liquidity from amount correctly
      const decreaseLiquidityData = contract.interface.encodeFunctionData('decreaseLiquidity', [{
        tokenId: tokenId,
        liquidity: liquidity,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Date.now() + TTL}]);
      const collectFeesData = contract.interface.encodeFunctionData('collect', [{
        tokenId: tokenId,
        recipient: wallet.address,
        amount0Max: MaxUint128,
        amount1Max: MaxUint128}]);

      return await contract.multicall([decreaseLiquidityData, collectFeesData], { gasLimit: GAS_LIMIT });
    }
  }

  async collectFees (wallet, tokenId) {
    const contract = this.get_contract("nft", wallet);
    return await contract.collect({
      tokenId: tokenId,
      recipient: wallet.address,
      amount0Max: MaxUint128,
      amount1Max: MaxUint128},
    { gasLimit: GAS_LIMIT });
}
}
