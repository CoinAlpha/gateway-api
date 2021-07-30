// Example: https://github.com/balancer-labs/balancer-sor/blob/master/test/multihop-sor.spec.ts
import YAML from 'yaml';
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import { assert, expect } from 'chai';

const GlobalConfigFilePath = 'conf/global_conf.yml'; // assume run from root dir
const file = fs.readFileSync(GlobalConfigFilePath, 'utf8');
const config = YAML.parseDocument(file);

const tokens = ['WETH', 'DAI', 'MKR', 'USDC'];
const privateKey = config.get('PRIVATE_KEY');

const httpsAgent = axios.create({
  httpsAgent: new https.Agent({
    ca: fs.readFileSync(config.get('CERT_PATH') + "/ca_cert.pem"),
    cert: fs.readFileSync(config.get('CERT_PATH') + "/client_cert.pem"),
    key: fs.readFileSync(config.get('CERT_PATH') + "/client_key.pem"),
    rejectUnauthorized: false
  })
});

async function request(method, path, params) {
  try {
    let response;
    const gatewayAddress = "https://localhost:5000";
    if (method === "get") {
      response = await httpsAgent.get(gatewayAddress + path, params);
    } else { // post
        params.privateKey = privateKey;
        response = await httpsAgent.post(gatewayAddress + path, params);
    }
    return response.data;
  } catch (err) {
    console.log(`${path}-${err}`)
  }
}

describe('Tests Ethereum endpoints', () => {
    it('Tests Ethereum endpoints', async () => {

    })
  });
async function ethTests() {
  // console.log(tokens);
  // console.log(privateKey);

  // call /
  const result = await request("get", "/", {});
  // confirm expected response
  test('responseOfRootEndpoint', () => {
    expect(result).toEqual("ok");
  })

  // call /balances
  const balancesResponse1 = await request("post", "/eth/balances", {tokenList: tokens});
  // confirm and save balances
  //console.log(balanceResponse)
  const balances = {};
  balances["ZERO"] = "0";

  // call /balances with invalid token symbol
  // confirm expected error message

  // call /allowances
  // confirm and save allowances
  const allowances = {};
  const allowancesResponse1 = await request("post", "/eth/allowances", {tokenList: tokens, connector: "uniswap"});
  allowances["ZERO"] = "0";

  // call /balances with invalid token symbol
  const balancesResponse2 = await request("post", "/eth/balances", {tokenList: ["ABC", "XYZ"]});
  // confirm expected error message

  // call /approve on each token
  const approve1 = await request("post", "/eth/approve", {token: tokens[0], connector: "uniswap", amount: 5});
  // confirm that allowance changed correctly
  const allowancesResponse2 = await request("post", "/eth/allowances", {tokenList: tokens, connector: "uniswap"});

  // call /approve with invalid spender address
  const approve2 = await request("post", "/eth/approve", {token: tokens[0], connector: "nill", amount: 5});
  // confirm expected error message

  // call /approve with invalid token symbol
  const approve3 = await request("post", "/eth/approve", {token: "ABC", connector: "uniswap", amount: 5});
  // confirm expected error message

  // call /approve with invalid amount
  const approve4 = await request("post", "/eth/approve", {token: tokens[0], connector: "uniswap", amount: -5});
  // confirm expected error message
}

async function uniTests() {
  // call /start
  const start = await request("get", "/eth/uniswap/start", {pairs: [`${tokens[0]}-${tokens[1]}`]});
  // call /gas-limit
  const gasLimit = await request("post", "/eth/uniswap/gas-limit", {});

  // generate all posible unique combinations of tokens

  // call with different combinations of tokens:
  // price buy

  // price sell
  // trade buy
  // trade sell

  // add tests for extreme values of limitPrice - buy and sell

  // add tests for extreme values of minimumSlippage

}

//Promise.resolve();
ethTests()
uniTests()
