import { logger } from './logger';
import axios from 'axios';

import { ethers } from 'ethers';
import { ERC20Abi, KovanWETHAbi } from '../static/abi';

const fs = require('fs');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants
const APPROVAL_GAS_LIMIT =
  globalConfig.getConfig('ETH_APPROVAL_GAS_LIMIT') || 50000;

export default class Ethereum {
    network = '';
    provider = new ethers.providers.JsonRpcProvider(globalConfig.getConfig('ETHEREUM_RPC_URL'));
    erc20TokenListURL = globalConfig.getConfig('ETHEREUM_TOKEN_LIST_URL');
    
  constructor(network = 'mainnet') {
    // network defaults to kovan
    const providerUrl = globalConfig.getConfig('ETHEREUM_RPC_URL');
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    this.erc20TokenListURL = globalConfig.getConfig('ETHEREUM_TOKEN_LIST_URL');
    this.network = network;

    // update token list
    this.getERC20TokenList(); // erc20TokenList
  }

  // get ETH balance
    async getETHBalance(wallet: ethers.Wallet) {
    try {
      const balance = await wallet.getBalance();
      return balance / (1e18).toString();
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error ETH balance lookup');
      return reason;
    }
  }

  // get ERC-20 token balance
    async getERC20Balance(wallet: ethers.Wallet, tokenAddress, decimals = 18) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(
      tokenAddress,
      ERC20Abi,
      this.provider
    );
    try {
      const balance = await contract.balanceOf(wallet.address);
      return balance / Math.pow(10, decimals).toString();
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error balance lookup');
      return reason;
    }
  }

  // get ERC-20 token allowance
  async getERC20Allowance(wallet: ethers.Wallet, spender, tokenAddress, decimals = 18) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(
      tokenAddress,
      ERC20Abi,
      this.provider
    );
    try {
      const allowance = await contract.allowance(wallet.address, spender);
      return allowance / Math.pow(10, decimals).toString();
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error allowance lookup');
      return reason;
    }
  }

  // approve a spender to transfer tokens from a wallet address
  async approveERC20(
    wallet: ethers.Wallet,
    spender,
    tokenAddress,
    amount,
    gasPrice = this.gasPrice,
    _gasLimit
  ) {
    try {
      // fixate gas limit to prevent overwriting
      const approvalGasLimit = APPROVAL_GAS_LIMIT;
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new ethers.Contract(tokenAddress, ERC20Abi, wallet);
      return await contract.approve(spender, amount, {
        gasPrice: gasPrice * 1e9,
        gasLimit: approvalGasLimit
      });
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error approval');
      return reason;
    }
  }

  // get current Gas
  async getCurrentGasPrice() {
    try {
      this.provider.getGasPrice().then(function (gas) {
        // gasPrice is a BigNumber; convert it to a decimal string
        const gasPrice = gas.toString();
        return gasPrice;
      });
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error gas lookup');
      return reason;
    }
  }

  async deposit(
    wallet: ethers.Wallet,
    tokenAddress,
    amount,
    gasPrice = this.gasPrice,
    gasLimit = this.approvalGasLimit
  ) {
    // deposit ETH to a contract address
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        KovanWETHAbi,
        wallet
      );
      return await contract.deposit({
        value: amount,
        gasPrice: gasPrice * 1e9,
        gasLimit: gasLimit
      });
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error deposit');
      return reason;
    }
  }

  // get ERC20 Token List
  async getERC20TokenList() {
    let tokenListSource;
    try {
      if (this.network === 'kovan') {
        tokenListSource = 'src/static/erc20_tokens_kovan.json';
        this.erc20TokenList = JSON.parse(fs.readFileSync(tokenListSource));
      } else if (this.network === 'mainnet') {
        tokenListSource = this.erc20TokenListURL;
        if (tokenListSource === undefined || tokenListSource === null) {
          const errMessage = 'Token List source not found';
          logger.error('ERC20 Token List Error', { message: errMessage });
          console.log('eth - Error: ', errMessage);
        }
        if (
          this.erc20TokenList === undefined ||
          this.erc20TokenList === null ||
          this.erc20TokenList === {}
        ) {
          const response = await axios.get(tokenListSource);
          if (response.status === 200 && response.data) {
            this.erc20TokenList = response.data;
          }
        }
      } else {
        throw Error(`Invalid network ${this.network}`);
      }
      console.log(
        'get ERC20 Token List',
        this.network,
        'source',
        tokenListSource
      );
    } catch (err) {
      console.log(err);
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error ERC 20 Token List');
      return reason;
    }
  }

  // Refactor name to getERC20TokenByName
  getERC20TokenAddresses(tokenSymbol) {
    const tokenContractAddress = this.erc20TokenList.tokens.filter((obj) => {
      return obj.symbol === tokenSymbol.toUpperCase();
    });
    return tokenContractAddress[0];
  }

  getERC20TokenByAddress(tokenAddress) {
    const tokenContract = this.erc20TokenList.tokens.filter((obj) => {
      return obj.address.toUpperCase() === tokenAddress.toUpperCase();
    });
    return tokenContract[0];
  }
}
