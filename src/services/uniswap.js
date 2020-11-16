import Ethereum from '../services/eth';
const uni = require('@uniswap/sdk')
const ethers = require('ethers')
const proxyArtifact = require('../static/uniswap_v2_router_abi.json')
const debug = require('debug')('router')

const GAS_LIMIT = 1200000  //120000000

export default class Uniswap {
  constructor (network = 'kovan') {
    // network defaults to KOVAN
    const providerUrl = process.env.ETHEREUM_RPC_URL
    this.network = process.env.UNISWAP_NETWORK
    this.chainID = uni.ChainId.KOVAN
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.exchangeProxy = process.env.UNISWAP_PROXY

    if (network === 'kovan') {
      this.chainID = uni.ChainId.KOVAN
    } else if (network === 'mainnet') {
      this.chainID = uni.ChainId.MAINNET
    } else {
      throw Error(`Invalid network ${network}`)
    }
  }

  async fetch_route(tokenIn, tokenOut){
      var route, pair, pairOne, pairTwo
      var tIn = await uni.Fetcher.fetchTokenData(this.chainID, tokenIn)
      var tOut = await uni.Fetcher.fetchTokenData(this.chainID, tokenOut)

      try {
      pair = await uni.Fetcher.fetchPairData(tIn, tOut)
      route = new uni.Route([pair], tIn, tOut)
      }
      catch(err){
      console.log('Trying alternative/indirect route.')
      pairOne = await uni.Fetcher.fetchPairData(tIn, uni.WETH[this.chainID])
      pairTwo = await uni.Fetcher.fetchPairData(tOut, uni.WETH[this.chainID])
      route = new uni.Route([pairOne, pairTwo], tIn, tOut)
      }
      return route
  }

  async swapExactIn (wallet, route, tokenAddress, amountIn, gasPrice) {
    const tIn = await uni.Fetcher.fetchTokenData(this.chainID, tokenAddress)
    const tokenAmountIn = new uni.TokenAmount(tIn, amountIn)
    const result = uni.Router.swapCallParameters(
          uni.Trade.exactIn(route, tokenAmountIn),
          { ttl: 50, recipient: wallet.address, allowedSlippage: new uni.Percent('1', '100') }
        )

    const erc = new Ethereum(this.network)
    const approval = await erc.approveERC20(wallet, this.exchangeProxy, tokenAddress, ethers.utils.parseUnits(tokenAmountIn.toExact(), tIn.decimals), gasPrice)
    let confirmApproval = await approval.wait()  // Wait to ensure that approval transaction is mined
    debug(`Approval Hash: ${approval.hash}`);

    const contract = new ethers.Contract(this.exchangeProxy, proxyArtifact.abi, wallet)
    const tx = await contract.[result.methodName](
      ...result.args,
      {
        gasPrice: gasPrice * 1e9,
        gasLimit: GAS_LIMIT,
        value: result.value
      }
    )

    debug(`Tx Hash: ${tx.hash}`);
    const txObj = await tx.wait()
    return txObj
  }
}
