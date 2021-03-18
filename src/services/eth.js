import { logger } from './logger';
import { getNonceManager } from './utils';

require('dotenv').config()
const fs = require('fs');
const ethers = require('ethers')
const abi = require('../static/abi')

// constants

export default class Ethereum {
  constructor (network = 'mainnet') {
    // network defaults to kovan
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.network = network

    if (network === 'kovan') {
      // for kovan testing only
      this.erc20KovanTokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
    } else if (network === 'mainnet') {
      // contract list no longer maintained here. changed to accept contract address via request data
      // this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_hummingbot.json'))
    } else {
      throw Error(`Invalid network ${network}`)
    }
  }

  // get ETH balance
  async getETHBalance (wallet) {
    try {
      const balance = await wallet.getBalance()
      return balance / 1e18.toString()
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error ETH balance lookup'
      return reason
    }
  }

  // get ERC-20 token balance
  async getERC20Balance (wallet, tokenAddress, decimals = 18) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    try {
      const balance = await contract.balanceOf(wallet.address)
      return balance / Math.pow(10, decimals).toString()
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error balance lookup'
      return reason
    }
  }

  // get ERC-20 token allowance
  async getERC20Allowance (wallet, spender, tokenAddress, decimals = 18) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    try {
      const allowance = await contract.allowance(wallet.address, spender)
      return allowance / Math.pow(10, decimals).toString()
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error allowance lookup'
      return reason
    }
  }

  // approve a spender to transfer tokens from a wallet address
  async approveERC20 (wallet, spender, tokenAddress, amount, gasPrice = this.gasPrice, gasLimit) {
    try {
      // fixate gas limit to prevent overwriting
      const approvalGasLimit = 50000
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const signer = await getNonceManager(wallet)
      const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, signer)
      return await contract.approve(
        spender,
        amount, {
          gasPrice: gasPrice * 1e9,
          gasLimit: approvalGasLimit
        }
      )
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error approval'
      return reason
    }
  }

  // get current Gas
  async getCurrentGasPrice () {
    try {
      this.provider.getGasPrice().then(function (gas) {
        // gasPrice is a BigNumber; convert it to a decimal string
        const gasPrice = gas.toString();
        return gasPrice
      })
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error gas lookup'
      return reason
    }
  }

  async deposit (wallet, tokenAddress, amount, gasPrice = this.gasPrice, gasLimit = this.approvalGasLimit) {
    // deposit ETH to a contract address
    try {
      const signer = await getNonceManager(wallet)
      const contract = new ethers.Contract(tokenAddress, abi.KovanWETHAbi, signer)
      return await contract.deposit(
        { value: amount,
          gasPrice: gasPrice * 1e9,
          gasLimit: gasLimit
        }
      )
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error deposit'
      return reason
    }
  }
}
