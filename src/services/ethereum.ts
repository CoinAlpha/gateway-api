import axios from 'axios';
import abi from '../assets/abi.json';
import { Contract, providers, Wallet } from 'ethers';
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

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

export interface EthTransactionReceipt {
  gasUsed: number;
  blockNumber: number;
  confirmations: number;
  status: number;
}

export interface TokenERC20Info {
  symbol: string;
  address: string;
  decimals: number;
}

export interface ERC20TokensList {
  name: string;
  tokens: TokenERC20Info[];
}

export interface EthTransactionReceipt {
  gasUsed: number;
  blockNumber: number;
  confirmations: number;
  status: number;
}

export class ServicesEthereum {
  private readonly provider = new providers.JsonRpcProvider(
    globalConfig.getConfig('ETHEREUM_RPC_URL')
  );
  private erc20TokenList: ERC20TokensList | null = null;
  private approvalGasLimit = 50000;

  /**
   * Extracted from constructor because it is async, load the ERC20 token list.
   * @param {Network} network
   * @return {Promise<void>}
   */
  private async start(network: Network): Promise<void> {
    switch (network) {
      case Network.KOVAN:
        this.erc20TokenList = require('../assets/erc20_tokens_kovan.json');
        break;

      case Network.MAINNET: {
        const { data } = await axios.get(
          globalConfig.getConfig('ETHEREUM_TOKEN_LIST_URL')
        );
        this.erc20TokenList = data;
        break;
      }

      default: {
        throw new Error(`Invalid network ${network}`);
      }
    }
  }

  constructor(network: Network) {
    this.start(network);
    this.approvalGasLimit =
      globalConfig.getConfig('ETH_APPROVAL_GAS_LIMIT') || this.approvalGasLimit;
  }

  /**
   * Get the ETH balance for a wallet.
   * @param {Wallet} wallet
   * @return {Promise<BigInt>}
   */
  async getETHBalance(wallet: Wallet): Promise<BigInt> {
    try {
      const walletBalance = await wallet.getBalance();
      const balance = BigInt(walletBalance.toString());
      return balance / BigInt(1e18);
    } catch (err) {
      throw new Error(err.reason || 'error ETH balance lookup');
    }
  }

  /**
   * Get the ERC20 balance for a wallet and token address.
   * @param {Wallet} wallet
   * @param {string} tokenAddress
   * @param {number} decimals
   * @return {Promise<BigInt>}
   */
  async getERC20Balance(
    wallet: Wallet,
    tokenAddress: string,
    decimals = 18
  ): Promise<BigInt> {
    // instantiate a contract and pass in provider for read-only access
    const contract = new Contract(tokenAddress, abi.ERC20Abi, this.provider);
    try {
      const balance = await contract.balanceOf(wallet.address);
      //  return (BigInt(balance) / BigInt(Math.pow(10, decimals))).toString();
      return BigInt(balance) / BigInt(Math.pow(10, decimals));
    } catch (err) {
      throw new Error(
        err.reason || `Error balance lookup for token address ${tokenAddress}`
      );
    }
  }

  /**
   * Approve a spender to transfer tokens from a wallet address
   * @param {Wallet} wallet
   * @param {string} spender
   * @param {string} tokenAddress
   * @param {number} decimals
   * @return {Promise<BigInt>}
   */
  async getERC20Allowance(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    decimals = 18
  ): Promise<BigInt> {
    // instantiate a contract and pass in provider for read-only access
    const contract = new Contract(tokenAddress, abi.ERC20Abi, this.provider);
    try {
      const allowance = await contract.allowance(wallet.address, spender);
      // return allowance / Math.pow(10, decimals);
      return BigInt(allowance) / BigInt(Math.pow(10, decimals));
    } catch (err) {
      throw new Error(err.reason || 'error allowance lookup');
    }
  }

  /**
   * Approval an amount for a wallet and token
   * @param {Wallet} wallet
   * @param {string} spender
   * @param {string} tokenAddress
   * @param {number} amount
   * @param {number} gasPrice
   * @return {Promise<void>}
   */
  async approveERC20(
    wallet: Wallet,
    spender: string,
    tokenAddress: string,
    amount: number,
    gasPrice: number
  ): Promise<void> {
    try {
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new Contract(tokenAddress, abi.ERC20Abi, wallet);
      return await contract.approve(spender, amount, {
        gasPrice: gasPrice * 1e9,
        // fixate gas limit to prevent overwriting
        gasLimit: this.approvalGasLimit,
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
   * Get ERC20 token address
   * @param {string} tokenSymbol
   * @return string | null
   */
  getERC20TokenAddress(tokenSymbol: string): TokenERC20Info | undefined | null {
    if (this.erc20TokenList) {
      const symbol = tokenSymbol.toUpperCase();
      const tokenContractAddress = this.erc20TokenList.tokens.find((obj) => {
        return obj.symbol === symbol;
      });

      return tokenContractAddress;
    } else {
      return null;
    }
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
   * Return information about list of tokens
   * @param {string[]} symbols
   * @return Record<string, TokenERC20Info>
   */
  getERC20TokensAddresses(symbols: string[]): Record<string, TokenERC20Info> {
    const tokenContractList: Record<string, TokenERC20Info> = {};

    for (const symbol of symbols) {
      const tokenContractInfo = this.getERC20TokenAddress(symbol);
      // Skip token if no info
      if (!tokenContractInfo) {
        continue;
      }

      tokenContractList[symbol] = tokenContractInfo;
    }

    return tokenContractList;
  }

  /**
   * Get transaction receipt for a transaction hash.
   * @param {string} txHash
   * @return {Promise<EthTransactionReceipt>}
   */
  async getTransactionReceipt(txHash: string): Promise<EthTransactionReceipt> {
    const transaction = await this.provider.getTransactionReceipt(txHash);

    return {
      gasUsed: transaction.gasUsed.toNumber(),
      blockNumber: transaction.blockNumber,
      confirmations: transaction.confirmations,
      status: transaction.status || 0,
    };
  }
}
