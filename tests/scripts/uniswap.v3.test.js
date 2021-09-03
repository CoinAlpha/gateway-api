import { assert } from 'chai';
import { request, ethTests } from './ethereum.test';

// constants
const TOKENS = ['WETH', 'DAI'];
const AMOUNTS = [0.01, 0.01];
const TIER = 'MEDIUM';

async function unitTests() {
  // call /start
  let pair = `${TOKENS[0]}-${TOKENS[1]}`;
  console.log(`Starting Uniswap v3 on pair ${pair}...`);
  const start = await request('get', '/eth/uniswap/v3/start', {
    pairs: JSON.stringify([pair]),
  });
  console.log(start);
  pair = start.pairs[0];
  let tokens = pair.split('-');

  // call /gas-limit
  console.log('Calling uniswap v3 gas-limit endpoint...');
  const gasLimit = await request('post', '/eth/uniswap/v3/gas-limit', {});
  console.log(gasLimit);

  // mid price
  console.log(`Checking mid price for ${pair} on the ${TIER} fee tier...`);
  const midPrice = await request('post', '/eth/uniswap/v3/price', {
    base: tokens[0],
    quote: tokens[1],
    seconds: '1',
    tier: TIER,
  });
  console.log(`Mid price: ${midPrice.prices[0]}`);

  // check if pool exists on other 2 tiers
  let tiers = [ "LOW", "MEDIUM", "HIGH" ];
  tiers.pop(tiers.indexOf(TIER) - 1);
  for (let tr of tiers) {
    console.log(`Checking mid price for ${pair} on the ${tr} fee tier...`);
    let checkPrice = await request('post', '/eth/uniswap/v3/price', {
      base: tokens[0],
      quote: tokens[1],
      seconds: '1',
      tier: tr,
    });
    console.log(checkPrice)
  }


  // add position
  console.log(`Adding position on ${TIER} fee tier for ${pair}...`);
  const pid = await request('post', '/eth/uniswap/v3/add-position', {
    token0: tokens[0],
    token1: tokens[1],
    lowerPrice: midPrice.prices[0],
    upperPrice: parseFloat(midPrice.prices[0]) + 1,
    amount0: AMOUNTS[0].toString(),
    amount1: AMOUNTS[1].toString(),
    fee: TIER,
  });
  assert.hasAnyKeys(pid, ['hash'], 'Add position failed.');
  console.log(`New position transaction hash - ${pid.hash}`);
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
    for (let inf of parsedLog.info) {
      if (inf.name === 'IncreaseLiquidity') {
        for (let evt of inf.events) {
          if (evt.name === 'tokenId') {
            tid = evt.value;
            console.log(`New lp order id: ${tid}`);
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
    for (let inf of parsedLog2.info) {
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
  await ethTests('uniswapV3NFTManager', TOKENS);
  await unitTests();
})();
