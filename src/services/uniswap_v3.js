import { logger } from './logger';

const debug = require('debug')('router');
const math = require('mathjs');
const uni = require('@uniswap/sdk-core');
const uniV3 = require('@uniswap/v3-sdk');
const ethers = require('ethers');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const nftArtifact = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');
const routerArtifact = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json');
const poolArtifact = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json');

const abiDecoder = require('abi-decoder');

// constants
const FeeAmount = uniV3.FeeAmount;
const GAS_LIMIT = globalConfig.getConfig('UNISWAP_GAS_LIMIT') || 550688;
const UPDATE_PERIOD = globalConfig.getConfig('UNISWAP_UPDATE_PERIOD') || 300000; // stop updating pair after 5 minutes from last request
const MaxUint128 = ethers.BigNumber.from(2).pow(128).sub(1);

abiDecoder.addABI(nftArtifact.abi);
abiDecoder.addABI(routerArtifact.abi);

export default class UniswapV3 {
  constructor(network = 'mainnet') {
    this.providerUrl = globalConfig.getConfig('ETHEREUM_RPC_URL');
    this.network = globalConfig.getConfig('ETHEREUM_CHAIN');
    this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl);
    this.router = globalConfig.getConfig('UNISWAP_V3_ROUTER');
    this.nftManager = globalConfig.getConfig('UNISWAP_V3_NFT_MANAGER');
    this.core = globalConfig.getConfig('UNISWAP_V3_CORE');
    this.slippage = globalConfig.getConfig('UNISWAP_ALLOWED_SLIPPAGE');
    this.gasLimit = GAS_LIMIT;
    this.tokenList = {};
    this.abiDecoder = abiDecoder;

    switch (network) {
      case 'mainnet':
        this.chainID = 1;
        break;
      case 'kovan':
        this.chainID = 42;
        break;
      default: {
        const err = `Invalid network ${network}`;
        logger.error(err);
      }
    }
  }

  get_slippage() {
    const allowedSlippage =
      globalConfig.getConfig('UNISWAP_ALLOWED_SLIPPAGE') || 1.5;
    const slippage = math.fraction(allowedSlippage);
    return new uni.Percent(slippage.n, slippage.d * 100);
  }

  get_percent(rawPercent) {
    const slippage = math.fraction(rawPercent);
    return new uni.Percent(slippage.n, slippage.d * 100);
  }

  get_ttl() {
    const ttl = parseInt(globalConfig.getConfig('UNISWAP_TTL')) || 300;
    return Date.now() + ttl;
  }

  get_token(tokenInfo) {
    if (
      !Object.prototype.hasOwnProperty.call(this.tokenList, tokenInfo.address)
    ) {
      this.tokenList[tokenInfo.address] = new uni.Token(
        this.chainID,
        tokenInfo.address,
        tokenInfo.decimals,
        tokenInfo.symbol
      );
    }
    return this.tokenList[tokenInfo.address];
  }

  get_contract(contract, wallet) {
    if (contract === 'router') {
      return new ethers.Contract(this.router, routerArtifact.abi, wallet);
    } else {
      return new ethers.Contract(this.nftManager, nftArtifact.abi, wallet);
    }
  }

  async get_pool_state(poolAddress, fee, wallet) {
    const poolContract = new ethers.Contract(
      poolAddress,
      poolArtifact.abi,
      wallet
    );
    const minTick = uniV3.nearestUsableTick(
      uniV3.TickMath.MIN_TICK,
      uniV3.TICK_SPACINGS[fee]
    );
    const maxTick = uniV3.nearestUsableTick(
      uniV3.TickMath.MAX_TICK,
      uniV3.TICK_SPACINGS[fee]
    );
    const poolData = await Promise.allSettled([
      poolContract.liquidity(),
      poolContract.slot0(),
      poolContract.ticks(minTick),
      poolContract.ticks(maxTick),
    ]);

    return {
      liquidity: poolData[0].value,
      sqrtPriceX96: poolData[1].value[0],
      tick: poolData[1].value[1],
      observationIndex: poolData[1].value[2],
      observationCardinality: poolData[1].value[3],
      observationCardinalityNext: poolData[1].value[4],
      feeProtocol: poolData[1].value[5],
      unlocked: poolData[1].value[6],
      fee: parseInt(fee),
      tickProvider: [
        {
          index: minTick,
          liquidityNet: poolData[2].value[1],
          liquidityGross: poolData[2].value[0],
        },
        {
          index: maxTick,
          liquidityNet: poolData[3].value[1],
          liquidityGross: poolData[3].value[0],
        },
      ],
    };
  }

  async currentPrice(
    wallet,
    tokenInAddressInfo,
    tokenOutAddressInfo,
    tier,
    seconds
  ) {
    let fetchPrice = [],
      prices = [];
    const tokenIn = this.get_token(tokenInAddressInfo);
    const tokenOut = this.get_token(tokenOutAddressInfo);
    const poolContract = new ethers.Contract(
      uniV3.Pool.getAddress(tokenIn, tokenOut, FeeAmount[tier]),
      poolArtifact.abi,
      wallet
    );
    for (let x = seconds; x > 0; x--) {
      fetchPrice.push(poolContract.observe([x, x - 1]));
    }
    const request = await Promise.allSettled(fetchPrice);
    for (let twap = 0; twap < request.length; twap++) {
      if (request[twap].status === 'fulfilled') {
        prices.push(
          uniV3
            .tickToPrice(
              tokenIn,
              tokenOut,
              parseInt(
                request[twap].value.tickCumulatives[1].toNumber() -
                  request[twap].value.tickCumulatives[0].toNumber()
              )
            )
            .toFixed(8)
        );
      }
    }
    if (prices.length === 0) {
      throw "Pool doesn't exist";
    }
    return { price: prices[prices.length - 1], prices: prices };
  }

  /*
This swap section of this code is a duplicate of Uniswap v2 with little modification to most helper_functions.
Note that extending the uniswap v2 code may be possible in the future if uniswap v2 is updated to use the new uniswap/sdk-core library.
*/
  /////////////////////////////////////////////////////// Swap section
/*
  async get_pairs(firstToken, secondToken) {
    let poolDataRequests = [];
    let pools = [];
    try {
      for (let tier of ['LOW', 'MEDIUM', 'HIGH']) {
        let poolAddress = uniV3.Pool.getAddress(
          firstToken,
          secondToken,
          FeeAmount[tier]
        );
        poolDataRequests.push(
          this.get_pool_state(
            poolAddress,
            FeeAmount[tier],
            this.provider
          )
        );
      }
    } catch (err) {
      logger.error(err);
    }
    await Promise.allSettled(poolDataRequests).then((values) => {
      for (let position = 0; position < poolDataRequests.length; position++) {
        if (values[position].status === 'fulfilled') {
          try {
            let poolData = values[position].value;
            pools.push(new uniV3.Pool(
              firstToken,
              secondToken,
              poolData.fee,
              poolData.sqrtPriceX96.toString(),
              poolData.liquidity.toString(),
              poolData.tick,
              poolData.tickProvider
            ));
          } catch (err) {
            logger.error(err);
          }
        }
      }
    });
    return pools;
  }

  async priceSwapIn(tokenIn, tokenOut, tokenInAmount) {
    const tIn = this.get_token(tokenIn);
    const tOut = this.get_token(tokenOut);
    const tokenAmountIn = new uni.CurrencyAmount.fromRawAmount(
      tIn,
      ethers.utils.parseUnits(tokenInAmount, tIn.decimals)
    );
    const pools = await this.get_pairs(tIn, tOut);
    const trades = await uniV3.Trade.bestTradeExactIn(
      pools,
      tokenAmountIn,
      tOut,
      { maxHops: 1 }
    );
    let trade = trades[0]
    const expectedAmount = trade.minimumAmountOut(this.get_slippage());
    return { trade, expectedAmount };
  }

  async priceSwapOut(tokenIn, tokenOut, tokenOutAmount) {
    const tIn = this.get_token(tokenIn);
    const tOut = this.get_token(tokenOut);
    const tokenAmountOut = new uni.CurrencyAmount.fromRawAmount(
      tOut,
      ethers.utils.parseUnits(tokenOutAmount, tOut.decimals)
    );
    const pools = await this.get_pairs(tIn, tOut);
    const trades = await uniV3.Trade.bestTradeExactOut(
      pools,
      tIn,
      tokenAmountOut,
      { maxHops: 1 }
    );
    let trade = trades[0]
    const expectedAmount = trade.maximumAmountIn(this.get_slippage());
    return { trade, expectedAmount };
  }

  async swap(wallet, trade, tokenAddress, gasPrice) {
    const { calldata, value } = uniV3.SwapRouter.swapCallParameters(trade, {
      deadline: this.get_ttl(),
      recipient: wallet.signer.address,
      slippageTolerance: this.get_slippage(),
    });

    const contract = this.get_contract('router', wallet);
    const tx = await contract.multicall([calldata], {
      gasPrice: gasPrice * 1e9,
      gasLimit: GAS_LIMIT,
      value: value,
    });

    debug(`Tx Hash: ${tx.hash}`);
    return tx;
  }

  /////////////////////////////////////////////////// End of Swap section
*/
  //////////////////////////////////////////////////////////// LP section

  async getPosition(wallet, tokenId, eth, isRaw = false) {
    const contract = this.get_contract('nft', wallet);
    let requests = [contract.positions(tokenId)];
    if (!isRaw) requests.push(this.collectFees(wallet, tokenId, true));
    const positionInfo = await Promise.allSettled(requests);
    const position = positionInfo[0].value;
    if (isRaw) {
      return position;
    } else {
      const feeInfo = positionInfo[1].value;
      const token0 = this.get_token(
        eth.getERC20TokenByAddress(position.token0)
      );
      const token1 = this.get_token(
        eth.getERC20TokenByAddress(position.token1)
      );
      const fee = position.fee;
      const poolAddress = uniV3.Pool.getAddress(token0, token1, fee);
      const poolData = await this.get_pool_state(poolAddress, fee, wallet);
      const positionInst = new uniV3.Position({
        pool: new uniV3.Pool(
          token0,
          token1,
          poolData.fee,
          poolData.sqrtPriceX96.toString(),
          poolData.liquidity.toString(),
          poolData.tick
        ),
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: position.liquidity,
      });
      return {
        token0: token0.symbol,
        token1: token1.symbol,
        fee: Object.keys(FeeAmount).find(
          (key) => FeeAmount[key] === position.fee
        ),
        lowerPrice: positionInst.token0PriceLower.toFixed(8),
        upperPrice: positionInst.token0PriceUpper.toFixed(8),
        amount0: positionInst.amount0.toFixed(8),
        amount1: positionInst.amount1.toFixed(8),
        unclaimedToken0: ethers.utils.formatUnits(
          feeInfo.amount0.toString(),
          token0.decimals
        ),
        unclaimedToken1: ethers.utils.formatUnits(
          feeInfo.amount1.toString(),
          token1.decimals
        ),
      };
    }
  }

  getReduceLiquidityData(percent, tokenId, token0, token1, wallet) {
    return {
      tokenId: tokenId,
      liquidityPercentage: this.get_percent(percent),
      slippageTolerance: this.get_slippage(),
      deadline: this.get_ttl(),
      burnToken: false,  // percent == 100 ? true : false,
      collectOptions: {
        expectedCurrencyOwed0: new uni.CurrencyAmount.fromRawAmount(
          token0,
          ethers.utils.parseUnits('0', token0.decimals)
        ),
        expectedCurrencyOwed1: new uni.CurrencyAmount.fromRawAmount(
          token1,
          ethers.utils.parseUnits('0', token1.decimals)
        ),
        recipient: wallet.signer.address,
      },
    };
  }

  getAddLiquidityData(wallet, tokenId) {
    let extraData;
    const commonData = {
      slippageTolerance: this.get_slippage(),
      deadline: this.get_ttl(),
    };
    if (tokenId == 0) {
      extraData = { recipient: wallet.signer.address, createPool: true };
    } else {
      extraData = { tokenId: tokenId };
    }
    return { ...commonData, ...extraData };
  }

  async addPosition(
    wallet,
    token0,
    token1,
    amount0,
    amount1,
    fee,
    lowerPrice,
    upperPrice,
    tokenId = 0
  ) {
    const nftContract = this.get_contract('nft', wallet);
    const tokenIn = this.get_token(token0);
    const tokenOut = this.get_token(token1);
    const lowerPriceInFraction = math.fraction(lowerPrice);
    const upperPriceInFraction = math.fraction(upperPrice);
    const poolAddress = uniV3.Pool.getAddress(
      tokenIn,
      tokenOut,
      FeeAmount[fee]
    );
    const poolData = await this.get_pool_state(
      poolAddress,
      FeeAmount[fee],
      wallet
    );
    const position = uniV3.Position.fromAmounts({
      pool: new uniV3.Pool(
        tokenIn,
        tokenOut,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
      ),
      tickLower: uniV3.nearestUsableTick(
        uniV3.priceToClosestTick(
          new uni.Price(
            tokenIn,
            tokenOut,
            lowerPriceInFraction.d,
            lowerPriceInFraction.n
          )
        ),
        uniV3.TICK_SPACINGS[FeeAmount[fee]]
      ),
      tickUpper: uniV3.nearestUsableTick(
        uniV3.priceToClosestTick(
          new uni.Price(
            tokenIn,
            tokenOut,
            upperPriceInFraction.d,
            upperPriceInFraction.n
          )
        ),
        uniV3.TICK_SPACINGS[FeeAmount[fee]]
      ),
      amount0: ethers.utils.parseUnits(amount0, tokenIn.decimals),
      amount1: ethers.utils.parseUnits(amount1, tokenOut.decimals),
      useFullPrecision: true,
    });
    const callData = uniV3.NonfungiblePositionManager.addCallParameters(
      position,
      this.getAddLiquidityData(wallet, tokenId)
    );
    return await nftContract.multicall([callData.calldata], {
      value: callData.value,
      gasLimit: GAS_LIMIT,
    });
  }

  async reducePosition(
    wallet,
    tokenId,
    eth,
    decreasePercent = 100,
    getFee = false
  ) {
    // Reduce position and burn
    const contract = this.get_contract('nft', wallet);
    const positionData = await this.getPosition(wallet, tokenId, 0, true);
    const tokenIn = this.get_token(
      eth.getERC20TokenByAddress(positionData.token0)
    );
    const tokenOut = this.get_token(
      eth.getERC20TokenByAddress(positionData.token1)
    );
    const fee = positionData.fee;
    const poolAddress = uniV3.Pool.getAddress(tokenIn, tokenOut, fee);
    const poolData = await this.get_pool_state(poolAddress, fee, wallet);
    const position = new uniV3.Position({
      pool: new uniV3.Pool(
        tokenIn,
        tokenOut,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
      ),
      tickLower: positionData.tickLower,
      tickUpper: positionData.tickUpper,
      liquidity: positionData.liquidity,
    });
    const callData = uniV3.NonfungiblePositionManager.removeCallParameters(
      position,
      this.getReduceLiquidityData(
        decreasePercent,
        tokenId,
        tokenIn,
        tokenOut,
        wallet
      )
    );
    if (getFee) {
      return await contract.estimateGas.multicall([callData.calldata], {
        value: callData.value,
        gasLimit: GAS_LIMIT,
      });
    } else {
      return await contract.multicall([callData.calldata], {
        value: callData.value,
        gasLimit: GAS_LIMIT,
      });
    }
  }

  async collectFees(wallet, tokenId, isStatic = false) {
    const contract = this.get_contract('nft', wallet);
    const collectData = {
      tokenId: tokenId,
      recipient: wallet.signer.address,
      amount0Max: MaxUint128,
      amount1Max: MaxUint128,
    };
    return isStatic
      ? await contract.callStatic.collect(collectData, { gasLimit: GAS_LIMIT })
      : await contract.collect(collectData, { gasLimit: GAS_LIMIT });
  }
}
/////////////////////////////////////////////////////////// End of LP section
exports.default = UniswapV3;
