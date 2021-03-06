import bn from 'bignumber.js';
import { BigNumber } from 'ethers';

const math = require('mathjs');
const TICK_SPACINGS = { LOW: 10, MEDIUM: 60, HIGH: 2000 };

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// returns the sqrt price as a 64x96
export function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

export function getTickFromPrice(price, tier, side) {
  var tick = 0;
  if (side === 'UPPER') {
    tick =
      math.ceil(math.log(price, 1.0001) / TICK_SPACINGS[tier]) *
      TICK_SPACINGS[tier];
  } else {
    tick =
      math.floor(math.log(price, 1.0001) / TICK_SPACINGS[tier]) *
      TICK_SPACINGS[tier];
  }

  if (tick >= getMaxTick(tier)) {
    return getMaxTick(tier);
  } else if (tick <= getMinTick(tier)) {
    return getMinTick(tier);
  } else {
    return tick;
  }
}

export function getMinTick(tier) {
  return Math.ceil(-887272 / TICK_SPACINGS[tier]) * TICK_SPACINGS[tier];
}

export function getMaxTick(tier) {
  return Math.floor(887272 / TICK_SPACINGS[tier]) * TICK_SPACINGS[tier];
}
