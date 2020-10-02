// const fs = require('fs');
// const express = require('express')
// const router = express.Router()
// const sor = require('@balancer-labs/sor')
// const BigNumber = require('bignumber.js')
// const ethers = require('ethers')
// const ethRoutes = require('../protocols/eth.route')

// // utilities
// const MAX_UINT = ethers.constants.MaxUint256;
// const utils = require('../hummingbot/utils')

// // select network
// // **IMPORTANT: you also have to change REACT_APP_SUBGRAPH_URL in .env and restart server**
// const network = 'kovan' // ( mainnet / kovan )
// const providerUrl = 'https://' + network + '.infura.io/v3/' + process.env.INFURA_API_KEY
// const provider = new ethers.providers.JsonRpcProvider(providerUrl)

// // balancer addresses
// let erc20_tokens
// let exchangeProxy
// const multi = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
// switch(network) {
//   case 'mainnet':
//     erc20_tokens = JSON.parse(fs.readFileSync('hummingbot/erc20_tokens.json'))
//     exchangeProxy = '0x6317C5e82A06E1d8bf200d21F4510Ac2c038AC81'
//     break
//   case 'kovan':
//     erc20_tokens = JSON.parse(fs.readFileSync('hummingbot/erc20_tokens_kovan.json'))
//     exchangeProxy = '0x3208a3E3d5b0074D69E0888B8618295B9D6B13d3'
//     break
// }

// // FUNCTIONS

// const getSwaps = async (tokenIn, tokenOut, amount) => {
//   const data = await sor.getPoolsWithTokens(tokenIn, tokenOut)

//   let poolData
//   network === 'mainnet' ? poolData = await sor.parsePoolDataOnChain(data.pools, tokenIn, tokenOut, multi, provider)
//                         : poolData = await sor.parsePoolData(data.pools, tokenIn, tokenOut)

//   const sorSwaps = sor.smartOrderRouter(
//       poolData,             // balancers: Pool[]
//       'swapExactIn',        // swapType: string
//       amount,               // targetInputAmount: BigNumber
//       new BigNumber('10'),  // maxBalancers: number
//       0                     // costOutputToken: BigNumber
//   )
//   const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)
//   const expectedOut = sor.calcTotalOutput(swaps, poolData)
//   return { swaps, expectedOut }
// }

// const batchSwapExactIn = async (wallet, swaps, tokenIn, tokenOut, amount) => {
//   console.log(swaps, tokenIn, tokenOut, amount, '0')
//   const contract = new ethers.Contract(exchangeProxy, utils.BalancerExchangeProxyAbi, wallet)
//   const totalAmountOut = await contract.batchSwapExactIn(swaps, tokenIn, tokenOut, amount, '0')
//   console.log(totalAmountOut)
//   return totalAmountOut
// }

// // ROUTES

// router.get('/', (req, res) => {
//   res.status(200).send('Balancer')
// })

// router.get('/price', async (req, res) => {
//   const initTime = Date.now()

//   // params: tokenIn (required), tokenOut (required), amount (required)
//   const tokenIn = req.query.tokenIn
//   const tokenOut = req.query.tokenOut
//   const amount =  new BigNumber(parseInt(req.query.amount*1e18))

//   // fetch the optimal pool mix from balancer-sor
//   const { swaps, expectedOut } = await getSwaps(
//     erc20_tokens[tokenIn], 
//     erc20_tokens[tokenOut], 
//     amount,
//   )

//   res.status(200).json({
//     network: network,
//     timestamp: initTime,
//     latency: utils.latency(initTime, Date.now()),
//     tokenIn: tokenIn,
//     tokenOut: tokenOut,
//     amount: parseFloat(req.query.amount),
//     expectedOut: parseInt(expectedOut)/1e18,
//     swaps: swaps,
//   })
// })

// router.get('/trade', async (req, res) => {
//   const initTime = Date.now()
//   const privateKey = "0x" + process.env.ETH_PRIVATE_KEY // replace by passing this in as param
//   const wallet = new ethers.Wallet(privateKey, provider)

//   // params: tokenIn (required), tokenOut (required), amount (required), maxPrice (optional)
//   const tokenIn = req.query.tokenIn
//   const tokenOut = req.query.tokenOut
//   const amount =  new BigNumber(parseInt(req.query.amount*1e18))
//   const amountString = (parseInt(req.query.amount*1e18)).toString()

//   let maxPrice
//   req.query.maxPrice  ? maxPrice = new BigNumber(req.query.maxPrice)
//                       : maxPrice = new BigNumber('0')

//   // fetch the optimal pool mix from balancer-sor and pass them to exchange-proxy
//   const { swaps, expectedOut } = await getSwaps(
//     erc20_tokens[tokenIn], 
//     erc20_tokens[tokenOut], 
//     amount
//   )
//   // pass swaps to exchange-proxy to complete trade
//   const totalAmountOut = await batchSwapExactIn(
//     wallet, 
//     swaps, 
//     erc20_tokens[tokenIn], 
//     erc20_tokens[tokenOut],
//     amountString,
//   )

//   // submit response
//   res.status(200).json({
//     network: network,
//     timestamp: initTime,
//     latency: utils.latency(initTime, Date.now()),
//     tokenIn: tokenIn,
//     tokenOut: tokenOut,
//     amount: parseFloat(req.query.amount),
//     totalAmountOut: totalAmountOut,
//   })

// })

// module.exports = router;