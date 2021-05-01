import { Response } from 'express';

/*
  Hummingbot Utils
*/
const lodash = require('lodash');
const moment = require('moment');

export const statusMessages = {
  ssl_cert_required: 'SSL Certificate required',
  ssl_cert_invalid: 'Invalid SSL Certificate',
  operation_error: 'Operation Error',
  no_pool_available: 'No Pool Available',
  invalid_token_symbol: 'Invalid Token Symbol',
  insufficient_reserves: 'Insufficient Liquidity Reserves',
  page_not_found: 'Page not found. Invalid path',
};

export const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

export const getSymbols = (tradingPair: string) => {
  const [base, quote] = tradingPair.toUpperCase().split('-');
  return {
    base,
    quote,
  };
};

export const reportConnectionError = (
  res: Response,
  error: IConnectionError
) => {
  res.json({
    error: error.errno,
    code: error.code,
  });
};

export const getHummingbotMemo = () => {
  const prefix = 'hbot';
  const clientId = process.env.HUMMINGBOT_INSTANCE_ID;
  if (typeof clientId !== 'undefined' && clientId != null && clientId !== '') {
    return [prefix, clientId].join('-');
  }
  return prefix;
};

export const loadConfig = () => {
  const config = {
    ethereum_rpc_url: process.env.ETHEREUM_RPC_URL,
    ethereum_chain: process.env.ETHEREUM_CHAIN,
    exchange_proxy: process.env.EXCHANGE_PROXY,
    ethereum_token_list_url: process.env.ETHEREUM_TOKEN_LIST_URL,
    enable_eth_gas_station:
      process.env.ENABLE_ETH_GAS_STATION != null
        ? process.env.ENABLE_ETH_GAS_STATION.toLowerCase() == 'true'
        : false,
    eth_gas_station_gas_level: process.env.ETH_GAS_STATION_GAS_LEVEL,
    eth_gas_station_refresh_time:
      process.env.ETH_GAS_STATION_REFRESH_TIME != null
        ? parseFloat(process.env.ETH_GAS_STATION_REFRESH_TIME)
        : null,
    manual_gas_price:
      process.env.MANUAL_GAS_PRICE != null
        ? parseFloat(process.env.MANUAL_GAS_PRICE)
        : null,
    react_app_subgraph_url: process.env.REACT_APP_SUBGRAPH_URL,
    balancer_max_swaps:
      process.env.BALANCER_MAX_SWAPS != null
        ? parseInt(process.env.BALANCER_MAX_SWAPS)
        : null,
    uniswap_router: process.env.UNISWAP_ROUTER,
    terra_lcd_url: process.env.TERRA_LCD_URL,
    terra_chain: process.env.TERRA_CHAIN,
  };
  return config;
};

export const getLocalDate = () => {
  const gmtOffset = process.env.GMT_OFFSET;
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
