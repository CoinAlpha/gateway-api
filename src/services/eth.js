import { logger } from './logger';
import axios from 'axios'

const debug = require('debug')('router')
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
    this.erc20TokenListURL = process.env.ETHEREUM_TOKEN_LIST_URL
    this.network = network
    this.spenders = {
      balancer: process.env.EXCHANGE_PROXY,
      uniswap: process.env.UNISWAP_ROUTER
    }
    // update token list
    this.tokenListUrl = process.env.ETHEREUM_TOKEN_LIST_URL
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
      const approvalGasLimit = 50000
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
      if (this.network === 'kovan') {
        tokenListSource = 'src/static/erc20_tokens_kovan.json'
        this.erc20TokenList = JSON.parse(fs.readFileSync(tokenListSource))
      } else if (this.network === 'mainnet') {
        tokenListSource = this.erc20TokenListURL
        if (this.tokenListSource === undefined || this.tokenListSource === null) {
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
      } else {
        throw Error(`Invalid network ${this.network}`)
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
