import { logger } from './logger';
import axios from 'axios'

const debug = require('debug')('router')
require('dotenv').config()
const fs = require('fs');
const ethers = require('ethers')
const abi = require('../static/abi')

// constants
const APPROVAL_GAS_LIMIT = process.env.ETH_APPROVAL_GAS_LIMIT || 50000;

export default class EVM {
  constructor (network = 'mainnet') {
    // network defaults to kovan
    const providerUrl = process.env.EVM_RPC_URL
    const chainId = Number(process.env.EVM_CHAIN_ID)
    const ensAddress = process.env.EVM_ENS_RESOLVER
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl, {
      name: network,
      chainId,
      ensAddress
    })
    this.erc20TokenListURL = process.env.EVM_TOKEN_LIST_URL
    this.network = network
    this.spenders = {
      uniswap: process.env.EVM_UNISWAP_ROUTER
    }
    // update token list
    this.getERC20TokenList() // erc20TokenList
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
      const approvalGasLimit = APPROVAL_GAS_LIMIT
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, wallet)
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
      const contract = new ethers.Contract(tokenAddress, abi.KovanWETHAbi, wallet)
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

  // get ERC20 Token List
  async getERC20TokenList () {
    let tokenListSource
    try {
      tokenListSource = this.erc20TokenListURL
      if (tokenListSource === undefined || tokenListSource === null) {
        const errMessage = 'Token List source not found'
        logger.error('ERC20 Token List Error', { message: errMessage})
        console.log('eth - Error: ', errMessage)
      }
      if (this.erc20TokenList === undefined || this.erc20TokenList === null || this.erc20TokenList === {}) {
        const response = await axios.get(tokenListSource)
        if (response.status === 200 && response.data) {
          this.erc20TokenList = response.data
        }
      }
      console.log('get ERC20 Token List', this.network, 'source', tokenListSource)
    } catch (err) {
      console.log(err);
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error ERC 20 Token List'
      return reason
    }
  }

  getERC20TokenAddresses (tokenSymbol) {
    const tokenContractAddress = this.erc20TokenList.tokens.filter(obj => {
      return obj.symbol === tokenSymbol.toUpperCase()
    })
    return tokenContractAddress[0]
  }
}
