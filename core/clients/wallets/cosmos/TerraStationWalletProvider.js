'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.TerraStationWalletProvider = void 0;
const CosmosWalletProvider_1 = require('./CosmosWalletProvider');
const chrome_extension_1 = require('@terra-money/wallet-provider/modules/chrome-extension');
const MsgTransfer_1 = require('@terra-money/terra.js/dist/core/ibc-transfer/msgs/MsgTransfer');
const Coin_1 = require('@terra-money/terra.js/dist/core/Coin');
const TWP = __importStar(require('@terra-money/wallet-provider'));
const NativeDexTransaction_1 = require('../../../services/utils/SifClient/NativeDexTransaction');
const stargate_1 = require('@cosmjs/stargate');
const KeplrWalletProvider_1 = require('./KeplrWalletProvider');
const NativeAminoTypes_1 = require('../../../services/utils/SifClient/NativeAminoTypes');
const logs_1 = require('@cosmjs/stargate/build/logs');
// @ts-ignore
// window.TWP = TWP;
class TerraStationWalletProvider extends CosmosWalletProvider_1.CosmosWalletProvider {
  constructor(context) {
    super(context);
    this.context = context;
    this.extensionControllerChainIdLookup = {};
  }
  isInstalled(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      //   return !!window.isTerraExtensionAvailable;
    });
  }
  getExtensionController(chain) {
    const config = this.getIBCChainConfig(chain);
    if (!this.extensionControllerChainIdLookup[config.chainId]) {
      const name = config.chainId.includes('bombay') ? 'testnet' : 'mainnet';
      const networkInfo = {
        name,
        chainID: config.chainId,
        lcd: config.restUrl,
      };
      this.extensionControllerChainIdLookup[config.chainId] =
        new chrome_extension_1.ChromeExtensionController({
          defaultNetwork: networkInfo,
          enableWalletConnection: true,
          dangerously__chromeExtensionCompatibleBrowserCheck: () => false,
        });
    }
    return this.extensionControllerChainIdLookup[config.chainId];
  }
  connect(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      let address;
      try {
        address = yield this.getExtensionController(chain).connect();
      } catch (error) {
        console.error(error);
        address = false;
      }
      if (!address) {
        throw new Error('Chrome extension not installed');
      }
      return address;
    });
  }
  hasConnected(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      const controller = this.getExtensionController(chain);
      yield controller.checkStatus();
      return typeof controller._terraAddress.value === 'string';
    });
  }
  canDisconnect(chain) {
    return false;
  }
  disconnect(chain) {
    throw new Error('Method not implemented.');
  }
  // The only thing that works for us is the Terra wallet's `post` method, which both
  // signs and sends. We just do a "noop" sign here then do the actual post in the broadcast method.
  sign(chain, tx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      if (
        !((_a = tx.msgs[0]) === null || _a === void 0
          ? void 0
          : _a.typeUrl.includes('MsgTransfer'))
      ) {
        throw new Error(
          'Sifchain Terra Station wallet integration currently supports ONLY IBC Transfers!'
        );
      }
      return new NativeDexTransaction_1.NativeDexSignedTransaction(tx);
    });
  }
  broadcast(chain, signedTx) {
    return __awaiter(this, void 0, void 0, function* () {
      const tx = signedTx.raw;
      const chainConfig = this.getIBCChainConfig(chain);
      const stargate = yield stargate_1.StargateClient.connect(
        chainConfig.rpcUrl
      );
      const controller = this.getExtensionController(chain);
      const converter = new NativeAminoTypes_1.NativeAminoTypes();
      const msgs = tx.msgs.map(converter.toAmino.bind(converter));
      // The Terra dist has a MsgTransfer type in it, but it isn't fully supported by the wallet controller yet.
      // We have to do a little monkey-patching to make the Terra wallet take it.
      // Terra Coin type doesn't have a fromAmino, which is used by MsgTransfer.fromAmino...
      // @ts-ignore
      Coin_1.Coin.fromAmino = Coin_1.Coin.fromData;
      // @ts-ignore
      const transfer = MsgTransfer_1.MsgTransfer.fromAmino(msgs[0]).toData();
      // Returned transfer doesn't have a toJSON object, which is required for Terra Station...
      const envelope = Object.assign(Object.assign({}, transfer), {
        toJSON: () => JSON.stringify(transfer),
      });
      const txDraft = {
        msgs: [envelope],
        memo: tx.memo || '',
      };
      // @ts-ignore
      const chromeRes = yield controller.post(txDraft, {
        terraAddress: tx.fromAddress,
      });
      const res = chromeRes.payload;
      // The ibc tx from terra station doesn't give us any rawLog data, so
      // we fetch the inflight TX to get it.
      let txResponseData = null;
      if (res.success) {
        let retries = 25;
        while (!txResponseData && retries-- > 0) {
          yield new Promise((resolve) => setTimeout(resolve, 1000));
          txResponseData = yield stargate.getTx(res.result.txhash);
        }
      }
      if (!txResponseData) {
        res.success = false;
      }
      if (res.success) {
        // @ts-ignore
        return {
          transactionHash: res.result.txhash,
          rawLog:
            (txResponseData === null || txResponseData === void 0
              ? void 0
              : txResponseData.rawLog) || res.result.raw_log,
          logs: logs_1.parseRawLog(
            (txResponseData === null || txResponseData === void 0
              ? void 0
              : txResponseData.rawLog) || res.result.raw_log
          ),
        };
      } else {
        return {
          transactionHash: res.result.txhash,
          height: res.result.height,
          rawLog:
            (txResponseData === null || txResponseData === void 0
              ? void 0
              : txResponseData.rawLog) || res.result.raw_log,
          logs: logs_1.parseRawLog(
            (txResponseData === null || txResponseData === void 0
              ? void 0
              : txResponseData.rawLog) || res.result.raw_log
          ),
          code: -1,
        };
      }
    });
  }
  static create(context) {}
  getSendingSigner(chain) {
    return __awaiter(this, void 0, void 0, function* () {
      return KeplrWalletProvider_1.KeplrWalletProvider.prototype.getSendingSigner.call(
        this,
        chain
      );
    });
  }
}
exports.TerraStationWalletProvider = TerraStationWalletProvider;
//# sourceMappingURL=TerraStationWalletProvider.js.map
