require('dotenv').config()

export const getConfig = () => {
  const env = {
    terra: {
      TERRA_LCD_URL: process.env.TERRA_LCD_URL,
      TERRA_CHAIN: process.env.TERRA_LCD_URL,
    },
    balancer: {
      BALANCER_NETWORK: process.env.BALANCER_NETWORK,
      REACT_APP_SUBGRAPH_URL: process.env.REACT_APP_SUBGRAPH_URL,
      EXCHANGE_PROXY: process.env.EXCHANGE_PROXY,
      GAS_PRICE: parseInt(process.env.GAS_PRICE),
      GAS_LIMIT: parseInt(process.env.GAS_LIMIT) || 1200000,
      APPROVAL_GAS_LIMIT: parseInt(process.env.APPROVAL_GAS_LIMIT) || 100000
    },
    ethereum: {
      ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    }
  }
  return env
}
