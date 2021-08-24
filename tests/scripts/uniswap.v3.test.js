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
let tokens = ['COIN1', 'COIN3'];
const tier = 'MEDIUM';
const privateKey = config.get('PRIVATE_KEY');

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

async function request(method, path, params) {
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

async function ethTests() {
  console.log(tokens);
  assert.isAtLeast(tokens.length, 2, 'Pls provise atlease 2 tokens');
  assert.exists(privateKey, 'Pls include PRIVATE_KEY in conf file');

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
  console.log('checking allowances...');
  const allowancesResponse1 = await request('post', '/eth/allowances', {
    tokenList: JSON.stringify(tokens),
    connector: 'uniswapV3NFTManager',
  });
  let allowances = allowancesResponse1.approvals;
  console.log(allowances);

  for (let token of tokens) {
    // call /approve on each token
    console.log(`Approving 5000 ${token}...`);
    let approve1 = await request('post', '/eth/approve', {
      token: token,
      connector: 'uniswapV3NFTManager',
      amount: '5000',
    });
    console.log(approve1);
    while (allowances[token] !== approve1.amount) {
      console.log(
        'Waiting for atleast 1 block time to give time for approval to be mined.'
      );
      await sleep(13000);
      // confirm that allowance changed correctly
      console.log('Rechecking allowances to confirm approval...');
      let allowancesResponse2 = await request('post', '/eth/allowances', {
        tokenList: JSON.stringify(tokens),
        connector: 'uniswapV3NFTManager',
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
    connector: 'uniswapV3NFTManager',
  });
  console.log(approve4);
  // confirm expected error message
  assert.notExists(approve4);

  // call /approve with invalid amount
  console.log('Trying to approve invalid amount...');
  const approve5 = await request('post', '/eth/approve', {
    token: tokens[0],
    connector: 'uniswapV3NFTManager',
    amount: 'number',
  });
  console.log(approve5);
  // confirm expected error message
  assert.notExists(approve5);
}

async function unitTests() {
  // call /start
  let pair = `${tokens[0]}-${tokens[1]}`;
  console.log(`Starting Uniswap v3 on pair ${pair}...`);
  const start = await request('get', '/eth/uniswap/v3/start', {
    pairs: JSON.stringify([pair]),
  });
  console.log(start);
  pair = start.pairs[0];
  tokens = pair.split('-');

  // call /gas-limit
  console.log('Calling uniswap v3 gas-limit endpoint...');
  const gasLimit = await request('post', '/eth/uniswap/v3/gas-limit', {});
  console.log(gasLimit);

  // mid price
  console.log(`Checking mid price for ${pair} on the ${tier} fee tier...`);
  const midPrice = await request('post', '/eth/uniswap/v3/price', {
    base: tokens[0],
    quote: tokens[1],
    seconds: '1',
    tier: tier,
  });
  console.log(`Mid price: ${midPrice.prices[0]}`);

  // add position
  console.log(`Adding position on ${tier} fee tier for ${pair}...`);
  const pid = await request('post', '/eth/uniswap/v3/add-position', {
    token0: tokens[0],
    token1: tokens[1],
    lowerPrice: midPrice.prices[0],
    upperPrice: parseFloat(midPrice.prices[0]) +  1,
    amount0: '0.01',
    amount1: '0.01',
    fee: tier,
  });
  assert.hasAnyKeys(pid, ['hash'], 'Add position failed.');
  console.log(`New position transaction hash - ${pid.hash}`);
  await sleep(60000); // sleep for 1 minute to give some time for provider to see transaction
  let done = false;
  let tx1, tx2, tid;
  while (!done) {
    tx1 = await request('post', '/eth/poll', { txHash: pid.hash });
    console.log(tx1);
    done = tx1.confirmed;
  }
  if (done) {
    // parse transaction log - /eth/uniswap/v3/result
    const parsedLog = await request('post', '/eth/uniswap/v3/result', {
      logs: JSON.stringify(tx1.receipt.logs),
      pair: pair,
    });
    for (let inf of  parsedLog.info) {
      if (inf.name === 'IncreaseLiquidity') {
        for (let evt of inf.events) {
          if (evt.name === 'tokenId') {
            tid = evt.value;
            console.log(`New lp order id: ${tid}`)
          }
        }
      }
    }
  }
  assert.equal(tx1.receipt.status, 1, 'Position transaction reverted.');

  done = false;

  // close position
  console.log(`Closing position with id ${tid}...`);
  const closePid = await request('post', '/eth/uniswap/v3/remove-position', {
    tokenId: tid,
    getFee: 'false',
  });
  assert.hasAnyKeys(closePid, ['hash'], 'Close position transaction failed.');
  console.log(`close position transaction hash - ${closePid.hash}`);
  await sleep(60000); // sleep for 1 minute to give some time for provider to see transaction
  while (!done) {
    tx2 = await request('post', '/eth/poll', { txHash: closePid.hash });
    console.log(tx2);
    done = tx2.confirmed;
  }
  if (done) {
    // parse transaction log - /eth/uniswap/v3/result
    const parsedLog2 = await request('post', '/eth/uniswap/v3/result', {
      logs: JSON.stringify(tx2.receipt.logs),
      pair: pair,
    });
    for (let inf of  parsedLog2.info) {
      if (inf.name === 'DecreaseLiquidity') {
        for (let evt of inf.events) {
          if (evt.name === 'tokenId') {
            assert.equal(evt.value, tid);
            console.log(`Lp order with id ${tid} removed.`);
          }
        }
      }
    }
  }
  assert.equal(tx2.receipt.status, 1, 'Close position transaction reverted.');
}

(async () => {
  await ethTests();
  await unitTests();
})();
