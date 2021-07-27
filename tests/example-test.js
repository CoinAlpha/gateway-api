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
  // confirm and save balances
  const balances = {};

  // call /balances with invalid token symbol
  // confirm expected error message

  // call /allowances
  // confirm and save allowances
  const allowances = {};

  // call /balances with invalid token symbol
  // confirm expected error message

  // call /approve on each token
  // confirm that allowance changed correctly

  // call /approve with invalid spender address
  // confirm expected error message

  // call /approve with invalid token symbol
  // confirm expected error message

  // call /approve with invalid amount
  // confirm expected error message
}

async function uniTests() {
  // call /start
  // call /gas-limit

  // call with different combinations of tokens:
  // price buy
  // price sell
  // trade buy
  // trade sell

  // add tests for extreme values of limitPrice - buy and sell

  // add tests for extreme values of minimumSlippage

}

ethTests();
uniTests();
