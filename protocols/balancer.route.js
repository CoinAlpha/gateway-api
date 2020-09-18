const express = require('express');
const router = express.Router();
const sor = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');
const ethers = require('ethers');

const MAX_UINT = ethers.constants.MaxUint256;
const utils = require('../hummingbot/utils')

// load environment config
const network = 'ethereum'
const providerUrl = process.env.INFURA_URL
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

// balancer settings
const multi = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
const tokenIn = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI
const tokenOut = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH

async function getSwaps() {
}

router.get('/', (req, res) => {
  res.status(200).send('Balancer')
})

router.get('/get-swaps', async (req, res) => {
  
  const initTime = Date.now()

  const data = await sor.getPoolsWithTokens(tokenIn, tokenOut);
  const poolData = await sor.parsePoolDataOnChain(data.pools, tokenIn, tokenOut, multi, provider);

  const sorSwaps = sor.smartOrderRouter(
      poolData,
      'swapExactIn',
      new BigNumber('10000000000000000000'),
      new BigNumber('10'),
      0
  );
  const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)
  const expectedOut = sor.calcTotalOutput(swaps, poolData)
  
  res.status(200).json({
    network: network,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    swaps: swaps,
    expectedOut: expectedOut
  })

})

module.exports = router;