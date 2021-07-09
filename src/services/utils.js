/*
  Hummingbot Utils
*/
const config = require('./configuration_manager');
const lodash = require('lodash');
const moment = require('moment');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;
const { NonceManager } = require('@ethersproject/experimental');

export const statusMessages = {
  ssl_cert_required: 'SSL Certificate required',
  ssl_cert_invalid: 'Invalid SSL Certificate',
  operation_error: 'Operation Error',
  no_pool_available: 'No Pool Available',
  invalid_token_symbol: 'Invalid Token Symbol',
  insufficient_reserves: 'Insufficient Liquidity Reserves',
  page_not_found: 'Page not found. Invalid path',
  insufficient_fee: 'No enough native token to cover for gas.',
};

export const latency = (startTime, endTime) =>
  parseFloat((endTime - startTime) / 1000);

export const isValidParams = (params) => {
  const values = Object.values(params);
  for (let i = 0; i < values.length; i++) {
    // DO NOT use forEach, it returns callback without breaking the loop
    if (typeof values[i] === 'undefined') {
      throw new Error('Invalid input params');
    }
  }
  return true;
};

export const isValidData = (data, format) => {
  if (
    typeof data !== 'undefined' &&
    Object.keys(data).length !== 0 &&
    lodash.isEqual(Object.keys(data).sort(), format.sort())
  ) {
    return true;
  }
  return false;
};

export const getParamData = (data, format = null) => {
  const dataObject = {};
  if (format !== null) {
    if (isValidData(data, format)) {
      format.forEach((key, _index) => {
        dataObject[key] = data[key];
      });
    }
  } else {
    Object.keys(data).forEach((key, _index) => {
      dataObject[key] = data[key];
    });
  }
  return dataObject;
};

export const splitParamData = (param, separator = ',') => {
  const dataArray = param.split(separator);
  return dataArray;
};

export const getSymbols = (tradingPair) => {
  const symbols = tradingPair.split('-');
  const baseQuotePair = {
    base: symbols[0].toUpperCase(),
    quote: symbols[1].toUpperCase(),
  };
  return baseQuotePair;
};

export const reportConnectionError = (res, error) => {
  res.json({
    error: error.errno,
    code: error.code,
  });
};

export const strToDecimal = (str) => parseInt(str) / 100;

export const getHummingbotMemo = () => {
  const prefix = 'hbot';
  const clientId = globalConfig.getConfig('HUMMINGBOT_INSTANCE_ID');
  if (typeof clientId !== 'undefined' && clientId != null && clientId !== '') {
    return [prefix, clientId].join('-');
  }
  return prefix;
};

export const loadConfig = () => {
  return config.configManagerInstance.readAllConfigs();
};

export const updateConfig = (data) => {
  globalConfig.updateConfig(data);
  return true;
};

export const getLocalDate = () => {
  const gmtOffset = globalConfig.getConfig('GMT_OFFSET');
  let newDate = moment().format('YYYY-MM-DD hh:mm:ss').trim();
  if (
    typeof gmtOffset !== 'undefined' &&
    gmtOffset !== null &&
    gmtOffset !== ''
  ) {
    newDate = moment()
      .utcOffset(gmtOffset, false)
      .format('YYYY-MM-DD hh:mm:ss')
      .trim();
  }
  return newDate;
};

export const nonceManagerCache = {};

export const getNonceManager = async (signer) => {
  let key = await signer.getAddress();
  if (signer.provider) {
    key += (await signer.provider.getNetwork()).chainId;
  }
  let nonceManager = nonceManagerCache[key];
  if (typeof nonceManager === 'undefined') {
    nonceManager = new NonceManager(signer);
    nonceManagerCache[key] = nonceManager;
  }
  return nonceManager;
};
