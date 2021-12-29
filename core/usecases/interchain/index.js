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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../entities");
const chains_1 = require("../../clients/chains");
const txManager_1 = __importDefault(require("./txManager"));
const BaseBridge_1 = require("../../clients/bridges/BaseBridge");
function InterchainUsecase(context) {
    const getIbcWallet = (fromChain) => {
        if (fromChain.network === entities_1.Network.TERRA) {
            return context.services.wallet.terraProvider;
        }
        return context.services.wallet.keplrProvider;
    };
    const ibcBridge = {
        estimateFees(params) {
            return context.services.ibc.estimateFees(getIbcWallet(params.fromChain), params);
        },
        approveTransfer(params) {
            return __awaiter(this, void 0, void 0, function* () { });
        },
        transfer(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield context.services.ibc.transfer(getIbcWallet(params.fromChain), params);
                BaseBridge_1.bridgeTxEmitter.emit("tx_sent", result);
                return result;
            });
        },
        waitForTransferComplete(tx, onUpdate) {
            return __awaiter(this, void 0, void 0, function* () {
                return context.services.ibc.waitForTransferComplete(getIbcWallet(tx.fromChain), tx, onUpdate);
            });
        },
    };
    const ethBridge = {
        estimateFees(params) {
            return context.services.ethbridge.estimateFees(context.services.wallet.metamaskProvider, params);
        },
        approveTransfer(params) {
            return __awaiter(this, void 0, void 0, function* () {
                if (params.fromChain.network === entities_1.Network.ETHEREUM) {
                    yield context.services.ethbridge.approveTransfer(context.services.wallet.metamaskProvider, params);
                }
            });
        },
        transfer(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield context.services.ethbridge.transfer(params.fromChain.network === entities_1.Network.SIFCHAIN
                    ? context.services.wallet.keplrProvider
                    : context.services.wallet.metamaskProvider, params);
                BaseBridge_1.bridgeTxEmitter.emit("tx_sent", result);
                return result;
            });
        },
        waitForTransferComplete(tx, onUpdate) {
            return __awaiter(this, void 0, void 0, function* () {
                return context.services.ethbridge.waitForTransferComplete(context.services.wallet.metamaskProvider, tx, onUpdate);
            });
        },
    };
    const interchain = (from, to) => {
        if (from instanceof chains_1.SifchainChain) {
            if (to.chainConfig.chainType === "ibc") {
                return ibcBridge;
            }
            else if (to.chainConfig.chainType === "eth") {
                return ethBridge;
            }
        }
        else if (to instanceof chains_1.SifchainChain) {
            if (from.chainConfig.chainType === "ibc") {
                return ibcBridge;
            }
            else if (from.chainConfig.chainType === "eth") {
                return ethBridge;
            }
        }
        throw new Error(`Token transfer from chain ${from.network} to chain ${to.network} not supported!`);
    };
    const txManager = txManager_1.default(context, interchain);
    // @mccallofthewild - wait for assets to be loaded & cached before running
    setTimeout(() => {
        txManager.listenForSentTransfers();
    }, 500);
    interchain.txManager = txManager;
    return interchain;
}
exports.default = InterchainUsecase;
//# sourceMappingURL=index.js.map