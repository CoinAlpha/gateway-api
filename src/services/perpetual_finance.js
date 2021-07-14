import { logger } from './logger';

const fetch = require('cross-fetch');

const Ethers = require('ethers');
const AmmArtifact = require('@perp/contract/build/contracts/Amm.json');
const ClearingHouseArtifact = require('@perp/contract/build/contracts/ClearingHouse.json');
const ClearingHouseViewerArtifact = require('@perp/contract/build/contracts/ClearingHouseViewer.json');
const TetherTokenArtifact = require('@perp/contract/build/contracts/TetherToken.json');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const GAS_LIMIT = 2123456;
const DEFAULT_DECIMALS = 18;
const CONTRACT_ADDRESSES = 'https://metadata.perp.exchange/';
const XDAI_PROVIDER =
  globalConfig.getConfig('XDAI_PROVIDER') || 'https://dai.poa.network';
const PNL_OPTION_SPOT_PRICE = 0;
const UPDATE_PERIOD = 60000; // stop updating prices after 30 secs from last request

export default class PerpetualFinance {
  constructor(network = 'mainnet') {
    this.providerUrl = XDAI_PROVIDER;
    this.network = network;
    this.provider = new Ethers.providers.JsonRpcProvider(this.providerUrl);
    this.gasLimit = GAS_LIMIT;
    this.contractAddressesUrl = CONTRACT_ADDRESSES;
    this.amm = {};
    this.priceCache = {};
    this.cacheExpirary = {};
    this.pairAmountCache = {};

    switch (network) {
      case 'mainnet':
        this.contractAddressesUrl += 'production.json';
        break;
      case 'kovan':
        this.contractAddressesUrl += 'staging.json';
        break;
      default: {
        const err = `Invalid network ${network}`;
        logger.error(err);
        throw Error(err);
      }
    }

    this.loadedMetadata = this.load_metadata();
  }

  async load_metadata() {
    try {
      const metadata = await fetch(this.contractAddressesUrl).then((res) =>
        res.json()
      );
      const layer2 = Object.keys(metadata.layers.layer2.contracts);

      for (var key of layer2) {
        if (metadata.layers.layer2.contracts[key].name === 'Amm') {
          this.amm[key] = metadata.layers.layer2.contracts[key].address;
        } else {
          this[key] = metadata.layers.layer2.contracts[key].address;
        }
      }

      this.layer2AmbAddr =
        metadata.layers.layer2.externalContracts.ambBridgeOnXDai;
      this.xUsdcAddr = metadata.layers.layer2.externalContracts.usdc;
      this.loadedMetadata = true;
      return true;
    } catch (err) {
      return false;
    }
  }

  async update_price_loop() {
    if (Object.keys(this.cacheExpirary).length > 0) {
      for (let pair in this.cacheExpirary) {
        if (this.cacheExpirary[pair] <= Date.now()) {
          delete this.cacheExpirary[pair];
          delete this.priceCache[pair];
        }
      }

      for (let pair in this.cacheExpirary) {
        let amm = new Ethers.Contract(
          this.amm[pair],
          AmmArtifact.abi,
          this.provider
        );
        await Promise.allSettled([
          amm.getInputPrice(0, {
            d: Ethers.utils.parseUnits(
              this.pairAmountCache[pair],
              DEFAULT_DECIMALS
            ),
          }),
          amm.getOutputPrice(0, {
            d: Ethers.utils.parseUnits(
              this.pairAmountCache[pair],
              DEFAULT_DECIMALS
            ),
          }),
        ]).then((values) => {
          if (!Object.prototype.hasOwnProperty.call(this.priceCache, pair)) {
            this.priceCache[pair] = [];
          }
          this.priceCache[pair][0] =
            this.pairAmountCache[pair] /
            Ethers.utils.formatUnits(values[0].value.d);
          this.priceCache[pair][1] =
            Ethers.utils.formatUnits(values[1].value.d) /
            this.pairAmountCache[pair];
        });
      }
    }
    setTimeout(this.update_price_loop.bind(this), 10000); // update every 10 seconds
  }

  // get XDai balance
  async getXdaiBalance(wallet) {
    try {
      const xDaiBalance = await wallet.getBalance();
      return Ethers.utils.formatEther(xDaiBalance);
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error xDai balance lookup');
      return reason;
    }
  }

  // get XDai USDC balance
  async getUSDCBalance(wallet) {
    try {
      const layer2Usdc = new Ethers.Contract(
        this.xUsdcAddr,
        TetherTokenArtifact.abi,
        wallet
      );
      let layer2UsdcBalance = await layer2Usdc.balanceOf(wallet.address);
      const layer2UsdcDecimals = await layer2Usdc.decimals();
      return Ethers.utils.formatUnits(layer2UsdcBalance, layer2UsdcDecimals);
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error balance lookup');
      return reason;
    }
  }

  // get  allowance
  async getAllowance(wallet) {
    // instantiate a contract and pass in provider for read-only access
    const layer2Usdc = new Ethers.Contract(
      this.xUsdcAddr,
      TetherTokenArtifact.abi,
      wallet
    );

    try {
      const allowanceForClearingHouse = await layer2Usdc.allowance(
        wallet.address,
        this.ClearingHouse
      );

      return Ethers.utils.formatUnits(
        allowanceForClearingHouse,
        DEFAULT_DECIMALS
      );
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error allowance lookup');
      return reason;
    }
  }

  // approve
  async approve(wallet, amount) {
    try {
      // instantiate a contract and pass in wallet
      const layer2Usdc = new Ethers.Contract(
        this.xUsdcAddr,
        TetherTokenArtifact.abi,
        wallet
      );
      const tx = await layer2Usdc.approve(
        this.ClearingHouse,
        Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS)
      );
      // TO-DO: We may want to supply custom gasLimit value above
      return tx.hash;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error approval');
      return reason;
    }
  }

  //open Position
  async openPosition(side, margin, levrg, pair, minBaseAmount, wallet) {
    try {
      const quoteAssetAmount = {
        d: Ethers.utils.parseUnits(margin, DEFAULT_DECIMALS),
      };
      const leverage = { d: Ethers.utils.parseUnits(levrg, DEFAULT_DECIMALS) };
      const minBaseAssetAmount = {
        d: Ethers.utils.parseUnits(minBaseAmount, DEFAULT_DECIMALS),
      };
      const clearingHouse = new Ethers.Contract(
        this.ClearingHouse,
        ClearingHouseArtifact.abi,
        wallet
      );
      const tx = await clearingHouse.openPosition(
        this.amm[pair],
        side,
        quoteAssetAmount,
        leverage,
        minBaseAssetAmount,
        { gasLimit: this.gasLimit }
      );
      return tx;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error opening position');
      return reason;
    }
  }

  //close Position
  async closePosition(wallet, pair, minimalQuote) {
    try {
      const minimalQuoteAsset = {
        d: Ethers.utils.parseUnits(minimalQuote, DEFAULT_DECIMALS),
      };
      const clearingHouse = new Ethers.Contract(
        this.ClearingHouse,
        ClearingHouseArtifact.abi,
        wallet
      );
      const tx = await clearingHouse.closePosition(
        this.amm[pair],
        minimalQuoteAsset,
        { gasLimit: this.gasLimit }
      );
      return tx;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error closing position');
      return reason;
    }
  }

  //get active position
  async getPosition(wallet, pair) {
    try {
      const positionValues = {};
      const clearingHouse = new Ethers.Contract(
        this.ClearingHouse,
        ClearingHouseArtifact.abi,
        wallet
      );
      let premIndex = 0;
      await Promise.allSettled([
        clearingHouse.getPosition(this.amm[pair], wallet.address),
        clearingHouse.getLatestCumulativePremiumFraction(this.amm[pair]),
        clearingHouse.getPositionNotionalAndUnrealizedPnl(
          this.amm[pair],
          wallet.address,
          Ethers.BigNumber.from(PNL_OPTION_SPOT_PRICE)
        ),
      ]).then((values) => {
        positionValues.openNotional = Ethers.utils.formatUnits(
          values[0].value.openNotional.d,
          DEFAULT_DECIMALS
        );
        positionValues.size = Ethers.utils.formatUnits(
          values[0].value.size.d,
          DEFAULT_DECIMALS
        );
        positionValues.margin = Ethers.utils.formatUnits(
          values[0].value.margin.d,
          DEFAULT_DECIMALS
        );
        positionValues.cumulativePremiumFraction = Ethers.utils.formatUnits(
          values[0].value.lastUpdatedCumulativePremiumFraction.d,
          DEFAULT_DECIMALS
        );
        premIndex = Ethers.utils.formatUnits(
          values[1].value.d,
          DEFAULT_DECIMALS
        );
        positionValues.pnl = Ethers.utils.formatUnits(
          values[2].value.unrealizedPnl.d,
          DEFAULT_DECIMALS
        );
        positionValues.positionNotional = Ethers.utils.formatUnits(
          values[2].value.positionNotional.d,
          DEFAULT_DECIMALS
        );
      });

      positionValues.entryPrice = Math.abs(
        positionValues.openNotional / positionValues.size
      );
      positionValues.fundingPayment =
        (premIndex - positionValues.cumulativePremiumFraction) *
        positionValues.size; // * -1
      return positionValues;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error getting active position');
      return reason;
    }
  }

  //get active margin
  async getActiveMargin(wallet) {
    try {
      const clearingHouseViewer = new Ethers.Contract(
        this.ClearingHouseViewer,
        ClearingHouseViewerArtifact.abi,
        wallet
      );
      const activeMargin =
        await clearingHouseViewer.getPersonalBalanceWithFundingPayment(
          this.xUsdcAddr,
          wallet.address
        );
      return activeMargin / (1e18).toString();
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error getting active position');
      return reason;
    }
  }

  // get Price
  async getPrice(side, amount, pair) {
    try {
      let price;
      this.cacheExpirary[pair] = Date.now() + UPDATE_PERIOD;
      this.pairAmountCache[pair] = amount;
      if (!Object.prototype.hasOwnProperty.call(this.priceCache, pair)) {
        const amm = new Ethers.Contract(
          this.amm[pair],
          AmmArtifact.abi,
          this.provider
        );
        if (side === 'buy') {
          price = await amm.getInputPrice(0, {
            d: Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS),
          });
          price = amount / Ethers.utils.formatUnits(price.d);
        } else {
          price = await amm.getOutputPrice(0, {
            d: Ethers.utils.parseUnits(amount, DEFAULT_DECIMALS),
          });
          price = Ethers.utils.formatUnits(price.d) / amount;
        }
      } else {
        if (side === 'buy') {
          price = this.priceCache[pair][0];
        } else {
          price = this.priceCache[pair][1];
        }
      }
      return price;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error getting Price');
      return reason;
    }
  }

  // get getFundingRate
  async getFundingRate(pair) {
    try {
      let funding = {};
      const amm = new Ethers.Contract(
        this.amm[pair],
        AmmArtifact.abi,
        this.provider
      );
      await Promise.allSettled([
        amm.getUnderlyingTwapPrice(3600),
        amm.getTwapPrice(3600),
        amm.nextFundingTime(),
      ]).then((values) => {
        funding.indexPrice = parseFloat(
          Ethers.utils.formatUnits(values[0].value.d)
        );
        funding.markPrice = parseFloat(
          Ethers.utils.formatUnits(values[1].value.d)
        );
        funding.nextFundingTime = parseInt(values[2].value.toString());
      });

      funding.rate =
        (funding.markPrice - funding.indexPrice) / 24 / funding.indexPrice;
      return funding;
    } catch (err) {
      logger.error(err)();
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error getting fee');
      return reason;
    }
  }
}
