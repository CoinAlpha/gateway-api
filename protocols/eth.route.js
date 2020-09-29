const fs = require('fs');
const express = require('express')
const router = express.Router()
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')

// utilities
const MAX_UINT = ethers.constants.MaxUint256;
const utils = require('../hummingbot/utils')

// network selection
const network = 'kovan'

// chain-specific configs
const providerUrl = 'https://' + network + '.infura.io/v3/' + process.env.INFURA_API_KEY
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

let erc20_tokens
switch(network) {
  case 'mainnet':
    erc20_tokens = fs.readFileSync('hummingbot/erc20_tokens.json')
    break
  case 'kovan':
    erc20_tokens = fs.readFileSync('hummingbot/erc20_tokens_kovan.json')
    break
}
erc20_tokens = JSON.parse(erc20_tokens)

// get ETH balance
const getETHBalance = async (wallet) => {
  const balance = await wallet.getBalance()
  return balance/1e18.toString()
}

// get ERC-20 token balance
const getERC20Balance = async (wallet, tokenAddress) => {
  // instantiate a contract and pass in provider for read-only access
  const contract = new ethers.Contract(tokenAddress, utils.ERC20Abi, provider)
  const balance = await contract.balanceOf(wallet.address)
  return balance/1e18.toString()
}

// get ERC-20 token allowance
const getERC20Allowance = async (wallet, spender, tokenAddress) => {
  // instantiate a contract and pass in provider for read-only access
  const contract = new ethers.Contract(tokenAddress, utils.ERC20Abi, provider)
  const allowance = await contract.allowance(wallet.address, spender)
  return allowance/1e18.toString()
}

const approveERC20 = async (spender, tokenAddress, amount) => {
  // instantiate a contract and pass in wallet, which act on behalf of that signer
  const contract = new ethers.Contract(tokenAddress, utils.ERC20Abi, wallet)
  return await contract.approve(spender, amount)
}

router.get('/balances', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  const balances = {}
  balances["ETH"] = await getETHBalance(wallet, privateKey)
  Promise.all(
    Object.keys(erc20_tokens).map(async (key) =>
        balances[key] = await getERC20Balance(wallet, erc20_tokens[key])
    )).then(() => {
      res.status(200).json({
        network: network,
        timestamp: initTime,
        latency: utils.latency(initTime, Date.now()),
        balances: balances
      })
    }
  )
})

router.get('/allowances', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  // params: spender (required)
  const spender = req.query.spender

  const approvals = {}
  Promise.all(
    Object.keys(erc20_tokens).map(async (key) =>
    approvals[key] = await getERC20Allowance(wallet, spender, erc20_tokens[key])
    )).then(() => {
      res.status(200).json({
        network: network,
        timestamp: initTime,
        latency: utils.latency(initTime, Date.now()),
        spender: spender,
        approvals: approvals,
      })
    }
  )
})

router.get('/approve', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  // params: symbol (required), spender (required), amount (optional)
  const symbol = req.query.symbol
  const spender = req.query.spender
  let amount
  req.query.amount  ? amount = ethers.utils.parseEther(req.query.amount)
                    : amount = ethers.utils.parseEther('1000000000') // approve for 1 billion units if no amount specified
  const tokenAddress = erc20_tokens[symbol]

  // call approve function
  const approval = await approveERC20(wallet, tokenAddress, amount)

  // submit response
  res.status(200).json({
    network: network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    symbol: symbol,
    spender: spender,
    amount: amount,
    approval: approval,
  })
})

// Faucet to get test tokens
router.get('/faucet', (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  // params: symbol (optional)
  let symbol
  req.query.symbol  ? symbol = req.query.symbol
                    : symbol = "WETH"

  // Deposit Kovan ETH to get Kovan WETH
  const wei = ethers.utils.parseEther("0.3")
  const tokenAddress = erc20_tokens[symbol]
  // instantiate a contract and pass in wallet, which act on behalf of that signer
  const contract = new ethers.Contract(tokenAddress, utils.KovanWETHAbi, wallet)
  contract.deposit({value: wei}).then((response) => {
      res.status(200).json({
        network: network,
        timestamp: initTime,
        result: response
      })
  })
  
  // When Balancer gives us the faucet ABI, we can use this faucet to get all Kovan tokens
  // const contract = new ethers.Contract(utils.KovanFaucetAddress, utils.KovanFaucetAbi, provider)
  // contract.drip(wallet.address, tokenAddress).then((response) => {
  //   res.status(200).json({
  //     network: network,
  //     timestamp: initTime,
  //     result: response
  //   })
  // })
})

module.exports = router;