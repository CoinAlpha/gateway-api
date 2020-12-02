import { getParamData, latency, reportConnectionError, statusMessages, loadConfig, updateConfig } from '../services/utils';

const express = require('express');

const router = express.Router();
const debug = require('debug')('router')

router.get('/', (req, res) => {
  const CONFIG = loadConfig()
  res.status(200).json({
    app: process.env.APPNAME,
    image: process.env.IMAGE,
    config: CONFIG,
    status: 'ok',
  });
})

router.post('/update-config', async (req, res) => {
  /*
    POST: /update-config
      x-www-form-urlencoded: {
        "ethereum_rpc_url": "https://remote_rpc_url....",
        "ethereum_chain_name": "MAIN_NET",
        "terra_lcd_url":"https://tequila-lcd.terra.dev"
        "terra_chain":"tequila-0004"
      }
    note: param can be set individually
  */
  const paramData = getParamData(req.body)

  try {
    if (paramData) {
      if (updateConfig(paramData)) {
        const config = loadConfig()
        // invalidate balancer/sor module cache
        Object.keys(require.cache).forEach(function (id) {
          const tokens = id.split('/')
          if (tokens.includes('@balancer-labs')) {
            console.log('deleting module cache', id)
            delete require.cache[id]
          }
        })
        res.status(200).json({
          config: config
        })
      } else {
        res.status(500).json({
          error: statusMessages.operation_error,
          message: 'Error updating config file'
        })
      }
    } else {
      res.status(500).json({
        error: statusMessages.operation_error,
        message: ''
      })
    }
  } catch (err) {
    let reason
    err.reason ? reason = err.reason : reason = statusMessages.operation_error
    res.status(500).json({
      error: reason,
      message: err
    })
  }
})

module.exports = router;
