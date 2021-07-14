import { logger } from './logger';
import {
  LCDClient,
  Coin,
  Coins,
  MsgSwap,
  MnemonicKey,
  isTxError,
  StdTx,
  BlockTxBroadcastResult,
} from '@terra-money/terra.js';
import { getHummingbotMemo } from './utils';

const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

// constants
export const TERRA_TOKENS: Record<string, string> = {
  uluna: 'LUNA',
  uusd: 'UST',
  ukrw: 'KRT',
  usdr: 'SDT',
  umnt: 'MNT',
};

export const DENOM_UNIT = 10 ** 6;

export const ULUNA_GAS_PRICE = 0.16;

export const GAS_ADJUSTMENT = 1.4;

export interface SwapRate {
  offerAmount: number;
  exchangeRate: number;
  quoteToken: string;
  costAmount: number;
  txFee: number;
}

export default class Terra {
  private lcdUrl;
  private network;
  private memo;
  public lcd: LCDClient;

  constructor() {
    this.lcdUrl = globalConfig.getConfig('TERRA_LCD_URL');
    this.network = globalConfig.getConfig('TERRA_CHAIN');
    this.memo = getHummingbotMemo();

    this.lcd = new LCDClient({
      URL: this.lcdUrl,
      chainID: this.network,
    });
    this.lcd.config.gasAdjustment = GAS_ADJUSTMENT;
    this.lcd.config.gasPrices = { uluna: ULUNA_GAS_PRICE };
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

  async getExchangeRate(denom: string): Promise<Coin | string | undefined> {
    try {
      const exchangeRates = await this.lcd.oracle.exchangeRates();
      return exchangeRates.get(denom);
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason
        ? (reason = err.reason)
        : (reason = 'error Terra exchange rate lookup');
      return reason;
    }
  }

  async getTxFee(): Promise<Record<string, number> | string> {
    try {
      const ulunaFee = ULUNA_GAS_PRICE * GAS_ADJUSTMENT;
      const feeList: Record<string, number> = { uluna: ulunaFee };

      await this.lcd.oracle.exchangeRates().then((rates: Coins) => {
        rates.toArray().forEach((rate: Coin) => {
          feeList[rate.denom] = rate.amount.toNumber() * ulunaFee;
        });
      });

      return feeList;
    } catch (err) {
      logger.error(err);

      let reason;
      if (err.reason) {
        reason = err.reason;
      } else {
        reason = 'error Terra exchange rate lookup';
      }
      return reason;
    }
  }

  // get Terra Swap Rate
  async getSwapRate(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string
  ): Promise<SwapRate | string> {
    try {
      let swapRate: SwapRate = {
        offerAmount: 0,
        exchangeRate: 0,
        quoteToken: '',
        costAmount: 0,
        txFee: 0,
      };
      if (tradeType.toLowerCase() === 'sell') {
        // sell base
        const offerDenom = this.getTokenDenom(baseToken);
        const swapDenom = this.getTokenDenom(quoteToken);
        if (offerDenom && swapDenom) {
          const offerCoin = new Coin(offerDenom, amount * DENOM_UNIT);
          await this.lcd.market
            .swapRate(offerCoin, swapDenom)
            .then((swapCoin) => {
              const exchangeRate =
                swapCoin.amount.toNumber() / DENOM_UNIT / amount;
              swapRate = {
                offerAmount: amount,
                exchangeRate: exchangeRate,
                quoteToken: quoteToken,
                costAmount: amount * exchangeRate,
                txFee: 0,
              };
            });
        }
      } else {
        // buy base
        const offerDenom = this.getTokenDenom(quoteToken);
        const swapDenom = this.getTokenDenom(baseToken);

        if (offerDenom && swapDenom) {
          const offerCoin = new Coin(offerDenom, 1 * DENOM_UNIT);
          await this.lcd.market
            .swapRate(offerCoin, swapDenom)
            .then((swapCoin) => {
              const exchangeRate =
                amount / (swapCoin.amount.toNumber() * DENOM_UNIT) / amount; // adjusted amount
              const costAmount = amount * exchangeRate;

              swapRate = {
                offerAmount: costAmount,
                exchangeRate: exchangeRate,
                quoteToken: quoteToken,
                costAmount: costAmount,
                txFee: 0,
              };
            });
        }
      }

      if (swapRate) {
        const fees = await this.getTxFee();
        if (typeof fees != 'string') {
          if (fees[swapRate.quoteToken]) {
            swapRate.txFee = fees[swapRate.quoteToken];
          }
        }

        return swapRate;
      } else {
        return 'error swap rate lookup';
      }
    } catch (err) {
      logger.error(err);
      let reason;
      if (err.reason) {
        reason = err.reason;
      } else {
        reason = 'error swap rate lookup';
      }
      return reason;
    }
  }

  // Swap tokens
  async swapTokens(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string,
    gasPrice: number,
    gasAdjustment: number,
    secret: string
  ): Promise<any> {
    let swapResult;

    try {
      let wallet;
      try {
        const mk = new MnemonicKey({
          mnemonic: secret,
        });
        wallet = this.lcd.wallet(mk);
      } catch (err) {
        logger.error(err);
        throw Error('Wallet access error');
      }

      const address = wallet.key.accAddress;

      // get the current swap rate
      const baseDenom = this.getTokenDenom(baseToken);
      const quoteDenom = this.getTokenDenom(quoteToken);

      let offerDenom, swapDenom;
      const tokenSwap: Record<any, any> = {};

      if (tradeType.toLowerCase() === 'sell') {
        offerDenom = baseDenom;
        swapDenom = quoteDenom;
      } else {
        offerDenom = quoteDenom;
        swapDenom = baseDenom;
      }

      const swaps = await this.getSwapRate(
        baseToken,
        quoteToken,
        amount,
        tradeType
      );

      if (typeof swaps != 'string' && offerDenom && swapDenom) {
        const offerAmount = swaps.offerAmount * DENOM_UNIT;
        const offerCoin = new Coin(offerDenom, offerAmount);

        // Create and Sign Transaction
        const msgSwap = new MsgSwap(address, offerCoin, swapDenom);

        let txOptions;
        if (gasPrice !== null) {
          // ignore gasAdjustment when gasPrice is not set
          txOptions = {
            msgs: [msgSwap],
            gasPrices: { uluna: gasPrice },
            gasAdjustment: gasAdjustment,
            memo: this.memo,
          };
        } else {
          txOptions = {
            msgs: [msgSwap],
            memo: this.memo,
          };
        }

        if (wallet) {
          await wallet
            .createAndSignTx(txOptions)
            .then((tx: StdTx) => this.lcd.tx.broadcast(tx))
            .then((txResult: BlockTxBroadcastResult) => {
              swapResult = txResult;

              if (!isTxError(txResult)) {
                tokenSwap.txSuccess = true;
              } else {
                tokenSwap.txSuccess = false;
                const code = txResult.code || '';
                const codespace = txResult.codespace || '';
                throw new Error(
                  `encountered an error while running the transaction: ${code} ${codespace}`
                );
              }
              const txHash = txResult.txhash;
              const events = JSON.parse(txResult.raw_log)[0].events;
              const swap = events.find((obj: Record<string, any>) => {
                return obj.type === 'swap';
              });
              const offer = Coin.fromString(swap.attributes.offer);
              const ask = Coin.fromString(swap.attributes.swap_coin);
              const fee = Coin.fromString(swap.attributes.swap_fee);

              tokenSwap.expectedIn = {
                amount: offerAmount / DENOM_UNIT,
                token: TERRA_TOKENS[offer.denom],
              };
              tokenSwap.expectedOut = {
                amount: ask.amount.toNumber() / DENOM_UNIT,
                token: TERRA_TOKENS[ask.denom],
              };
              tokenSwap.fee = {
                amount: fee.amount.toNumber() / DENOM_UNIT,
                token: TERRA_TOKENS[fee.denom],
              };
              tokenSwap.txHash = txHash;
            });
          return tokenSwap;
        }
      }
    } catch (err) {
      logger.error(err);
      let reason;
      err.reason ? (reason = err.reason) : (reason = swapResult);
      return { txSuccess: false, message: reason };
    }
  }
}
