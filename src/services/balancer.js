require('dotenv').config() // DO NOT REMOVE. needed to configure REACT_APP_SUBGRAPH_URL used by @balancer-labs/sor
const fs = require('fs');
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const proxyArtifact = require('../static/ExchangeProxy.json')
const debug = require('debug')('router')
const config = require('../services/config')

// constants
const ENV_CONFIG = config.getConfig()
const MAX_UINT = ethers.constants.MaxUint256;
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';

export default class Balancer {
  constructor (network = 'kovan') {
    // network defaults to kovan
    const providerUrl = ENV_CONFIG.ethereum.ETHEREUM_RPC_URL
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.network = ENV_CONFIG.balancer.BALANCER_NETWORK
    this.exchangeProxy = ENV_CONFIG.balancer.EXCHANGE_PROXY
    this.gasLimit = ENV_CONFIG.balancer.GAS_LIMIT

    if (network === 'kovan') {
      // this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
      // this.exchangeProxy = '0x4e67bf5bD28Dd4b570FBAFe11D0633eCbA2754Ec'
    } else if (network === 'mainnet') {
      // this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens.json'))
      // this.exchangeProxy = '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21'
    } else {
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
      poolData,             // balancers: Pool[]
      'swapExactIn',        // swapType: string
      tokenInAmount,        // targetInputAmount: BigNumber
      new BigNumber('4'),   // maxBalancers: number
      0                     // costOutputToken: BigNumber
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
      poolData,             // balancers: Pool[]
      'swapExactOut',       // swapType: string
      tokenOutAmount,       // targetInputAmount: BigNumber
      new BigNumber('4'),   // maxBalancers: number
      0                     // costOutputToken: BigNumber
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
        gasLimit: this.gasLimit
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
        gasLimit: GAS_LIMIT
      }
    )
    debug(`Tx Hash: ${tx.hash}`)
    const txObj = await tx.wait()
    return txObj
  }
}
