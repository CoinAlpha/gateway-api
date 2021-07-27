// Example: https://github.com/balancer-labs/balancer-sor/blob/master/test/multihop-sor.spec.ts
import YAML from 'yaml';
import fs from 'fs';

const GlobalConfigFilePath = 'conf/global_conf.yml'; // assume run from root dir
const file = fs.readFileSync(GlobalConfigFilePath, 'utf8');
const config = YAML.parseDocument(file);

const tokens = ['WETH', 'DAI', 'MKR', 'USDC'];
const privateKey = config.get('PRIVATE_KEY');

async function ethTests() {
  console.log(tokens);
  console.log(privateKey);

  // call /
  // confirm expected response

  // call /balances
  // confirm that token balances are equal to initial

  // call /allowances
  // confirm that token allowances are equal to initial

  // call /approve on WETH
  // confirm that allowance changed
}

async function uniTests() {
  // call /start
  // call /gas-limit

  // call with different combinations of tokens:
  // price buy
  // price sell
  // trade buy
  // trade sell
}

ethTests();
uniTests();
