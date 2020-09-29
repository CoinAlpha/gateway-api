const fs = require('fs');
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const utils = require('../services/utils')

// utilities
const MAX_UINT = ethers.constants.MaxUint256;

// network selection
// also, you have to change the REACT_APP_SUBGRAPH_URL and restart server
const network = 'kovan' // ( mainnet / kovan )
const providerUrl = 'https://' + network + '.infura.io/v3/' + process.env.INFURA_API_KEY
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

let erc20Tokens
let exchangeProxy
switch (network) {
  case 'mainnet':
    erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens.json'))
    exchangeProxy = '0x6317C5e82A06E1d8bf200d21F4510Ac2c038AC81'
    break
  case 'kovan':
    erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
    exchangeProxy = '0x3208a3E3d5b0074D69E0888B8618295B9D6B13d3'
    break
}

// balancer settings
const multi = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
const tokenIn = erc20Tokens.WETH
const tokenOut = erc20Tokens.DAI

const getSwaps = async (amount) => {
  const data = await sor.getPoolsWithTokens(tokenIn, tokenOut)

  let poolData
  if (network === 'mainnet') {
    poolData = await sor.parsePoolDataOnChain(data.pools, tokenIn, tokenOut, multi, provider)
  } else {
    poolData = await sor.parsePoolData(data.pools, tokenIn, tokenOut)
  }

  const sorSwaps = sor.smartOrderRouter(
    poolData,             // balancers: Pool[]
    'swapExactIn',        // swapType: string
    amount,               // targetInputAmount: BigNumber
    new BigNumber('10'),  // maxBalancers: number
    0                     // costOutputToken: BigNumber
  )
  const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)
  const expectedOut = sor.calcTotalOutput(swaps, poolData)
  return { swaps, expectedOut }
}

const batchSwapExactIn = async (wallet, swaps, tokenIn, tokenOut, amount) => {
  const contract = new ethers.Contract(exchangeProxy, utils.BalancerExchangeProxyAbi, wallet)
  // approve exchangeProxy contract
  const totalAmountOut = await contract.batchSwapExactIn(swaps, tokenIn, tokenOut, amount, 0)
  return totalAmountOut
}

module.exports = {
  batchSwapExactIn,
  getSwaps,
  network,
  provider,
  tokenIn,
  tokenOut,
}
