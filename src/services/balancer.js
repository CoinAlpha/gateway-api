require('dotenv').config() // DO NOT REMOVE
import { SOR } from '@balancer-labs/sor';
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const proxyArtifact = require('../static/ExchangeProxy.json')
const debug = require('debug')('router')

// mainnet constants
const CHAIN_ID = 1;
const EXCHANGE_PROXY = '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21';
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';
const POOLS_URL = 'https://ipfs.fleek.co/ipns/balancer-team-bucket.storage.fleek.co/balancer-exchange/pools';

// kovan constants
const CHAIN_ID_KOVAN = 42;
const EXCHANGE_PROXY_KOVAN = '0x4e67bf5bD28Dd4b570FBAFe11D0633eCbA2754Ec';
const MULTI_KOVAN = ' 0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A';
const POOLS_URL_KOVAN = 'https://ipfs.fleek.co/ipns/balancer-team-bucket.storage.fleek.co/balancer-exchange-kovan/pools';

// misc constants
const MAX_UINT = ethers.constants.MaxUint256;
const MAX_SWAPS = 4;
const GAS_BASE = 200688;
const GAS_PER_SWAP = 100000;

export default class Balancer {
  constructor (network = 'kovan') {
    const providerUrl = process.env.ETHEREUM_RPC_URL;
    this.network = process.env.ETHEREUM_CHAIN;
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    // this.subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL;

    this.gasBase = GAS_BASE;
    this.gasPerSwap = GAS_PER_SWAP;
    this.maxSwaps = MAX_SWAPS;

    switch (network) {
      case 'mainnet':
        this.chainId = CHAIN_ID;
        this.exchangeProxy = EXCHANGE_PROXY;
        this.poolsUrl = POOLS_URL;
        this.multiCall = MULTI;
        break;
      case 'kovan':
        this.chainId = CHAIN_ID_KOVAN;
        this.exchangeProxy = EXCHANGE_PROXY_KOVAN;
        this.poolsUrl = POOLS_URL_KOVAN;
        this.multiCall = MULTI_KOVAN;
        break;
      default:
        throw Error(`Invalid network ${network}`)
    }

    const gasPrice = new BigNumber('30000000000'); // replace later
    this.sor = new SOR(this.provider, gasPrice, this.maxSwaps, this.chainId, this.poolsUrl);
    console.log('instantiated sor')
  }

  // Fetch all the pools that contain the tokens provided
  async fetchPools (tokenIn, tokenOut) {
    console.time('fetchPools');
    const pools = await this.sor.fetchFilteredPairPools(tokenIn, tokenOut)
    console.timeEnd('fetchPools');

    pools ? console.log('Pools Retrieved.', this.network)
          : console.log('No pools contain the tokens provided', this.network);
    return pools;
  }

  // Find the optimal swap route within all the fetched pools
  async getSwaps (tokenIn, tokenOut, swapType, swapAmount) {
    console.time('getSwaps');
    const [swaps, expectedAmount] = await this.sor.getSwaps(
      tokenIn,
      tokenOut,
      swapType,
      swapAmount
    );
    console.timeEnd('getSwaps');
    return [swaps, expectedAmount];
  }

  async priceSwapIn (tokenIn, tokenOut, tokenInAmount) {
    const pools = await this.fetchPools(tokenIn, tokenOut);
    if (!pools) return {};

    const [swaps, tokenOutAmount] = await this.getSwaps(
      tokenIn,
      tokenOut,
      'swapExactIn',
      tokenInAmount
    );
    console.log(swaps);
    console.log(tokenOutAmount);
    console.log(`${tokenInAmount} ${tokenIn} => ${tokenOutAmount.toString()} ${tokenOut} `);
    // console.log(`Price = ${expectedOut / tokenInAmount}`);

    // Get current on-chain data about the fetched pools
    // let poolData
    // if (this.network === 'mainnet') {
    //   poolData = await this.sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, this.multiCall, this.provider)
    // } else {
    //   // Kovan multicall throws an ENS error
    //   poolData = await this.sor.parsePoolData(pools.pools, tokenIn, tokenOut)
    // }

    // Parse the pools and pass them to smart order outer to get the swaps needed
    // const sorSwaps = this.sor.smartOrderRouter(
    //   poolData,                             // balancers: Pool[]
    //   'swapExactIn',                        // swapType: string
    //   tokenInAmount,                        // targetInputAmount: BigNumber
    //   new BigNumber(maxSwaps.toString()),   // maxBalancers: number
    //   0                                     // costOutputToken: BigNumber
    // )

    // const swapsFormatted = this.sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)
    // const expectedOut = this.sor.calcTotalOutput(swapsFormatted, poolData)
    // debug(`Expected Out: ${expectedOut.toString()} (${tokenOut})`);

    // // Create correct swap format for new proxy
    // let swaps = [];
    // for (let i = 0; i < swapsFormatted.length; i++) {
    //   let swap = {
    //     pool: swapsFormatted[i].pool,
    //     tokenIn: tokenIn,
    //     tokenOut: tokenOut,
    //     swapAmount: swapsFormatted[i].tokenInParam,
    //     limitReturnAmount: swapsFormatted[i].tokenOutParam,
    //     maxPrice: swapsFormatted[i].maxPrice.toString(),
    //   };
    //   swaps.push(swap);
    // }
    return [swaps, tokenOutAmount];
  }

  async priceSwapOut (tokenIn, tokenOut, tokenOutAmount, maxSwaps = MAX_SWAPS) {
    const pools = await this.fetchPools(tokenIn, tokenOut);
    if (!pools) return {};

    // Get current on-chain data about the fetched pools
    let poolData
    if (this.network === 'mainnet') {
      poolData = await this.sor.parsePoolDataOnChain(pools.pools, tokenIn, tokenOut, this.multiCall, this.provider)
    } else {
      // Kovan multicall throws an ENS error
      poolData = await this.sor.parsePoolData(pools.pools, tokenIn, tokenOut)
    }

    // Parse the pools and pass them to smart order outer to get the swaps needed
    const sorSwaps = this.sor.smartOrderRouter(
      poolData,                             // balancers: Pool[]
      'swapExactOut',                       // swapType: string
      tokenOutAmount,                       // targetInputAmount: BigNumber
      new BigNumber(maxSwaps.toString()),   // maxBalancers: number
      0                                     // costOutputToken: BigNumber
    )
    const swapsFormatted = this.sor.formatSwapsExactAmountOut(sorSwaps, MAX_UINT, MAX_UINT)
    const expectedIn = this.sor.calcTotalInput(swapsFormatted, poolData)
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
    debug(`Number of swaps: ${swaps.length}`);
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
  }

  async swapExactOut (wallet, swaps, tokenIn, tokenOut, expectedIn, gasPrice) {
    debug(`Number of swaps: ${swaps.length}`);
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
  }
}
