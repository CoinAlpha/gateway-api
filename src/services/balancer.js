const fs = require('fs');
const sor = require('@balancer-labs/sor')
const BigNumber = require('bignumber.js')
const ethers = require('ethers')
const utils = require('../services/utils')

// constants
const MAX_UINT = ethers.constants.MaxUint256;
const MULTI = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';

export default class Balancer {
  constructor (network = 'kovan') {
    // network defaults to kovan
    const providerUrl = `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    this.network = network
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)

    if (network === 'kovan') {
      this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens_kovan.json'))
      this.exchangeProxy = '0x6317C5e82A06E1d8bf200d21F4510Ac2c038AC81'
    } else if (network === 'mainnet') {
      this.erc20Tokens = JSON.parse(fs.readFileSync('src/static/erc20_tokens.json'))
      this.exchangeProxy = '0x3208a3E3d5b0074D69E0888B8618295B9D6B13d3'
    } else {
      throw Error(`Invalid network ${network}`)
    }
  }

  async getSwaps (tokenIn, tokenOut, amount) {
    const data = await sor.getPoolsWithTokens(tokenIn, tokenOut)

    let poolData
    if (this.network === 'mainnet') {
      poolData = await sor.parsePoolDataOnChain(data.pools, tokenIn, tokenOut, MULTI, this.provider)
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

  async batchSwapExactIn (wallet, swaps, tokenIn, tokenOut, amount) {
    console.log(swaps, tokenIn, tokenOut, amount, '0')
    const contract = new ethers.Contract(exchangeProxy, utils.BalancerExchangeProxyAbi, wallet)
    const totalAmountOut = await contract.batchSwapExactIn(swaps, tokenIn, tokenOut, amount, '0')
    console.log(totalAmountOut)
    return totalAmountOut
  }
}
