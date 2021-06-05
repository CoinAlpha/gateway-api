import { logger } from '../services/logger';
const debug = require('debug')('router')
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const proxyArtifact = require('../static/ExchangeProxy.json')
const globalConfig = require('../services/configuration_manager').configManagerInstance

// constants
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';
const MULTI_KOVAN = ' 0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A';
const MAX_UINT = ethers.constants.MaxUint256;
const GAS_BASE = globalConfig.getConfig("BALANCER_GAS_BASE") || 200688;
const GAS_PER_SWAP = globalConfig.getConfig("BALANCER_GAS_PER_SWAP") || 100000;

export default class Balancer {
  constructor (network = 'kovan') {
    const providerUrl = globalConfig.getConfig("ETHEREUM_RPC_URL")
    this.network = globalConfig.getConfig("ETHEREUM_CHAIN")
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.subgraphUrl = globalConfig.getConfig("REACT_APP_SUBGRAPH_URL")
    this.gasBase = GAS_BASE
    this.gasPerSwap = GAS_PER_SWAP
    this.maxSwaps = globalConfig.getConfig("BALANCER_MAX_SWAPS") || 4
    this.exchangeProxy = globalConfig.getConfig("EXCHANGE_PROXY")
    this.cachedPools = []

    switch (network) {
      case 'mainnet':
        this.multiCall = MULTI;
        break;
      case 'kovan':
        this.multiCall = MULTI_KOVAN;
        break;
      default:
        const err = `Invalid network ${network}`
        logger.error(err)
        throw Error(err)
    }
  }

  async fetchPool (tokenIn, tokenOut) {
    const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut)
    this.cachedPools[tokenIn + tokenOut] = pools

    if (pools.pools.length === 0) {
      debug('>>> No pools contain the tokens provided.', { message: this.network });
      return {};
    }
    debug(`>>> ${pools.pools.length} Pools Retrieved.`, { message: this.network })
  }

  async getCachedPools (tokenIn, tokenOut) {
    const cachePools =  this.cachedPools[tokenIn + tokenOut].pools
    debug(`>>> get cached Pools. ${tokenIn + tokenOut}`, { message: `total pools: ${cachePools.length}` })
    return cachePools
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount, maxSwaps = this.maxSwaps) {
    // Fetch all the pools that contain the tokens provided
    try {
      // Get current on-chain data about the fetched pools
      await this.fetchPool(tokenIn, tokenOut)

      let poolData
      const cachedPools = await this.getCachedPools(tokenIn, tokenOut)
      if (this.network === 'mainnet') {
        poolData = await sor.parsePoolDataOnChain(cachedPools, tokenIn, tokenOut, this.multiCall, this.provider)
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(cachedPools, tokenIn, tokenOut)
      }

      // Parse the pools and pass them to smart order outer to get the swaps needed
      const sorSwaps = sor.smartOrderRouter(
        poolData,                             // balancers: Pool[]
        'swapExactIn',                        // swapType: string
        tokenInAmount,                        // targetInputAmount: BigNumber
        new BigNumber(maxSwaps.toString()),   // maxBalancers: number
        0                                     // costOutputToken: BigNumber
      )

      const swapsFormatted = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)
      const expectedAmount = sor.calcTotalOutput(swapsFormatted, poolData)
      debug(`Expected Out: ${expectedAmount.toString()} (${tokenOut})`);

      // Create correct swap format for new proxy
      let swaps = [];
      for (let i = 0; i < swapsFormatted.length; i++) {
        let swap = {
          pool: swapsFormatted[i].pool,
          tokenIn: tokenIn,
          tokenOut: tokenOut,
          swapAmount: swapsFormatted[i].tokenInParam,
          limitReturnAmount: swapsFormatted[i].tokenOutParam,
          maxPrice: swapsFormatted[i].maxPrice.toString(),
        };
        swaps.push(swap);
      }
      return { swaps, expectedAmount }
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error in swapExactOut'
      return reason
    }
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount, maxSwaps = this.maxSwaps) {
    // Fetch all the pools that contain the tokens provided
    try {
      // Get current on-chain data about the fetched pools
      await this.fetchPool(tokenIn, tokenOut)

      let poolData
      const cachedPools = await this.getCachedPools(tokenIn, tokenOut)
      if (this.network === 'mainnet') {
        poolData = await sor.parsePoolDataOnChain(cachedPools, tokenIn, tokenOut, this.multiCall, this.provider)
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(cachedPools, tokenIn, tokenOut)
      }

      // Parse the pools and pass them to smart order outer to get the swaps needed
      const sorSwaps = sor.smartOrderRouter(
        poolData,                             // balancers: Pool[]
        'swapExactOut',                       // swapType: string
        tokenOutAmount,                       // targetInputAmount: BigNumber
        new BigNumber(maxSwaps.toString()),   // maxBalancers: number
        0                                     // costOutputToken: BigNumber
      )
      const swapsFormatted = sor.formatSwapsExactAmountOut(sorSwaps, MAX_UINT, MAX_UINT)
      const expectedAmount = sor.calcTotalInput(swapsFormatted, poolData)
      debug(`Expected In: ${expectedAmount.toString()} (${tokenIn})`);

      // Create correct swap format for new proxy
      let swaps = [];
      for (let i = 0; i < swapsFormatted.length; i++) {
        let swap = {
          pool: swapsFormatted[i].pool,
          tokenIn: tokenIn,
          tokenOut: tokenOut,
          swapAmount: swapsFormatted[i].tokenOutParam,
          limitReturnAmount: swapsFormatted[i].tokenInParam,
          maxPrice: swapsFormatted[i].maxPrice.toString(),
        };
        swaps.push(swap);
      }
      return { swaps, expectedAmount }
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error in swapExactOut'
      return reason
    }
  }

  async swapExactIn (wallet, swaps, tokenIn, tokenOut, amountIn, minAmountOut, gasPrice) {
    debug(`Number of swaps: ${swaps.length}`)
    try {
      const contract = new ethers.Contract(this.exchangeProxy, proxyArtifact.abi, wallet)
      const tx = await contract.batchSwapExactIn(
        swaps,
        tokenIn,
        tokenOut,
        amountIn,
        0,
        {
          gasPrice: gasPrice * 1e9,
          gasLimit: GAS_BASE + swaps.length * GAS_PER_SWAP,
        }
      )
      debug(`Tx Hash: ${tx.hash}`);
      return tx
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error in swapExactIn'
      return reason
    }
  }

  async swapExactOut (wallet, swaps, tokenIn, tokenOut, expectedIn, gasPrice) {
    debug(`Number of swaps: ${swaps.length}`)
    try {
      const contract = new ethers.Contract(this.exchangeProxy, proxyArtifact.abi, wallet)
      const tx = await contract.batchSwapExactOut(
        swaps,
        tokenIn,
        tokenOut,
        expectedIn,
        {
          gasPrice: gasPrice * 1e9,
          gasLimit: GAS_BASE + swaps.length * GAS_PER_SWAP,
        }
      )
      debug(`Tx Hash: ${tx.hash}`)
      return tx
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error in swapExactOut'
      return reason
    }
  }
}
