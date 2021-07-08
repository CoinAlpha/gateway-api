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
  BlockTxBroadcastResult,
} from '@terra-money/terra.js';
import { getHummingbotMemo } from './utils';

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

const ULUNA_GAS_PRICE = 0.16;

const GAS_ADJUSTMENT = 1.4;

export interface SwapRate {
  offerAmount: number;
  exchangeRate: number;
  quoteToken: string;
  costAmount: number;
  txFee: Record<string, number>;
}

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
      const lcd = this.connect();

      if (typeof lcd !== 'string') {
        this.lcd = lcd;
        this.lcd.market.parameters().catch(() => {
          throw new Error('Connection error');
        });
        // set gas & fee
        this.lcd.config.gasAdjustment = GAS_ADJUSTMENT;
        this.lcd.config.gasPrices = { uluna: ULUNA_GAS_PRICE };
      }
    } catch (err) {
      logger.error(err);
      throw Error(`Connection failed: ${this.network}`);
    }
  }

  // connect Terra LCD
  connect(): LCDClient | string {
    try {
      const lcd = new LCDClient({
        URL: this.lcdUrl,
        chainID: this.network,
      });
      lcd.config.gasAdjustment = GAS_ADJUSTMENT;
      lcd.config.gasPrices = { uluna: ULUNA_GAS_PRICE };
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

  async getTxFee(): Promise<Record<string, number> | string> {
    if (this.lcd) {
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
    } else {
      return 'terra client uninitialized';
    }
  }

  // get Terra Swap Rate
  async getSwapRate(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string
  ): Promise<SwapRate | string> {
    if (this.lcd) {
      try {
        let swapRate: SwapRate = {
          offerAmount: 0,
          exchangeRate: 0,
          quoteToken: '',
          costAmount: 0,
          txFee: {},
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
                  txFee: {},
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
                  txFee: {},
                };
              });
          }
        }

        if (swapRate) {
          const fees = await this.getTxFee();
          if (typeof fees != 'string') {
            swapRate.txFee = fees;
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
    } else {
      return 'terra client uninitialized';
    }
  }

  // Swap tokens
  async swapTokens(
    baseToken: string,
    quoteToken: string,
    amount: number,
    tradeType: string,
    gasPrice: string | null,
    gasAdjustment: number,
    secret: string
  ): Promise<any> {
    let swapResult;
    // connect to lcd
    const lcd = this.connect();
    if (typeof lcd === 'string') {
      logger.error('Unable to connect to the lcd client.');
      throw Error('Unable to connect to the lcd client.');
    } else {
      try {
        let wallet;
        try {
          const mk = new MnemonicKey({
            mnemonic: secret,
          });
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

          if (wallet) {
            await wallet
              .createAndSignTx(txOptions)
              .then((tx: StdTx) => lcd.tx.broadcast(tx))
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
}
