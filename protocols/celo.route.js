const express = require('express')
const router = express.Router()
const BigNumber = require('bignumber.js');

const spawn = require("child_process").spawn

const network = 'celo'
const celocli = 'celocli'
const celo_base = "CGLD"
const celo_quote = "CUSD"
const unit_multiplier = BigNumber('1e+18')

const utils = require('../hummingbot/utils')


router.use((req, res, next) => {
  console.log('celo route:', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Celo')
})

router.get('/status', (req, res) => {

  const nodeSync = spawn(celocli, ['node:synced']);

  nodeSync.stdout.on( 'data', sync => {
    console.log( `out_message: ${out_message}` )
  })

  nodeSync.stderr.on( 'data', error => {
    err_message = error.toString();
    console.log( `err_message: ${err_message}` )
  })

  nodeSync.on( 'close', code => {
    console.log( `code ${code}` )
    res.status(200).json({
      exit_code: code,
      sync: out_message,
      error: err_message
    })
  })
})

router.get('/exchange_rates', (req, res) => {

  const initTime = Date.now()

  const amount = unit_multiplier.toString()
  const separator = '=>'
  const nodeSync = spawn(celocli, ["exchange:show", "--amount", amount]);

  let err_message = [], out_message = []  

  nodeSync.stdout.on( 'data', out => {
    out_message.push(out.toString())
  })

  nodeSync.stderr.on( 'data', err => {
    err_message.push(err.toString())
  })

  nodeSync.on( 'close', code => {

    let exchange_rates = {}
  
    if (code === 0) {
      out_message.forEach(function (item, index) {
        if (item.includes(separator)) {
          rate = item.split(separator)
          base = rate[0].trim().split(' ')
          quote = rate[1].trim().split(' ')
          trading_pair = [base[1].toUpperCase(), quote[1].toUpperCase()].join('-')
          exchange_rates[trading_pair] = quote[0]/unit_multiplier
          endTime = Date.now()
        }
      })

      res.status(200).json({
        network: network,
        timestamp: initTime,
        latency: utils.latency(initTime, Date.now()),
        exchange_rates: exchange_rates,
        message: err_message
      })
    }
  })

})

module.exports = router
