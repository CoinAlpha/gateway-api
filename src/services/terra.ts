import { logger } from './logger';
import {
  LCDClient,
  Coin,
  Coins,
  MsgSwap,
  MnemonicKey,
  isTxError,
  StdTx,
  StdSignMsg,
  StdFee,
} from '@terra-money/terra.js';
import { getHummingbotMemo } from './utils';
import { ethers } from 'ethers';

const debug = require('debug')('router');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants
const TERRA_TOKENS: Record<string, string> = {
  uluna: 'LUNA',
  uusd: 'UST',
  ukrw: 'KRT',
  usdr: 'SDT',
  umnt: 'MNT',
};

// const DENOM_UNIT = ethers.BigNumber.from(BigInt('1e+6'));
const DENOM_UNIT = 10 ** 6;

const GAS_PRICE = { uluna: 0.16 };

const GAS_ADJUSTMENT = 1.4;

export default class Terra {
  private lcdUrl;
  private network;
  private memo;
  private lcd: LCDClient | null = null;

  constructor() {
    this.lcdUrl = globalConfig.getConfig('TERRA_LCD_URL');
    this.network = globalConfig.getConfig('TERRA_CHAIN');
    this.memo = getHummingbotMemo();

    try {
      this.lcd = this.connect();

      if (this.lcd) {
        this.lcd.market.parameters().catch(() => {
          throw new Error('Connection error');
        });
        // set gas & fee
        this.lcd.config.gasAdjustment = GAS_ADJUSTMENT;
        this.lcd.config.gasPrices = GAS_PRICE;
      }
    } catch (err) {
      logger.error(err);
      throw Error(`Connection failed: ${this.network}`);
    }
  }

  // connect Terra LCD
  connect() {
    try {
      const lcd = new LCDClient({
        URL: this.lcdUrl,
        chainID: this.network,
      });
      lcd.config.gasAdjustment = GAS_ADJUSTMENT;
      lcd.config.gasPrices = GAS_PRICE;
      return lcd;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error Terra LCD connect');
      return reason;
    }
  }

  // get Token Denom
  getTokenDenom(symbol: string): string | undefined {
    try {
      let denom;
      Object.keys(TERRA_TOKENS).forEach((item) => {
        if (TERRA_TOKENS[item] === symbol) {
          denom = item;
        }
      });
      return denom;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra Denom lookup');
      return reason;
    }
  }

  // get Token Symbol
  getTokenSymbol(denom: string): string | undefined {
    try {
      return TERRA_TOKENS[denom];
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra Denom lookup');
      return reason;
    }
  }

  async getEstimateFee(
    tx: StdTx | StdSignMsg
  ): Promise<StdFee | string | undefined> {
    try {
      if (this.lcd) {
        const fee = await this.lcd.tx.estimateFee(tx);
        return fee;
      }
      return;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra estimate fee lookup');
      return reason;
    }
  }

  async getExchangeRate(denom: string): Promise<Coin | string | undefined> {
    try {
      if (this.lcd) {
        const exchangeRates = await this.lcd.oracle.exchangeRates();
        return exchangeRates.get(denom);
      }
      return;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra exchange rate lookup');
      return reason;
    }
  }

  async getTxFee(): Promise<Record<string, number> | undefined> {
    try {
      const lunaFee = GAS_PRICE.uluna * GAS_ADJUSTMENT;
      const feeList: Record<string, number> = { uluna: lunaFee };
      if (this.lcd) {
        await this.lcd.oracle.exchangeRates().then((rates: Coins) => {
          rates.toArray().forEach((rate: Coin) => {
            feeList[rate.denom] = rate.amount.toNumber() * lunaFee;
          });
        });

        return feeList;
      }
      return;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra exchange rate lookup');
      return reason;
    }
  }

  // get Terra Swap Rate
  async getSwapRate(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string
  ) {
    try {
      let offerCoin;
      let offerDenom;
      let swapDenom;
      let costAmount: number;
      let cost: Record<any, any>;
      let offer: Record<any, any> = {};
      let exchangeRate: Record<any, any> = {};
      const swaps: Record<any, any> = {};

      if (tradeType.toLowerCase() === 'sell') {
        // sell base
        offerDenom = this.getTokenDenom(baseToken);
        swapDenom = this.getTokenDenom(quoteToken);
        if (offerDenom && swapDenom) {
          offerCoin = new Coin(offerDenom, amount * DENOM_UNIT);
          if (this.lcd) {
            await this.lcd.market
              .swapRate(offerCoin, swapDenom)
              .then((swapCoin) => {
                offer = { amount: amount };
                exchangeRate = {
                  amount: swapCoin.amount.toNumber() / DENOM_UNIT / amount,
                  token: quoteToken,
                };
                costAmount = amount * exchangeRate.amount;
                cost = {
                  amount: costAmount,
                  token: quoteToken,
                };

                swaps.offer = offer;
                swaps.price = exchangeRate;
                swaps.cost = cost;
              });
          }
        }
      } else {
        // buy base
        offerDenom = this.getTokenDenom(quoteToken);
        swapDenom = this.getTokenDenom(baseToken);

        if (offerDenom && swapDenom) {
          offerCoin = new Coin(offerDenom, 1 * DENOM_UNIT);
          if (this.lcd) {
            await this.lcd.market
              .swapRate(offerCoin, swapDenom)
              .then((swapCoin) => {
                exchangeRate = {
                  amount:
                    amount / (swapCoin.amount.toNumber() * DENOM_UNIT) / amount, // adjusted amount
                  token: quoteToken,
                };
                costAmount = amount * exchangeRate.amount;
                cost = {
                  amount: costAmount,
                  token: quoteToken,
                };
                offer = { amount: cost.amount };

                swaps.offer = offer;
                swaps.price = exchangeRate;
                swaps.cost = cost;
              });
          }
        }
      }

      let txFee;
      await this.getTxFee().then((fee) => {
        // fee in quote
        txFee = {
          amount: fee ? fee[this.getTokenDenom(quoteToken) || ''] || '0' : 0,
          token: quoteToken,
        };
      });

      swaps.txFee = txFee;
      debug('swaps', swaps);
      return swaps;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = 'error swap rate lookup');
      return reason;
    }
  }

  // Swap tokens
  async swapTokens(
    baseToken,
    quoteToken,
    amount,
    tradeType,
    gasPrice,
    gasAdjustment,
    secret
  ) {
    let swapResult;
    try {
      // connect to lcd
      const lcd = this.connect();

      const mk = new MnemonicKey({
        mnemonic: secret,
      });
      let wallet;
      try {
        wallet = lcd.wallet(mk);
      } catch (err) {
        logger.error(err);
        throw Error('Wallet access error');
      }

      const address = wallet.key.accAddress;

      // get the current swap rate
      const baseDenom = this.getTokenDenom(baseToken);
      const quoteDenom = this.getTokenDenom(quoteToken);

      let offerDenom, swapDenom;
      let swaps, txAttributes;
      const tokenSwap = {};

      if (tradeType.toLowerCase() === 'sell') {
        offerDenom = baseDenom;
        swapDenom = quoteDenom;
      } else {
        offerDenom = quoteDenom;
        swapDenom = baseDenom;
      }

      await this.getSwapRate(
        baseToken,
        quoteToken,
        amount,
        tradeType,
        secret
      ).then((rate) => {
        swaps = rate;
      });

      const offerAmount = parseInt(swaps.offer.amount * DENOM_UNIT);
      const offerCoin = new Coin(offerDenom, offerAmount);

      // Create and Sign Transaction
      const msgSwap = new MsgSwap(address, offerCoin, swapDenom);

      let txOptions;
      if (gasPrice !== null && gasPrice !== null) {
        // ignore gasAdjustment when gasPrice is not set
        txOptions = {
          msgs: [msgSwap],
          gasPrices: { uluna: parseFloat(gasPrice) },
          gasAdjustment: gasAdjustment,
          memo: this.memo,
        };
      } else {
        txOptions = {
          msgs: [msgSwap],
          memo: this.memo,
        };
      }

      await wallet
        .createAndSignTx(txOptions)
        .then((tx) => lcd.tx.broadcast(tx))
        .then((txResult) => {
          swapResult = txResult;

          const swapSuccess = !isTxError(txResult);
          if (swapSuccess) {
            tokenSwap.txSuccess = swapSuccess;
          } else {
            tokenSwap.txSuccess = !swapSuccess;
            throw new Error(
              `encountered an error while running the transaction: ${txResult.code} ${txResult.codespace}`
            );
          }
          const txHash = txResult.txhash;
          const events = JSON.parse(txResult.raw_log)[0].events;
          const swap = events.find((obj) => {
            return obj.type === 'swap';
          });
          const offer = Coin.fromString(swap.attributes.offer);
          const ask = Coin.fromString(swap.attributes.swap_coin);
          const fee = Coin.fromString(swap.attributes.swap_fee);

          tokenSwap.expectedIn = {
            amount: parseFloat(offer.amount) / DENOM_UNIT,
            token: TERRA_TOKENS[offer.denom],
          };
          tokenSwap.expectedOut = {
            amount: parseFloat(ask.amount) / DENOM_UNIT,
            token: TERRA_TOKENS[ask.denom],
          };
          tokenSwap.fee = {
            amount: parseFloat(fee.amount) / DENOM_UNIT,
            token: TERRA_TOKENS[fee.denom],
          };
          tokenSwap.txHash = txHash;
        });
      return tokenSwap;
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = swapResult);
      return { txSuccess: false, message: reason };
    }
  }
}
