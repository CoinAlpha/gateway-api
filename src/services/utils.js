/*
  Hummingbot Utils
*/
const lodash = require('lodash')
const fs = require('fs')
const path = require('path')

const configFilePath = '../../data/gateway_config.json'
export const gatewayConfig = require(configFilePath)

const PROTOCOL = require('../static/protocol.json')

export const statusMessages = {
  ssl_cert_required: 'SSL Certificate required',
  ssl_cert_invalid: 'Invalid SSL Certificate',
  operation_error: 'Operation Error',
  no_pool_available: 'No Pool Available',
  invalid_token_symbol: 'Invalid Token Symbol',
}

export const latency = (startTime, endTime) => parseFloat((endTime - startTime) / 1000)

export const isValidParams = (params) => {
  const values = Object.values(params)
  for (let i = 0; i < values.length; i++) { // DO NOT use forEach, it returns callback without breaking the loop
    if (typeof values[i] === 'undefined') {
      throw new Error('Invalid input params')
    }
  }
  return true
}

export const isValidData = (data, format) => {
  if (typeof data !== 'undefined' && Object.keys(data).length !== 0 && lodash.isEqual(Object.keys(data).sort(), format.sort())) {
    return true
  }
  return false
}

export const getParamData = (data, format = null) => {
  const dataObject = {}
  if (format !== null) {
    if (isValidData(data, format)) {
      format.forEach((key, index) => {
        dataObject[key] = data[key]
      })
    }
  } else {
    Object.keys(data).forEach((key, index) => {
      dataObject[key] = data[key]
    })
  }
  return dataObject
}

export const splitParamData = (param, separator = ',') => {
  const dataArray = param.split(separator)
  return dataArray
}

export const getSymbols = (tradingPair) => {
  const symbols = tradingPair.split('-')
  const baseQuotePair = {
    base: symbols[0].toUpperCase(),
    quote: symbols[1].toUpperCase()
  }
  return baseQuotePair
}

export const reportConnectionError = (res, error) => {
  res.json({
    error: error.errno,
    code: error.code,
  })
}

export const strToDecimal = (str) => parseInt(str) / 100;

export const getHummingbotMemo = () => {
  const prefix = 'hbot'
  const clientId = process.env.HUMMINGBOT_CLIENT_ID || loadConfig().CLIENT_ID
  const memo = clientId ? [prefix, clientId].join('-') : prefix
  return memo
}

export const loadConfig = (data) => {
  let config = null // reset cache
  config = require(configFilePath)
  return config
}

export const updateConfig = (data) => {
  const config = gatewayConfig
  Object.keys(data).forEach(key => {
    // standardize chain name & value
    let value = data[key]
    switch (key) {
      case 'ethereum_chain_name':
        if (value.toUpperCase() === 'MAIN_NET') {
          value = 'mainnet'
        } else {
          value = value.toLowerCase()
        }
        break;
      case 'terra_chain_name':
        if (value.toUpperCase() === 'MAIN_NET') {
          value = PROTOCOL.TERRA.CHAIN_NAME
          config.TERRA_LCD_URL = PROTOCOL.TERRA.LCD_URL
        } else if (value.toUpperCase() === 'TEST_NET') {
          value = PROTOCOL.TERRA.CHAIN_NAME_TESTNET
          config.TERRA_LCD_URL = PROTOCOL.TERRA.LCD_URL_TESTNET
        }
        break;
      default:
        break
    }
    config[key.toUpperCase()] = value
  })
  Object.assign(config, {
    UPDATED: new Date().toISOString()
  })
  fs.writeFile(path.resolve(__dirname, configFilePath), JSON.stringify(config, null, 2), err => {
    if (err) throw err
  })
  return true
}
