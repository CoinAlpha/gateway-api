require('dotenv').config() // DO NOT REMOVE. needed to configure REACT_APP_SUBGRAPH_URL used by @balancer-labs/sor
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const proxyArtifact = require('../static/ExchangeProxy.json')
const debug = require('debug')('router')

// constants
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';
const EXCHANGE_PROXY = '0x4e67bf5bD28Dd4b570FBAFe11D0633eCbA2754Ec';
const EXCHANGE_PROXY_KOVAN = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const MAX_UINT = ethers.constants.MaxUint256;
const MAX_SWAPS = 2;
const GAS_BASE = 100000;
const GAS_PER_SWAP = 100000;

export default class Balancer {
  constructor (network = 'mainnet') {
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.ETHEREUM_CHAIN
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)

    switch (network) {
      case 'mainnet':
        this.exchangeProxy = EXCHANGE_PROXY;
        break;
      case 'kovan':
        this.exchangeProxy = EXCHANGE_PROXY_KOVAN;
        break;
      default:
        throw Error(`Invalid network ${network}`)
    }
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount) {
    // Fetch all the pools that contain the tokens provided
    const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut)
    if (pools.pools.length === 0) {
      console.log('No pools contain the tokens provided', this.network);
      return {};
    }
    console.log('Pools Retrieved.', this.network);

    let poolData
    if (this.network === 'mainnet') {
      poolData = await sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, MULTI, this.provider)
    } else {
      poolData = await sor.parsePoolData(pools.pools, tokenIn, tokenOut)
    }

    // Parse the pools and pass them to smart order outer to get the swaps needed
    const sorSwaps = sor.smartOrderRouter(
      poolData,                             // balancers: Pool[]
      'swapExactIn',                        // swapType: string
      tokenInAmount,                        // targetInputAmount: BigNumber
      new BigNumber(MAX_SWAPS.toString()),  // maxBalancers: number
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
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount) {
    // Fetch all the pools that contain the tokens provided
    const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut)
    if (pools.pools.length === 0) {
      console.log('No pools contain the tokens provided', this.network);
      return {};
    }
    console.log('Pools Retrieved.', this.network);

    let poolData
    if (this.network === 'mainnet') {
      poolData = await sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, MULTI, this.provider)
    } else {
      poolData = await sor.parsePoolData(pools.pools, tokenIn, tokenOut)
    }

    // Parse the pools and pass them to smart order outer to get the swaps needed
    const sorSwaps = sor.smartOrderRouter(
      poolData,                             // balancers: Pool[]
      'swapExactOut',                       // swapType: string
      tokenOutAmount,                       // targetInputAmount: BigNumber
      new BigNumber(MAX_SWAPS.toString()),  // maxBalancers: number
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
  }

  async swapExactIn (wallet, swaps, tokenIn, tokenOut, amountIn, minAmountOut, gasPrice) {
    const contract = new ethers.Contract(this.exchangeProxy, proxyArtifact.abi, wallet)
    const tx = await contract.batchSwapExactIn(
      swaps,
      tokenIn,
      tokenOut,
      amountIn,
      0,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_BASE + MAX_SWAPS * GAS_PER_SWAP,
      }
    )
    debug(`Tx Hash: ${tx.hash}`);
    const txObj = await tx.wait()
    return txObj
  }

  async swapExactOut (wallet, swaps, tokenIn, tokenOut, expectedIn, gasPrice) {
    const contract = new ethers.Contract(this.exchangeProxy, proxyArtifact.abi, wallet)
    const tx = await contract.batchSwapExactOut(
      swaps,
      tokenIn,
      tokenOut,
      expectedIn,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_BASE + MAX_SWAPS * GAS_PER_SWAP,
      }
    )
    debug(`Tx Hash: ${tx.hash}`)
    const txObj = await tx.wait()
    return txObj
  }
}
