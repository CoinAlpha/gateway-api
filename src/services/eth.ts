import { debug, logger } from './logger';
import axios from 'axios';
import { Networks } from 'src/enums/networks';
import fs from 'fs';
import ethers, { Wallet } from 'ethers';
const abi = require('../static/abi.js');

// constants
const APPROVAL_GAS_LIMIT = process.env.ETH_APPROVAL_GAS_LIMIT || 50000;

const kovanTokensList = require('../static/erc20_tokens_kovan.json');

export default class Ethereum {
  provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  erc20TokenListURL = process.env.ETHEREUM_TOKEN_LIST_URL;
  spenders = {
    balancer: process.env.EXCHANGE_PROXY,
    uniswap: process.env.UNISWAP_ROUTER,
  };
  erc20TokenList: IERC20TokensList;

  constructor(private network: Networks = Networks.mainnet) {
    // update token list
    this.getERC20TokenList(); // erc20TokenList
  }

  // get ETH balance
  async getETHBalance(wallet: Wallet): Promise<BigInt> {
    try {
      const walletBalance = await wallet.getBalance();
      const balance = BigInt(walletBalance.toString());
      return balance / BigInt(1e18);
    } catch (err) {
      logger.error(err);
      throw new EthereumError(err.reason || 'error ETH balance lookup');
    }
  }

  // get ERC-20 token balance
  async getERC20Balance(wallet: Wallet, tokenAddress: string, decimals = 18) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(
      tokenAddress,
      abi.ERC20Abi,
      this.provider
    );
    try {
      const balance = await contract.balanceOf(wallet.address);
      return balance / Math.pow(10, decimals);
    } catch (err) {
      logger.error(err);
      throw new EthereumError(err.reason || 'error balance lookup');
    }
  }

  // get ERC-20 token allowance
  async getERC20Allowance(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    decimals = 18
  ) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(
      tokenAddress,
      abi.ERC20Abi,
      this.provider
    );
    try {
      const allowance = await contract.allowance(wallet.address, spender);
      return allowance / Math.pow(10, decimals);
    } catch (err) {
      logger.error(err);
      throw new EthereumError(err.reason || 'error allowance lookup');
    }
  }

  // approve a spender to transfer tokens from a wallet address
  async approveERC20(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    amount: number,
    gasPrice: number // = this.gasPrice???
  ) {
    try {
      // fixate gas limit to prevent overwriting
      const approvalGasLimit = APPROVAL_GAS_LIMIT;
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, wallet);
      return await contract.approve(spender, amount, {
        gasPrice: gasPrice * 1e9,
        gasLimit: approvalGasLimit,
      });
    } catch (err) {
      logger.error(err);
      throw new EthereumError(err.reason || 'error approval');
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
      throw new EthereumError(err.reason || 'error gas lookup');
    }
  }

  async deposit(
    wallet: Wallet,
    tokenAddress: string,
    amount: number,
    gasPrice: number, // = this.gasPrice, ??
    gasLimit: number // = this.approvalGasLimit ??
  ) {
    // deposit ETH to a contract address
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        abi.KovanWETHAbi,
        wallet
      );
      return await contract.deposit({
        value: amount,
        gasPrice: gasPrice * 1e9,
        gasLimit: gasLimit,
      });
    } catch (err) {
      logger.error(err);
      throw new EthereumError(err.reason || 'error deposit');
    }
  }

  // get ERC20 Token List
  async getERC20TokenList() {
    try {
      switch (this.network) {
        case Networks.kovan:
          this.erc20TokenList = kovanTokensList;
          break;

        case Networks.mainnet:
          if (!this.erc20TokenListURL) {
            const errMessage = 'Token List source not found';
            logger.error('ERC20 Token List Error', { message: errMessage });
          } else if (
            this.erc20TokenList === undefined ||
            this.erc20TokenList === null
          ) {
            const response = await axios.get(this.erc20TokenListURL);
            if (response.status === 200 && response.data) {
              this.erc20TokenList = response.data;
            }
          }
          break;

        default:
          throw new EthereumError(`Invalid network ${this.network}`);
      }
      debug.info(
        'get ERC20 Token List',
        this.network,
        'source',
        this.erc20TokenListURL
      );
    } catch (err) {
      logger.error(err);
      throw new EthereumError('error ERC 20 Token List');
    }
  }

  getERC20TokenAddresses(tokenSymbol: string) {
    const tokenContractAddress = this.erc20TokenList.tokens.filter((obj) => {
      return obj.symbol === tokenSymbol.toUpperCase();
    });
    return tokenContractAddress[0];
  }
}
