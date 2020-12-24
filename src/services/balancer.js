import { logger } from '../services/logger';
require('dotenv').config() // DO NOT REMOVE. needed to configure REACT_APP_SUBGRAPH_URL used by @balancer-labs/sor
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const proxyArtifact = require('../static/ExchangeProxy.json')
const debug = require('debug')('router')

// constants
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';
const MULTI_KOVAN = ' 0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A';
const EXCHANGE_PROXY = '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21';
const EXCHANGE_PROXY_KOVAN = '0x4e67bf5bD28Dd4b570FBAFe11D0633eCbA2754Ec';
const MAX_UINT = ethers.constants.MaxUint256;
const MAX_SWAPS = 4;
const GAS_BASE = 200688;
const GAS_PER_SWAP = 100000;

export default class Balancer {
  constructor (network = 'kovan') {
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL
    this.gasBase = GAS_BASE
    this.gasPerSwap = GAS_PER_SWAP
    this.maxSwaps = MAX_SWAPS

    switch (network) {
      case 'mainnet':
        this.exchangeProxy = EXCHANGE_PROXY;
        this.multiCall = MULTI;
        break;
      case 'kovan':
        this.exchangeProxy = EXCHANGE_PROXY_KOVAN;
        this.multiCall = MULTI_KOVAN;
        break;
      default:
        const err = `Invalid network ${network}`
        logger.error(err)
        throw Error(err)
    }
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount, maxSwaps = MAX_SWAPS) {
    // Fetch all the pools that contain the tokens provided
    try {
      const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut)
      if (pools.pools.length === 0) {
        logger.info('No pools contain the tokens provided.', { message: this.network })
        return {};
      }
      logger.info('Pools Retrieved.', { message: this.network })

      // Get current on-chain data about the fetched pools
      let poolData
      if (this.network === 'mainnet') {
        poolData = await sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, this.multiCall, this.provider)
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(pools.pools, tokenIn, tokenOut)
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
      const expectedOut = sor.calcTotalOutput(swapsFormatted, poolData)
      debug(`Expected Out: ${expectedOut.toString()} (${tokenOut})`);

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
      return { swaps, expectedOut }
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error in swapExactOut'
      return reason
    }
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount, maxSwaps = MAX_SWAPS) {
    // Fetch all the pools that contain the tokens provided
    try {
      const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut)
      if (pools.pools.length === 0) {
        logger.info('No pools contain the tokens provided.', { message: this.network });
        return {};
      }
      logger.info('Pools Retrieved.', { message: this.network })
      // Get current on-chain data about the fetched pools
      let poolData
      if (this.network === 'mainnet') {
        poolData = await sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, this.multiCall, this.provider)
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(pools.pools, tokenIn, tokenOut)
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
      const expectedIn = sor.calcTotalInput(swapsFormatted, poolData)
      debug(`Expected In: ${expectedIn.toString()} (${tokenIn})`);

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
      return { swaps, expectedIn }
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
