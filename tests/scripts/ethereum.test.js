// Example: https://github.com/balancer-labs/balancer-sor/blob/master/test/multihop-sor.spec.ts
import YAML from 'yaml';
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import { assert } from 'chai';

const GlobalConfigFilePath = 'conf/global_conf.yml'; // assume run from root dir
const file = fs.readFileSync(GlobalConfigFilePath, 'utf8');
const config = YAML.parseDocument(file);

const host = 'localhost';
const port = 5000;
const privateKey = process.env.PRIVATE_KEY;

// constants
const ALLOWANCE = 5000000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const httpsAgent = axios.create({
  httpsAgent: new https.Agent({
    ca: fs.readFileSync(config.get('CERT_PATH') + '/ca_cert.pem'),
    cert: fs.readFileSync(config.get('CERT_PATH') + '/client_cert.pem'),
    key: fs.readFileSync(config.get('CERT_PATH') + '/client_key.pem'),
    host: host,
    port: port,
    requestCert: true,
    rejectUnauthorized: false,
  }),
});

export async function request(method, path, params) {
  try {
    let response;
    const gatewayAddress = `https://${host}:${port}`;
    if (method === 'get') {
      response = await httpsAgent.get(gatewayAddress + path, {
        params: params,
      });
    } else {
      // post
      params['privateKey'] = privateKey;
      response = await httpsAgent.post(gatewayAddress + path, params);
    }
    return response.data;
  } catch (err) {
    console.log(`${path} - ${err}`);
  }
}

export async function ethTests(connector = null, tokens = []) {
  console.log('\nStarting ETH tests');
  console.log('***************************************************');
  console.log('Token symbols used in tests: ', tokens);
  assert.isAtLeast(tokens.length, 2, 'Pls provide at least 2 tokens');
  assert.exists(privateKey, 'Pls set PRIVATE_KEY in environment variable');

  // call /
  console.log('Checking status of gateway server...');
  const result = await request('get', '/', {});
  // confirm expected response
  console.log(result);
  assert.equal(result, 'ok');

  // call /balances
  console.log('Checking balances...');
  const balancesResponse = await request('post', '/eth/balances', {
    tokenList: JSON.stringify(tokens),
  });
  // confirm and save balances
  const balances = balancesResponse.balances;
  console.log(balances);
  assert.isAbove(
    parseFloat(balances.ETH),
    0,
    'Pls ensure there is some native token'
  );

  // call /balances with invalid token symbol
  // confirm expected error message
  console.log('calling balances with invalid token symbols ABC and XYZ...');
  const balancesResponse1 = await request('post', '/eth/balances', {
    tokenList: JSON.stringify(['ABC', 'XYZ']),
  });
  console.log(balancesResponse1.balances);
  assert.isNaN(
    parseFloat(balancesResponse1.balances.ABC),
    'ABC is a valid token.'
  );
  assert.isNaN(
    parseFloat(balancesResponse1.balances.XYZ),
    'XYZ is a valid token.'
  );

  // call /allowances
  // confirm and save allowances
  console.log('checking initial allowances...');
  const allowancesResponse1 = await request('post', '/eth/allowances', {
    tokenList: JSON.stringify(tokens),
    connector: connector,
  });
  let allowances = allowancesResponse1.approvals;
  console.log(allowances);

  for (let token of tokens) {
    // call /approve on each token
    console.log(`Resetting allowance for ${token} to ${ALLOWANCE}...`);
    let approve1 = await request('post', '/eth/approve', {
      token: token,
      connector: connector,
      amount: ALLOWANCE.toString(),
    });
    console.log(approve1);
    while (allowances[token] !== approve1.amount) {
      console.log(
        'Waiting for atleast 1 block time (i.e 13 secs) to give time for approval to be mined.'
      );
      await sleep(13000);
      // confirm that allowance changed correctly
      console.log('Rechecking allowances to confirm approval...');
      let allowancesResponse2 = await request('post', '/eth/allowances', {
        tokenList: JSON.stringify(tokens),
        connector: connector,
      });
      allowances = allowancesResponse2.approvals;
      console.log(allowances);
    }
  }

  // call /approve with invalid spender address
  console.log('Trying to approve for invalid contract...');
  const approve3 = await request('post', '/eth/approve', {
    token: tokens[0],
    connector: 'nill',
  });
  console.log(approve3);
  // confirm expected error message
  assert.notExists(approve3);

  // call /approve with invalid token symbol
  console.log('Trying to approve invalid token ABC...');
  const approve4 = await request('post', '/eth/approve', {
    token: 'ABC',
    connector: connector,
  });
  console.log(approve4);
  // confirm expected error message
  assert.notExists(approve4);

  // call /approve with invalid amount
  console.log('Trying to approve invalid amount...');
  const approve5 = await request('post', '/eth/approve', {
    token: tokens[0],
    connector: connector,
    amount: 'number',
  });
  console.log(approve5);
  // confirm expected error message
  assert.notExists(approve5);
}
