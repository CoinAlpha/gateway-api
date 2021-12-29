'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.KeplrWalletProvider = void 0;
const stargate_1 = require('@cosmjs/stargate');
const math_1 = require('@cosmjs/math');
const encoding_1 = require('@cosmjs/encoding');
const CosmosWalletProvider_1 = require('./CosmosWalletProvider');
const launchpad_1 = require('@cosmjs/launchpad');
const NativeDexTransaction_1 = require('../../../services/utils/SifClient/NativeDexTransaction');
const NativeAminoTypes_1 = require('../../../services/utils/SifClient/NativeAminoTypes');
const logs_1 = require('@cosmjs/stargate/build/logs');
const getKeplrProvider_1 = __importDefault(
  require('../../../services/SifService/getKeplrProvider')
);
class KeplrWalletProvider extends CosmosWalletProvider_1.CosmosWalletProvider {
  constructor(context) {
    super(context);
    this.context = context;
  }
  static create(context) {
    return new KeplrWalletProvider(context);
  }
  onAccountChanged(callback) {
    // try {
    //   window.addEventListener('keplr_keystorechange', callback);
    //   return () => window.removeEventListener('keplr_keystorechange', callback);
    // } catch (e) {}
  }
  isInstalled(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      //   return window.keplr != null;
    });
  }
  hasConnected(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      const chainConfig = this.getIBCChainConfig(chain);
      const keplr = yield getKeplrProvider_1.default();
      try {
        yield keplr === null || keplr === void 0
          ? void 0
          : keplr.getKey(chainConfig.keplrChainInfo.chainId);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
  isChainSupported(chain) {
    return chain.chainConfig.chainType === 'ibc';
  }
  canDisconnect(chain) {
    return false;
  }
  disconnect(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      throw new Error('Keplr wallets cannot disconnect');
    });
  }
  getSendingSigner(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      const chainConfig = this.getIBCChainConfig(chain);
      const keplr = yield getKeplrProvider_1.default();
      yield keplr === null || keplr === void 0
        ? void 0
        : keplr.experimentalSuggestChain(chainConfig.keplrChainInfo);
      yield keplr === null || keplr === void 0
        ? void 0
        : keplr.enable(chainConfig.chainId);
      const sendingSigner =
        keplr === null || keplr === void 0
          ? void 0
          : keplr.getOfflineSigner(chainConfig.chainId);
      if (!sendingSigner)
        throw new Error(
          `Failed to get sendingSigner for ${chainConfig.chainId}`
        );
      return sendingSigner;
    });
  }
  tryConnectAll(...chains) {
    return __awaiter(this, void 0, void 0, function* () {
      const keplr = yield getKeplrProvider_1.default();
      const chainIds = chains
        .filter((c) => c.chainConfig.chainType === 'ibc')
        .map((c) => c.chainConfig.chainId);
      // @ts-ignore
      return keplr === null || keplr === void 0
        ? void 0
        : keplr.enable(chainIds);
    });
  }
  connect(chain) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      // try to get the address quietly
      const keplr = yield getKeplrProvider_1.default();
      const chainConfig = this.getIBCChainConfig(chain);
      yield keplr === null || keplr === void 0
        ? void 0
        : keplr.experimentalSuggestChain(chainConfig.keplrChainInfo);
      const key = yield keplr === null || keplr === void 0
        ? void 0
        : keplr.getKey(chain.chainConfig.chainId);
      let address = key === null || key === void 0 ? void 0 : key.bech32Address;
      // if quiet get fails, try to enable the wallet
      if (!address) {
        const sendingSigner = yield this.getSendingSigner(chain);
        address =
          (_a = (yield sendingSigner.getAccounts())[0]) === null ||
          _a === void 0
            ? void 0
            : _a.address;
      }
      // if enabling & quiet get fails, throw.
      // if quiet get fails, try to enable the wallet
      if (!address) {
        const sendingSigner = yield this.getSendingSigner(chain);
        address =
          (_b = (yield sendingSigner.getAccounts())[0]) === null ||
          _b === void 0
            ? void 0
            : _b.address;
      }
      if (!address) {
        throw new Error(
          `No address to connect to for chain ${chain.displayName}`
        );
      }
      return address;
    });
  }
  sign(chain, tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const chainConfig = this.getIBCChainConfig(chain);
      const stargate = yield stargate_1.StargateClient.connect(
        chainConfig.rpcUrl
      );
      const converter = new NativeAminoTypes_1.NativeAminoTypes();
      const msgs = tx.msgs.map(converter.toAmino.bind(converter));
      const fee = {
        amount: [tx.fee.price],
        gas: tx.fee.gas,
      };
      const account = yield stargate.getAccount(tx.fromAddress || '');
      if (
        typeof (account === null || account === void 0
          ? void 0
          : account.accountNumber) !== 'number' &&
        typeof (account === null || account === void 0
          ? void 0
          : account.sequence) === 'number'
      ) {
        throw new Error(
          `This account (${tx.fromAddress}) does not yet exist on-chain. Please send some funds to it before proceeding.`
        );
      }
      const keplr = yield getKeplrProvider_1.default();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signDoc = launchpad_1.makeSignDoc(
        msgs,
        fee,
        chainConfig.chainId,
        tx.memo || '',
        (account === null || account === void 0
          ? void 0
          : account.accountNumber.toString()) || '',
        (account === null || account === void 0
          ? void 0
          : account.sequence.toString()) || ''
      );
      const key = yield keplr === null || keplr === void 0
        ? void 0
        : keplr.getKey(chainConfig.chainId);
      let bech32Address =
        key === null || key === void 0 ? void 0 : key.bech32Address;
      const defaultKeplrOpts = keplr.defaultOptions;
      keplr.defaultOptions = {
        sign: {
          preferNoSetFee: false,
          preferNoSetMemo: true,
        },
      };
      const signResponse = yield keplr.signAmino(
        chainConfig.chainId,
        bech32Address || '',
        signDoc
      );
      keplr.defaultOptions = defaultKeplrOpts;
      const signedTx = launchpad_1.makeStdTx(
        signResponse.signed,
        signResponse.signature
      );
      return new NativeDexTransaction_1.NativeDexSignedTransaction(
        tx,
        signedTx
      );
    });
  }
  broadcast(chain, tx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const signed = tx.signed;
      if (!signed.msg)
        throw new Error('Invalid signedTx, possibly it was not amino signed.');
      const chainConfig = this.getIBCChainConfig(chain);
      const stargate = yield stargate_1.StargateClient.connect(
        chainConfig.rpcUrl
      );
      const keplr = yield getKeplrProvider_1.default();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const txHashUInt8Array = yield keplr.sendTx(
        chainConfig.chainId,
        signed,
        launchpad_1.BroadcastMode.Block
      );
      const txHashHex = encoding_1.toHex(txHashUInt8Array).toUpperCase();
      const resultRaw = yield stargate.getTx(txHashHex);
      if (
        !resultRaw ||
        !((_a = resultRaw.hash) === null || _a === void 0
          ? void 0
          : _a.match(/^([0-9A-F][0-9A-F])+$/))
      ) {
        console.error('INVALID TXHASH IN RESULT', resultRaw);
        throw new Error(
          'Received ill-formatted txhash. Must be non-empty upper-case hex'
        );
      }
      const result = Object.assign(Object.assign({}, resultRaw), {
        logs: JSON.parse(resultRaw.rawLog),
        height: resultRaw.height,
        transactionHash: resultRaw.hash,
      });
      if (launchpad_1.isBroadcastTxSuccess(result)) {
        result.logs.forEach((log) => {
          // @ts-ignore
          log.msg_index = 0;
          // @ts-ignore
          log.log = '';
        });
      }
      return launchpad_1.isBroadcastTxFailure(result)
        ? {
            height: math_1.Uint53.fromString(result.height + '').toNumber(),
            transactionHash: result.transactionHash,
            code: result.code,
            rawLog: result.rawLog || '',
          }
        : {
            logs: result.logs ? logs_1.parseLogs(result.logs) : [],
            rawLog: result.rawLog || '',
            transactionHash: result.transactionHash,
            data: result.data,
          };
    });
  }
}
exports.KeplrWalletProvider = KeplrWalletProvider;
//# sourceMappingURL=KeplrWalletProvider.js.map
