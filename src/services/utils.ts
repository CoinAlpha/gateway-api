/*
  Hummingbot Utils
*/
import { Response, Error } from 'express';
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
  page_not_found: 'Page not found. Invalid path'
};

export const latency = (startTime: number, endTime: number): number =>
  parseFloat((endTime - startTime) / 1000);

export const isValidParams = (params: Record<any, any>): bool => {
  const values = Object.values(params);
  for (let i = 0; i < values.length; i++) {
    // DO NOT use forEach, it returns callback without breaking the loop
    if (typeof values[i] === 'undefined') {
      throw new Error('Invalid input params');
    }
  }
  return true;
};

export const isValidData = (
  data: Record<any, any>,
  format: Array<string>
): bool => {
  if (
    typeof data !== 'undefined' &&
    Object.keys(data).length !== 0 &&
    lodash.isEqual(Object.keys(data).sort(), format.sort())
  ) {
    return true;
  }
  return false;
};

export const getParamData = (
  data: Record<any, any>,
  format = null
): Record<any, any> => {
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

export const splitParamData = (
  param: string,
  separator = ','
): Array<string> => {
  const dataArray = param.split(separator);
  return dataArray;
};

export const getSymbols = (tradingPair: string): Record<string, string> => {
  const symbols = tradingPair.split('-');
  const baseQuotePair = {
    base: symbols[0].toUpperCase(),
    quote: symbols[1].toUpperCase()
  };
  return baseQuotePair;
};

export const reportConnectionError = (
  res: Response,
  error: Error
): Response => {
  res.json({
    error: error.errno,
    code: error.code
  });
};

export const strToDecimal = (str: string): number => parseInt(str) / 100;

export const getHummingbotMemo = (): string => {
  const prefix = 'hbot';
  const clientId = globalConfig.getConfig('HUMMINGBOT_INSTANCE_ID');
  if (typeof clientId !== 'undefined' && clientId != null && clientId !== '') {
    return [prefix, clientId].join('-');
  }
  return prefix;
};

export const loadConfig = (): any => {
  return config.configManagerInstance.readAllConfigs();
};

export const updateConfig = (data: Record<any, any>): bool => {
  globalConfig.updateConfig(data);
  return true;
};

export const getLocalDate = (): Date => {
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

export const getNonceManager = async (
  signer: string
): Promise<NonceManager> => {
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
