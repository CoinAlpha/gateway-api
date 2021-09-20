import { logger } from '../services/logger';
import Fees from '../services/fees';
const debug = require('debug')('router');
const sor = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');
const ethers = require('ethers');
const proxyArtifact = require('../static/balancer_vault_abi.json');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants
const MAX_UINT = ethers.constants.MaxUint256;
const GAS_BASE = globalConfig.getConfig('BALANCER_GAS_BASE') || 300688; // thesame as gas limit
export const VAULT = globalConfig.getConfig('BALANCER_VAULT'); // vault address, thesame on all major networks
const Network = {
  MAINNET: 1,
  KOVAN: 42,
};

const SUBGRAPH_URLS = {
  [Network.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
  [Network.KOVAN]:
    'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2',
};

export default class Balancer {
  constructor() {
    this.network = globalConfig.getConfig('ETHEREUM_CHAIN');
    this.maxSwaps = globalConfig.getConfig('BALANCER_MAX_SWAPS') || 4; // or max hop
    this.provider = new ethers.providers.JsonRpcProvider(
      globalConfig.getConfig('ETHEREUM_RPC_URL')
    );
    this.fees = new Fees();
    this.chainId = Network[this.network.toUpperCase()]
    this.subgraphUrl = SUBGRAPH_URLS[this.chainId];
    this.sor = new sor.SOR(
      this.provider,
      this.chainId,
      this.subgraphUrl
    );
    this.gasLimit = GAS_BASE;
    this.vault = VAULT;
  }

  async priceSwapIn(tokenIn, tokenOut, tokenInAmount) {
    try {
      await this.sor.fetchPools(true); // update pools from current on-chain data
      const gasPrice = new BigNumber(this.fees.ethGasPrice * 1e9); // update gas price for sor to enable it find effectivice routes

      const swapInfo = await this.sor.getSwaps(
        tokenIn.address,
        tokenOut.address,
        sor.SwapTypes.SwapExactIn,
        tokenInAmount,
        { gasPrice: gasPrice, maxPools: this.maxSwaps}
      );
      const expectedAmount = sor
        .scale(swapInfo.returnAmount, -tokenOut.decimals);
      debug(`Expected Out: ${expectedAmount.toString()}`);

      return { swapInfo, expectedAmount, cost: '0', gasPrice: this.fees.ethGasPrice };
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error fetching price to swap in');
      return reason;
    }
  }

  async priceSwapOut(tokenIn, tokenOut, tokenOutAmount) {
    try {
      await this.sor.fetchPools(); // update pools from current on-chain data
      const maxPools = this.maxSwaps;
      const gasPrice = new BigNumber(this.fees.ethGasPrice * 1e9); // update gas price for sor to enable it find effectivice routes

      const swapInfo = await this.sor.getSwaps(
        tokenIn.address,
        tokenOut.address,
        sor.SwapTypes.SwapExactOut,
        tokenOutAmount,
        { gasPrice: gasPrice, maxPools: this.maxSwaps}
      );
      const expectedAmount = sor
        .scale(swapInfo.returnAmount, -tokenIn.decimals);

      debug(`Expected Out: ${expectedAmount.toString()})`);

      return { swapInfo, expectedAmount, cost: '0', gasPrice: this.fees.ethGasPrice };
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error fetching price to swap out');
      return reason;
    }
  }

  async swapExactIn(wallet, swapInfo, gasPrice) {
    const limits = [];
    if (swapInfo) {
      swapInfo.tokenAddresses.forEach((token, i) => {
        if (token.toLowerCase() === swapInfo.tokenIn.toLowerCase()) {
          limits[i] = swapInfo.swapAmount.toString();
        } else if (token.toLowerCase() === swapInfo.tokenOut.toLowerCase()) {
          limits[i] = swapInfo.returnAmount.toString();
        } else {
          limits[i] = '0';
        }
      });
    }
    const funds = {
      sender: wallet.address,
      recipient: wallet.address,
      fromInternalBalance: false,
      toInternalBalance: false,
    };
    try {
      const contract = new ethers.Contract(
        this.vault,
        proxyArtifact.abi,
        wallet
      );
      const tx = await contract.batchSwap(
        sor.SwapTypes.SwapExactIn,
        swapInfo.swaps,
        swapInfo.tokenAddresses,
        funds,
        limits,
        MAX_UINT, // deadline
        {
          gasPrice: gasPrice * 1e9,
          gasLimit: this.gasLimit,
        }
      );
      debug(`Tx Hash: ${tx.hash}`);
      return tx;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error swapping in');
      return reason;
    }
  }

  async swapExactOut(wallet, swapInfo, gasPrice) {
    const limits = [];
    if (swapInfo) {
      swapInfo.tokenAddresses.forEach((token, i) => {
        if (token.toLowerCase() === swapInfo.tokenIn.toLowerCase()) {
          limits[i] = swapInfo.returnAmount.toString();
        } else if (token.toLowerCase() === swapInfo.tokenOut.toLowerCase()) {
          limits[i] = swapInfo.swapAmount.toString();
        } else {
          limits[i] = '0';
        }
      });
    }
    const funds = {
      sender: wallet.address,
      recipient: wallet.address,
      fromInternalBalance: false,
      toInternalBalance: false,
    };
    try {
      const contract = new ethers.Contract(
        this.vault,
        proxyArtifact.abi,
        wallet
      );
      const tx = await contract.batchSwap(
        sor.SwapTypes.SwapExactOut,
        swapInfo.swaps,
        swapInfo.tokenAddresses,
        funds,
        limits,
        MAX_UINT, // deadline
        {
          gasPrice: gasPrice * 1e9,
          gasLimit: this.gasLimit,
        }
      );
      debug(`Tx Hash: ${tx.hash}`);
      return tx;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error in swapExactOut');
      return reason;
    }
  }
}
