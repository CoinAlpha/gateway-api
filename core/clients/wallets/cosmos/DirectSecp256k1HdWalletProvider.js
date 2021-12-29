"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectSecp256k1HdWalletProvider = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const TokenRegistryService_1 = require("../../../services/TokenRegistryService/TokenRegistryService");
const crypto_1 = require("@cosmjs/crypto");
const CosmosWalletProvider_1 = require("./CosmosWalletProvider");
const NativeDexTransaction_1 = require("../../../services/utils/SifClient/NativeDexTransaction");
const stargate_1 = require("@cosmjs/stargate");
const tx_1 = require("@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx");
class DirectSecp256k1HdWalletProvider extends CosmosWalletProvider_1.CosmosWalletProvider {
    constructor(context, options) {
        super(context);
        this.context = context;
        this.options = options;
        this.tokenRegistry = TokenRegistryService_1.TokenRegistryService(context);
    }
    static create(context, options) {
        return new DirectSecp256k1HdWalletProvider(context, options);
    }
    isInstalled(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    hasConnected(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    isChainSupported(chain) {
        return chain.chainConfig.chainType === "ibc";
    }
    canDisconnect(chain) {
        return false;
    }
    disconnect(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Cannot disconnect");
        });
    }
    // inconsequential change for git commit
    getSendingSigner(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = this.getIBCChainConfig(chain);
            // cosmos = m/44'/118'/0'/0
            const parts = [
                `m`,
                `44'`,
                `${chainConfig.keplrChainInfo.bip44.coinType}'`,
                `0'`,
                `0`,
            ];
            const wallet = yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(this.options.mnemonic || "", 
            // @ts-ignore
            crypto_1.stringToPath(parts.join("/")), chainConfig.keplrChainInfo.bech32Config.bech32PrefixAccAddr);
            return wallet;
        });
    }
    connect(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.getSendingSigner(chain);
            const [account] = yield wallet.getAccounts();
            if (!(account === null || account === void 0 ? void 0 : account.address)) {
                throw new Error("No address to connect to");
            }
            return account.address;
        });
    }
    sign(chain, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = this.getIBCChainConfig(chain);
            const signer = yield this.getSendingSigner(chain);
            const stargate = yield stargate_1.SigningStargateClient.connectWithSigner(chainConfig.rpcUrl, signer);
            const signed = yield stargate.sign(tx.fromAddress, tx.msgs, {
                amount: [tx.fee.price],
                gas: tx.fee.gas,
            }, tx.memo);
            return new NativeDexTransaction_1.NativeDexSignedTransaction(tx, signed);
        });
    }
    broadcast(chain, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const signed = tx.signed;
            if (signed.bodyBytes == null)
                throw new Error("Invalid signedTx, possibly it was not proto signed.");
            const chainConfig = this.getIBCChainConfig(chain);
            const signer = yield this.getSendingSigner(chain);
            const stargate = yield stargate_1.SigningStargateClient.connectWithSigner(chainConfig.rpcUrl, signer);
            const result = yield stargate.broadcastTx(Uint8Array.from(tx_1.TxRaw.encode(signed).finish()));
            return result;
        });
    }
}
exports.DirectSecp256k1HdWalletProvider = DirectSecp256k1HdWalletProvider;
//# sourceMappingURL=DirectSecp256k1HdWalletProvider.js.map