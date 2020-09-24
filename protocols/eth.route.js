const _ = require('lodash')
const express = require('express')
const router = express.Router()
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')

// utilities
const MAX_UINT = ethers.constants.MaxUint256;
const utils = require('../hummingbot/utils')

// load environment config
const network = 'ethereum';
const providerUrl = process.env.INFURA_URL;
const privateKey = "0x" + process.env.ETH_PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(providerUrl)
const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  }
]

// token addresses
const tokenDict = {
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

// get ETH balance
const getETHBalance = async (wallet) => {
  const balance = await wallet.getBalance()
  return balance/1e18.toString()
}

// get ERC-20 token balance
const getERC20Balance = async (wallet, tokenAddress) => {
  const contract = new ethers.Contract(tokenAddress, abi, provider)
  const balance = await contract.balanceOf(wallet.address)
  return balance/1e18.toString()
}

router.get('/get-balances', async (req, res) => {
  const initTime = Date.now()
  const balances = {}
  const wallet = new ethers.Wallet(privateKey, provider)
  balances["ETH"] = await getETHBalance(wallet)

  Promise.all(
    Object.keys(tokenDict).map(async (key) =>
        balances[key] = await getERC20Balance(wallet, tokenDict[key])
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

module.exports = router;