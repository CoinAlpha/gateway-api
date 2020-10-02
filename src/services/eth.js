require('dotenv').config()
const fs = require('fs');
const ethers = require('ethers')
const abi = require('../static/abi')

export default class Ethereum {
  constructor (network = 'kovan') {
    // network defaults to kovan
    const providerUrl = `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    this.network = network
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)

    if (network === 'kovan') {
      this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
    } else if (network === 'mainnet') {
      this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens.json'))
    } else {
      throw Error(`Invalid network ${network}`)
    }
  }

  // get ETH balance
  async getETHBalance (wallet) {
    const balance = await wallet.getBalance()
    return balance / 1e18.toString()
  }

  // get ERC-20 token balance
  async getERC20Balance (wallet, tokenAddress) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    const balance = await contract.balanceOf(wallet.address)
    return balance / 1e18.toString()
  }

  // get ERC-20 token allowance
  async getERC20Allowance (wallet, spender, tokenAddress) {
    // instantiate a contract and pass in provider for read-only access
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, this.provider)
    const allowance = await contract.allowance(wallet.address, spender)
    return allowance/1e18.toString()
  }

  async approveERC20 (wallet, spender, tokenAddress, amount) {
    // instantiate a contract and pass in wallet, which act on behalf of that signer
    const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, wallet)
    return await contract.approve(spender, amount)
  }
}
