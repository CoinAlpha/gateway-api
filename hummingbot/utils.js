/*
  Hummingbot Utils
*/

'use strict'

const lodash = require('lodash')
const debug = require('debug')('router')

const latency = (startTime, endTime) => parseFloat((endTime - startTime)/1000)

const isValidParams = (params) => {
  const values = Object.values(params)
  for(let i = 0; i < values.length; i++) { // DO NOT use forEach, it returns callback without breaking the loop
    if (typeof values[i] === 'undefined') {
      throw new Error('Invalid input params')
    }
  }
  return true
}

const isValidData = (data, format) => {
  if (typeof data !== 'undefined' && Object.keys(data).length !== 0 && lodash.isEqual(Object.keys(data), format)) {
    return true
  }
  return false
}

const getParamData = (data, format) => {
  debug(data, format)
  let dataObject = {}
  if (isValidData(data, format)) {
    format.forEach((key, index) => {
      dataObject[key] = data[key]
    })
  } else {
      throw new Error('Invalid input param data')
  }
  return dataObject
}

const getSymbols = (tradingPair) => {
  const symbols = tradingPair.split('-')
  const baseQuotePair = {
    "base": symbols[0].toUpperCase(), "quote": symbols[1].toUpperCase()
  }
  return baseQuotePair
}

const reportConnectionError = (res, error) => {
  res.json({
    error: error.errno,
    code: error.code,
  })
}

const strToDecimal = (str) => parseInt(str)/100;

const ERC20Abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "token",
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

const BalancerExchangeProxyAbi = [{"inputs":[{"internalType":"address","name":"_weth","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LOG_CALL","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"minTotalAmountOut","type":"uint256"}],"name":"batchEthInSwapExactIn","outputs":[{"internalType":"uint256","name":"totalAmountOut","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenOut","type":"address"}],"name":"batchEthInSwapExactOut","outputs":[{"internalType":"uint256","name":"totalAmountIn","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"totalAmountIn","type":"uint256"},{"internalType":"uint256","name":"minTotalAmountOut","type":"uint256"}],"name":"batchEthOutSwapExactIn","outputs":[{"internalType":"uint256","name":"totalAmountOut","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"maxTotalAmountIn","type":"uint256"}],"name":"batchEthOutSwapExactOut","outputs":[{"internalType":"uint256","name":"totalAmountIn","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"totalAmountIn","type":"uint256"},{"internalType":"uint256","name":"minTotalAmountOut","type":"uint256"}],"name":"batchSwapExactIn","outputs":[{"internalType":"uint256","name":"totalAmountOut","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"tokenInParam","type":"uint256"},{"internalType":"uint256","name":"tokenOutParam","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"}],"internalType":"struct ExchangeProxy.Swap[]","name":"swaps","type":"tuple[]"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"maxTotalAmountIn","type":"uint256"}],"name":"batchSwapExactOut","outputs":[{"internalType":"uint256","name":"totalAmountIn","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const KovanWETHAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

const KovanFaucetAddress = '0xb48Cc42C45d262534e46d5965a9Ac496F1B7a830'

module.exports = {
  latency,
  isValidParams, isValidData,
  getParamData,
  getSymbols,
  reportConnectionError,  
  strToDecimal,
  ERC20Abi,
  BalancerExchangeProxyAbi,
  KovanWETHAbi,
  KovanFaucetAddress,
};