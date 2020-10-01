/*
  Hummingbot Utils
*/
const lodash = require('lodash')
const debug = require('debug')('router')

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
  if (typeof data !== 'undefined' && Object.keys(data).length !== 0 && lodash.isEqual(Object.keys(data), format)) {
    return true
  }
  return false
}

export const getParamData = (data, format) => {
  debug(data, format)
  const dataObject = {}
  if (isValidData(data, format)) {
    format.forEach((key, index) => {
      dataObject[key] = data[key]
    })
  } else {
    throw new Error('Invalid input param data')
  }
  return dataObject
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
