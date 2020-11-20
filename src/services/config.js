require('dotenv').config()

const defaultMemo = ''

export const getConfig = () => {
  const env = {
    TERRA: {
      LCD_URL: process.env.TERRA_LCD_URL,
      NETWORK: process.env.TERRA_NETWORK,
      MEMO: process.env.TERRA_MEMO || defaultMemo
    },
    BALANCER: {
      NETWORK: process.env.BALANCER_NETWORK,
      REACT_APP_SUBGRAPH_URL: process.env.REACT_APP_SUBGRAPH_URL,
      EXCHANGE_PROXY: process.env.EXCHANGE_PROXY,
      GAS_PRICE: parseInt(process.env.GAS_PRICE),
      GAS_LIMIT: parseInt(process.env.GAS_LIMIT) || 1200000,
      APPROVAL_GAS_LIMIT: parseInt(process.env.APPROVAL_GAS_LIMIT) || 100000,
      MEMO: process.env.BALANCER_MEMO || defaultMemo
    },
    ETHEREUM: {
      RPC_URL: process.env.ETHEREUM_RPC_URL,
    },
    uniswap: {

    },
    celo: {
    }
  }
  return env
}
