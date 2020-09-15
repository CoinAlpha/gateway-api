const express = require('express');
const router = express.Router();
const BigNumber = require('bignumber.js');

const LCDClient = require("@terra-money/terra.js").LCDClient
const Coin = require("@terra-money/terra.js").Coin
// const MsgSend = require("@terra-money/terra.js").MsgSend
// const mnemonicKey = require("@terra-money/terra.js").MnemonicKey
// Terra.js includes Dec and Int, which represent decimal numbers and integer numbers, in a Cosmos-SDK compatible way.
const Dec = require("@terra-money/terra.js").Dec
const Int = require("@terra-money/terra.js").Int

const TerraKRW = 'ukrw'
const TerraUSD = 'uusd'
const TerraSDT = 'usdr'
const TerraLUNA = 'uluna'

const unit_multiplier = BigNumber('1e+6')

const utils = require('../hummingbot/utils')

// load environment config
const network = 'terra'
const lcdUrl = process.env.TERRA_LCD_URL;
const chain = process.env.TERRA_CHAIN;

/**
 * Connect to network
 */
function connect() {
  terra = new LCDClient({
    URL: lcdUrl,
    chainID: chain,
  })

  // To use LocalTerra
  // const terra = new LCDClient({
  //   URL: 'http://localhost:1317',
  //   chainID: 'localterra'
  // })

  return terra
}

router.use((req, res, next) => {
  console.log('terra route:', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Terra')
})

router.get('/status', async (req, res) => {

  const terra = connect()

  const marketParams = await terra.market.parameters();
  res.status(200).json({
    network: network,
    chain: chain,
    timestamp: Date.now(),
    market_params: marketParams
  })
})

router.get('/exchange_rates', async (req, res) => {

  const initTime = Date.now()

  const terra = connect()
  const exchangeRates = await terra.oracle.exchangeRates();

  const usdRate = exchangeRates.get('uusd')
  const krwRate = exchangeRates.get('ukrw')
  const sdrRate = exchangeRates.get('usdr')

  let ust_krt_Rate, sdt_krt_Rate, ust_sdt_Rate

  // console.log(usdRate)
  // console.log(usdRate.amount)
  // console.log(sdrRate.amount)

  // get the current swap rate
  const swap_amount = unit_multiplier.toString()
  await terra.market.swapRate(new Coin(TerraUSD, swap_amount), TerraKRW).then(c => {
    ust_krt_Rate = Number(c.toString().replace(TerraKRW, ''))/unit_multiplier
  });
  await terra.market.swapRate(new Coin(TerraSDT, swap_amount), TerraKRW).then(c => {
    sdt_krt_Rate = Number(c.toString().replace(TerraKRW, ''))/unit_multiplier
  });
  await terra.market.swapRate(new Coin(TerraUSD, swap_amount), TerraSDT).then(c => {
    ust_sdt_Rate = Number(c.toString().replace(TerraSDT, ''))/unit_multiplier
  });


  let exchange_rates = {
    'LUNA-USD': Number(usdRate.amount),
    'LUNA-KRW': Number(krwRate.amount),
    'UST-KRT': ust_krt_Rate,
    'SDT-KRT': sdt_krt_Rate,
    'UST-SDT': ust_sdt_Rate
  }

  res.status(200).json({
    network: network,
    chain: chain,
    timestamp: initTime,
    latency: utils.latency(initTime, Date.now()),
    exchange_rates: exchange_rates
  })

})

module.exports = router;
