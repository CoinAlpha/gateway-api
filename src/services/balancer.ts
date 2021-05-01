import { logger, debug } from './logger';
import sor from '@balancer-labs/sor';
import BigNumber from 'bignumber.js';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import ethers from 'ethers';
import proxyArtifact from '../static/ExchangeProxy.json';
import { Networks } from 'src/enums/networks';
import { Web3Provider } from '@ethersproject/providers';

// constants
const MAX_UINT = new BigNumber(ethers.constants.MaxUint256.toString());
const GAS_BASE = process.env.BALANCER_GAS_BASE
  ? parseInt(process.env.BALANCER_GAS_BASE)
  : 200688;
const GAS_PER_SWAP = process.env.BALANCER_GAS_PER_SWAP
  ? parseInt(process.env.BALANCER_GAS_PER_SWAP)
  : 100000;

const multiContracts = {
  [Networks.mainnet]: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  [Networks.kovan]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
};

export default class Balancer {
  provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL;
  gasBase = GAS_BASE;
  gasPerSwap = GAS_PER_SWAP;
  maxSwaps = process.env.BALANCER_MAX_SWAPS
    ? parseInt(process.env.BALANCER_MAX_SWAPS)
    : 4;
  exchangeProxy = process.env.EXCHANGE_PROXY;
  cachedPools: Record<string, any> = {};

  multiCall: string;

  constructor(private network: Networks = Networks.kovan) {
    this.multiCall = multiContracts[network];
  }

  async fetchPool(tokenIn: string, tokenOut: string): Promise<void> {
    // Why we not check cache first? pools can be changed in future?

    const pools = await sor.getPoolsWithTokens(tokenIn, tokenOut);
    this.cachedPools[`${tokenIn}${tokenOut}`] = pools;

    pools.pools.length === 0
      ? debug.info('>>> No pools contain the tokens provided.', {
          message: this.network,
        })
      : debug.info(`>>> ${pools.pools.length} Pools Retrieved.`, {
          message: this.network,
        });
  }

  async getCachedPools(tokenIn: string, tokenOut: string) {
    const cachePools = this.cachedPools[tokenIn + tokenOut].pools;
    debug.info(`>>> get cached Pools. ${tokenIn + tokenOut}`, {
      message: `total pools: ${cachePools.length}`,
    });

    return cachePools;
  }

  async priceSwapIn(
    tokenIn: string,
    tokenOut: string,
    tokenInAmount: BigNumber,
    maxSwaps: number = this.maxSwaps
  ) {
    // Fetch all the pools that contain the tokens provided
    try {
      // Get current on-chain data about the fetched pools
      await this.fetchPool(tokenIn, tokenOut);

      let poolData;
      const cachedPools = await this.getCachedPools(tokenIn, tokenOut);
      if (this.network === Networks.mainnet) {
        poolData = await sor.parsePoolDataOnChain(
          cachedPools,
          tokenIn,
          tokenOut,
          this.multiCall,
          this.provider as Web3Provider
        );
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(cachedPools, tokenIn, tokenOut);
      }

      // Parse the pools and pass them to smart order outer to get the swaps needed
      const sorSwaps = sor.smartOrderRouter(
        poolData, // balancers: Pool[]
        'swapExactIn', // swapType: string
        tokenInAmount, // targetInputAmount: BigNumber
        maxSwaps, // maxBalancers: number
        new BigNumber(0) // costOutputToken: BigNumber
      );

      const swapsFormatted = sor.formatSwapsExactAmountIn(
        sorSwaps,
        MAX_UINT,
        new BigNumber(0)
      );
      const expectedAmount = sor.calcTotalOutput(swapsFormatted, poolData);
      debug.info(`Expected Out: ${expectedAmount.toString()} (${tokenOut})`);

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
      return { swaps, expectedAmount };
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error in swapExactOut');
      return reason;
    }
  }

  async priceSwapOut(
    tokenIn: string,
    tokenOut: string,
    tokenOutAmount: BigNumber,
    maxSwaps = this.maxSwaps
  ) {
    // Fetch all the pools that contain the tokens provided
    try {
      // Get current on-chain data about the fetched pools
      await this.fetchPool(tokenIn, tokenOut);

      let poolData;
      const cachedPools = await this.getCachedPools(tokenIn, tokenOut);
      if (this.network === 'mainnet') {
        poolData = await sor.parsePoolDataOnChain(
          cachedPools,
          tokenIn,
          tokenOut,
          this.multiCall,
          this.provider as Web3Provider
        );
      } else {
        // Kovan multicall throws an ENS error
        poolData = await sor.parsePoolData(cachedPools, tokenIn, tokenOut);
      }

      // Parse the pools and pass them to smart order outer to get the swaps needed
      const sorSwaps = sor.smartOrderRouter(
        poolData, // balancers: Pool[]
        'swapExactOut', // swapType: string
        tokenOutAmount, // targetInputAmount: BigNumber
        maxSwaps, // maxBalancers: number
        new BigNumber(0) // costOutputToken: BigNumber
      );
      const swapsFormatted = sor.formatSwapsExactAmountOut(
        sorSwaps,
        MAX_UINT,
        MAX_UINT
      );
      const expectedAmount = sor.calcTotalInput(swapsFormatted, poolData);
      debug.info(`Expected In: ${expectedAmount.toString()} (${tokenIn})`);

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
      return { swaps, expectedAmount };
    } catch (err) {
      logger.error(err);
      throw new BalancerError(err);
    }
  }

  async swapExactIn(
    wallet: Provider | Signer | undefined,
    swaps: string[],
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: number,
    gasPrice: number
  ): Promise<ITransaction> {
    debug.info(`Number of swaps: ${swaps.length}`);
    try {
      if (!this.exchangeProxy) {
        throw new Error('Exchange proxy is not set');
      }

      const contract = new ethers.Contract(
        this.exchangeProxy,
        proxyArtifact.abi,
        wallet
      );

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
      );

      debug.info(`Tx Hash: ${tx.hash}`);
      return tx;
    } catch (err) {
      logger.error(err);
      throw new BalancerError(err);
    }
  }

  async swapExactOut(
    wallet: Provider | Signer | undefined,
    swaps: string[],
    tokenIn: string,
    tokenOut: string,
    expectedIn: string,
    gasPrice: number
  ) {
    debug.info(`Number of swaps: ${swaps.length}`);
    try {
      if (!this.exchangeProxy) {
        throw new Error('Exchange proxy is not set');
      }

      const contract = new ethers.Contract(
        this.exchangeProxy,
        proxyArtifact.abi,
        wallet
      );

      const tx = await contract.batchSwapExactOut(
        swaps,
        tokenIn,
        tokenOut,
        expectedIn,
        {
          gasPrice: gasPrice * 1e9,
          gasLimit: GAS_BASE + swaps.length * GAS_PER_SWAP,
        }
      );
      debug.info(`Tx Hash: ${tx.hash}`);
      return tx;
    } catch (err) {
      logger.error(err);
      throw new BalancerError(err);
    }
  }
}
