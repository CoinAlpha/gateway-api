require('dotenv').config()
const fs = require('fs');
const ethers = require('ethers')
const abi = require('../static/abi')
const debug = require('debug')('router')
const config = require('../services/config')

// constants
const ENV_CONFIG = config.getConfig()

export default class Ethereum {
  constructor (network = 'kovan') {
    // network defaults to kovan
    const providerUrl = ENV_CONFIG.ETHEREUM.RPC_URL
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.network = ENV_CONFIG.BALANCER.NETWORK
    this.gasLimit = ENV_CONFIG.BALANCER.GAS_LIMIT
    this.approvalGasLimit = ENV_CONFIG.BALANCER.APPROVAL_GAS_LIMIT

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
      let reason
      err.reason ? reason = err.reason : reason = 'error ETH balance lookup'
      return reason
    }
  }

  // get ERC-20 token balance
  async getERC20Balance (wallet, tokenAddress) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    try {
      const balance = await contract.balanceOf(wallet.address)
      return balance / 1e18.toString()
    } catch (err) {
      let reason
      err.reason ? reason = err.reason : reason = 'error balance lookup'
      return reason
    }
  }

  // get ERC-20 token allowance
  async getERC20Allowance (wallet, spender, tokenAddress) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    try {
      const allowance = await contract.allowance(wallet.address, spender)
      return allowance / 1e18.toString()
    } catch (err) {
      let reason
      err.reason ? reason = err.reason : reason = 'error allowance lookup'
      return reason
    }
  }

  // approve a spender to transfer tokens from a wallet address
  async approveERC20 (wallet, spender, tokenAddress, amount, gasPrice = this.gasPrice, gasLimit = this.approvalGasLimit) {
    try {
      // instantiate a contract and pass in wallet, which act on behalf of that signer
      const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, wallet)
      return await contract.approve(
        spender,
        amount, {
          gasPrice: gasPrice * 1e9,
          gasLimit: gasLimit
        }
      )
    } catch (err) {
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
      let reason
      err.reason ? reason = err.reason : reason = 'error deposit'
      return reason
    }
  }
}
