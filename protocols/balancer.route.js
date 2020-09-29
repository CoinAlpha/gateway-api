const fs = require('fs');
const express = require('express')
const router = express.Router()
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const ethRoutes = require('../protocols/eth.route')

// utilities
const MAX_UINT = ethers.constants.MaxUint256;
const utils = require('../hummingbot/utils')

// network selection
// also, you have to change the REACT_APP_SUBGRAPH_URL and restart server
const network = 'kovan' // ( mainnet / kovan )
const providerUrl = 'https://' + network + '.infura.io/v3/' + process.env.INFURA_API_KEY
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

let erc20_tokens
let exchangeProxy
switch(network) {
  case 'mainnet':
    erc20_tokens = JSON.parse(fs.readFileSync('hummingbot/erc20_tokens.json'))
    exchangeProxy = '0x6317C5e82A06E1d8bf200d21F4510Ac2c038AC81'
    break
  case 'kovan':
    erc20_tokens = JSON.parse(fs.readFileSync('hummingbot/erc20_tokens_kovan.json'))
    exchangeProxy = '0x3208a3E3d5b0074D69E0888B8618295B9D6B13d3'
    break
}

// balancer settings
const multi = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
const tokenIn = erc20_tokens["WETH"]
const tokenOut = erc20_tokens["DAI"]

const getSwaps = async (amount) => {
  const data = await sor.getPoolsWithTokens(tokenIn, tokenOut)

  let poolData
  network === 'mainnet' ? poolData = await sor.parsePoolDataOnChain(data.pools, tokenIn, tokenOut, multi, provider)
                        : poolData = await sor.parsePoolData(data.pools, tokenIn, tokenOut)

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
  console.log(totalAmountOut)
  return totalAmountOut
}

router.get('/', (req, res) => {
  res.status(200).send('Balancer')
})

router.get('/get-swaps', async (req, res) => {
  const initTime = Date.now()

  let amount
  req.query.amount  ? amount = new BigNumber(req.query.amount)
                    : amount = new BigNumber('10000000000000000000')
  const { swaps, expectedOut } = await getSwaps(amount);

  res.status(200).json({
    network: network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    amount: amount,
    swaps: swaps,
    expectedOut: expectedOut
  })
})

router.get('/buy', async (req, res) => {
  const initTime = Date.now()
  const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
  const wallet = new ethers.Wallet(privateKey, provider)

  // const amount =  new BigNumber(req.query.amount)
  const amount =  ethers.utils.parseEther(req.query.amount)
  console.log(tokenIn, tokenOut, amount);

  const { swaps, expectedOut } = await getSwaps(amount);
  const totalAmountOut = await batchSwapExactIn(wallet, swaps, tokenIn, tokenOut, amount)

  res.status(200).json({
    network: network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    swaps: swaps,
    totalAmountOut: totalAmountOut
  })

})

module.exports = router;