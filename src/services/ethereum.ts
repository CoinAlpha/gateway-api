import axios from 'axios';
import abi from '../assets/abi.json';
import { BigNumber, Contract, providers, Wallet } from 'ethers';
import { EthereumConfigService } from './ethereum_config';
import { default as kovanErc20TokenList } from '../assets/erc20_tokens_kovan.json';
import { logger } from '../services/logger';

export enum GasStationLevel {
  FAST = 'fast',
  FASTEST = 'fastest',
  SAFE_LOW = 'safeLow',
  SAFE_LOW_WAIT = 'safeLowWait',
  AVERAGE = 'average',
  AVG_WAIT = 'avgWait',
  FAST_WAIT = 'fastWait',
  FASTEST_WAIT = 'fastestWait',
}

export enum Network {
  MAINNET = 'mainnet',
  KOVAN = 'kovan',
  ROPSTEN = 'ropsten',
}

// export interface EthTransactionReceipt {
//   gasUsed: number;
//   blockNumber: number;
//   confirmations: number;
//   status: number;
//   logs: Array<providers.Log>;
// }

export interface TokenERC20Info {
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
}

export interface ERC20TokensList {
  name: string;
  tokens: TokenERC20Info[];
}

// export interface EthTransactionReceipt {
//   gasUsed: number;
//   blockNumber: number;
//   confirmations: number;
//   status: number;
// }

const stringInsert = (str: string, val: string, index: number) => {
  if (index > 0) {
    return str.substring(0, index) + val + str.substr(index);
  }

  return val + str;
};

export const bigNumberWithDecimalToStr = (n: BigNumber, d: number): string => {
  const n_ = n.toString();

  let zeros = '';

  if (n_.length <= d) {
    zeros = '0'.repeat(d - n_.length + 1);
  }

  return stringInsert(n_.split('').reverse().join('') + zeros, '.', d)
    .split('')
    .reverse()
    .join('');
};

export class EthereumService {
  private readonly provider = new providers.JsonRpcProvider(this.config.rpcUrl);
  private chainId = 1;
  private erc20TokenList: ERC20TokensList | null = null;

  constructor(private readonly config: EthereumConfigService) {
    switch (this.config.networkName) {
      case Network.KOVAN:
        this.chainId = 42;
        this.erc20TokenList = kovanErc20TokenList;
        break;
      default:
        // MAINNET
        (async () => {
          const { data } = await axios.get(this.config.tokenListUrl);
          this.erc20TokenList = data;
        })();
    }
  }

  get networkName(): string {
    return this.config.networkName;
  }

  /**
   * Get the ETH balance for a wallet.
   * @param {Wallet} wallet
   * @return {Promise<string>}
   */
  async getETHBalance(wallet: Wallet): Promise<string> {
    try {
      const walletBalance = await wallet.getBalance();
      return bigNumberWithDecimalToStr(walletBalance, 18);
    } catch (err) {
      throw new Error(err.reason || 'error ETH balance lookup');
    }
  }

  /**
   * Get the ERC20 balance for a wallet and token address.
   * @param {Wallet} wallet
   * @param {string} tokenAddress
   * @param {number} decimals
   * @return {Promise<string>}
   */
  async getERC20Balance(
    wallet: Wallet,
    tokenAddress: string,
    decimals = 18
  ): Promise<string> {
    // instantiate a contract and pass in provider for read-only access
    const contract = new Contract(tokenAddress, abi.ERC20Abi, this.provider);
    try {
      const balance = await contract.balanceOf(wallet.address);
      return bigNumberWithDecimalToStr(balance, decimals);
    } catch (err) {
      throw new Error(
        err.reason || `Error balance lookup for token address ${tokenAddress}`
      );
    }
  }

  /**
   * Check how much a spender is allowed to spend for a wallet
   * @param {Wallet} wallet
   * @param {string} spender
   * @param {string} tokenAddress
   * @param {number} decimals
   * @return {Promise<string>}
   */
  async getERC20Allowance(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    decimals = 18
  ): Promise<string> {
    // instantiate a contract and pass in provider for read-only access
    const contract = new Contract(tokenAddress, abi.ERC20Abi, this.provider);
    try {
      const allowance = await contract.allowance(wallet.address, spender);
      return bigNumberWithDecimalToStr(allowance, decimals);
    } catch (err) {
      throw new Error(err.reason || 'error allowance lookup');
    }
  }

  /**
   * Approve a spender to transfer tokens from a wallet address
   * @param {Wallet} wallet
   * @param {string} spender
   * @param {string} tokenAddress
   * @param {number} amount
   * @param {number} gasPrice
   * @return {Promise<string>}
   */
  async approveERC20(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    amount: BigNumber,
    gasPrice: number
  ): Promise<string> {
    try {
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new Contract(tokenAddress, abi.ERC20Abi, wallet);
      return await contract.approve(spender, amount, {
        gasPrice: gasPrice * 1e9,
        // fixate gas limit to prevent overwriting
        gasLimit: 100000,
      });
    } catch (err) {
      throw new Error(err.reason || 'error approval');
    }
  }

  /**
   * Deposit ETH to a contract address
   * @param {Wallet} wallet
   * @param {string} tokenAddress
   * @param {number} amount
   * @param {number} gasPrice
   * @param {number} gasLimit
   * @return {Promise<any>}
   */
  async deposit(
    wallet: Wallet,
    tokenAddress: string,
    amount: number,
    gasPrice: number,
    gasLimit: number
  ): Promise<any> {
    try {
      const contract = new Contract(tokenAddress, abi.KovanWETHAbi, wallet);
      return await contract.deposit({
        value: amount,
        gasPrice: gasPrice * 1e9,
        gasLimit: gasLimit,
      });
    } catch (err) {
      throw new Error(err.reason || 'error deposit');
    }
  }

  /**
   * Get ERC20 token
   * @param {string} tokenSymbol
   * @return {TokenERC20Info} | null
   */
  getERC20Token(symbol: string): TokenERC20Info | undefined {
    if (this.erc20TokenList) {
      const token = this.erc20TokenList.tokens.find(
        (obj) =>
          obj.symbol === symbol.toUpperCase() && obj.chainId === this.chainId
      );
      return token;
    }
    return;
  }

  /**
   * Get ERC20 token address
   * @param {string} tokenSymbol
   * @return {TokenERC20Info} | null
   */
  getERC20TokenAddress(tokenSymbol: string): TokenERC20Info | undefined {
    if (this.erc20TokenList) {
      const symbol = tokenSymbol.toUpperCase();
      const tokenContractAddress = this.erc20TokenList.tokens.find((obj) => {
        return obj.symbol === symbol;
      });

      return tokenContractAddress;
    }
    return;
  }

  /**
   * Get ERC20 by token address
   * @param {string} tokenAddress
   * @return {TokenERC20Info} | null
   */
  getERC20TokenByAddress(tokenAddress: string): TokenERC20Info | undefined {
    if (this.erc20TokenList) {
      const tokenContract = this.erc20TokenList.tokens.filter((obj) => {
        return obj.address.toUpperCase() === tokenAddress.toUpperCase();
      });
      return tokenContract[0];
    }
    return;
  }

  /**
   * Return wallet of a private string
   * @param {string} privateKey
   * @return {Wallet}
   */
  getWallet(privateKey: string): Wallet {
    return new Wallet(privateKey, this.provider);
  }

  /**
   * Get transaction receipt for a transaction hash.
   * @param {string} txHash
   * @return {Promise<any>}
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    const transaction = await this.provider.getTransactionReceipt(txHash);
    logger.info(transaction);
    if (transaction) {
      return {
        gasUsed: transaction.gasUsed || 0,
        blockNumber: transaction.blockNumber,
        confirmations: transaction.confirmations,
        status: transaction.status || 0,
        logs: transaction.logs,
      };
    } else {
      // transaction is yet to be indexed
      return {
        gasUsed: 0,
        blockNumber: 0,
        confirmations: 0,
        status: 0,
        logs: [],
      };
    }
  }
}
