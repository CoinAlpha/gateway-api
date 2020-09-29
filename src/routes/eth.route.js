const fs = require('fs');
const express = require('express')
const router = express.Router()
const ethers = require('ethers')
const path = require('path');

// utilities
const abi = require('../static/abi')
const utils = require('../services/utils')

// network selection
const network = 'kovan'

// chain-specific configs
const providerUrl = 'https://' + network + '.infura.io/v3/' + process.env.INFURA_API_KEY
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

let erc20Tokens
switch (network) {
  case 'mainnet':
    erc20Tokens = fs.readFileSync(path.resolve(__dirname, '../static/erc20_tokens.json'))
    break
  case 'kovan':
    erc20Tokens = fs.readFileSync(path.resolve(__dirname, '../static/erc20_tokens_kovan.json'))
    break
}
erc20Tokens = JSON.parse(erc20Tokens)

// get ETH balance
const getETHBalance = async (wallet) => {
  const balance = await wallet.getBalance()
  return balance / 1e18.toString()
}

// get ERC-20 token balance
const getERC20Balance = async (wallet, tokenAddress) => {
  // instantiate a contract and pass in provider for read-only access
  const contract = new ethers.Contract(tokenAddress, abi.ERC20Abi, provider)
  const balance = await contract.balanceOf(wallet.address)
  return balance / 1e18.toString()
}

router.get('/get-balances', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  const balances = {}
  balances.ETH = await getETHBalance(wallet, privateKey)
  Promise.all(
    Object.keys(erc20Tokens).map(async (key) =>
      balances[key] = await getERC20Balance(wallet, erc20Tokens[key])
    )).then(() => {
    res.status(200).json({
      network: network,
      timestamp: initTime,
      latency: utils.latency(initTime, Date.now()),
      balances: balances
    })
  })
})

// Faucet to get test tokens
router.get('/faucet', (req, res) => {
  const initTime = Date.now()
  const privateKey = `0x${process.env.ETH_PRIVATE_KEY}` // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)
  const tokenSymbol = req.query.symbol || 'WETH'

  // Deposit Kovan ETH to get Kovan WETH
  const wei = ethers.utils.parseEther('0.3')
  const tokenAddress = erc20Tokens[tokenSymbol]
  // instantiate a contract and pass in wallet, which act on behalf of that signer
  const contract = new ethers.Contract(tokenAddress, abi.KovanWETHAbi, wallet)
  contract.deposit({ value: wei }).then((response) => {
    res.status(200).json({
      network: network,
      timestamp: initTime,
      result: response
    })
  })

  // When Balancer gives us the faucet ABI, we can use this faucet to get all Kovan tokens
  // const contract = new ethers.Contract(abi.KovanFaucetAddress, abi.KovanFaucetAbi, provider)
  // contract.drip(wallet.address, tokenAddress).then((response) => {
  //   res.status(200).json({
  //     network: network,
  //     timestamp: initTime,
  //     result: response
  //   })
  // })
})

module.exports = router;
