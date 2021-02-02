import { logger } from './logger';
import axios from 'axios'

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
    this.spenders = {
      balancer: process.env.EXCHANGE_PROXY,
      uniswap: process.env.UNISWAP_ROUTER
    }
    this.tokenListUrl = process.env.ETHEREUM_TOKEN_LIST_URL
    if (network === 'kovan') {
      // for kovan testing only
      this.erc20KovanTokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
    } else if (network === 'mainnet') {
      this.erc20MainnetTokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_mainnet.json'))
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

  // get remote token list
  async getTokenList (tokenListUrl) {
    try {
      axios.get(tokenListUrl)
        .then(function (response) {
          // handle success
          const tokenList = response.data
          return tokenList
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    } catch (err) {
      logger.error(err)
      let reason
      err.reason ? reason = err.reason : reason = 'error remote token list retrieval'
      return reason
    }
  }

  getERC20TokenAddresses (tokenSymbol) {
    let tokenList
    if (this.network === 'kovan') {
      tokenList = this.erc20KovanTokens.tokens
    } else if (this.network === 'mainnet') {
      tokenList = this.erc20MainnetTokens.tokens
    } else {
      throw Error(`Invalid network ${this.network}`)
    }
    const tokenContractAddress = tokenList.filter(obj => {
      return obj.symbol === tokenSymbol.toUpperCase()
    })
    return tokenContractAddress[0]
  }
}
