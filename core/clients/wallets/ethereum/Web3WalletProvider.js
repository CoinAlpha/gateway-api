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
exports.Web3WalletProvider = exports.isEventEmittingProvider = exports.Web3Transaction = void 0;
const WalletProvider_1 = require("../WalletProvider");
const entities_1 = require("../../../entities");
const web3_1 = __importDefault(require("web3"));
const erc20TokenAbi_1 = require("./erc20TokenAbi");
const jsbi_1 = __importDefault(require("jsbi"));
// NOTE(ajoslin): Web3WalletProvider doesn't actually sign anything yet,
// all it has to do is approve amounts to contracts.
class Web3Transaction {
    constructor(contractAddress) {
        this.contractAddress = contractAddress;
    }
}
exports.Web3Transaction = Web3Transaction;
function isEventEmittingProvider(provider) {
    if (!provider || typeof provider === "string")
        return false;
    return typeof provider.on === "function";
}
exports.isEventEmittingProvider = isEventEmittingProvider;
class Web3WalletProvider extends WalletProvider_1.WalletProvider {
    constructor(context, options) {
        super();
        this.context = context;
        this.options = options;
    }
    isInstalled(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    onProviderEvent(eventName, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            if (!isEventEmittingProvider(web3.currentProvider))
                return () => { };
            web3.currentProvider.on(eventName, () => callback());
            return () => { var _a; return (_a = web3.currentProvider) === null || _a === void 0 ? void 0 : _a.off(eventName, callback); };
        });
    }
    onChainChanged(callback) {
        return this.onProviderEvent("chainChanged", callback);
    }
    onAccountChanged(callback) {
        return this.onProviderEvent("accountsChanged", callback);
    }
    getWeb3() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3Promise) {
                this.web3Promise = (() => __awaiter(this, void 0, void 0, function* () {
                    const provider = yield this.options.getWeb3Provider();
                    if (!provider)
                        throw new Error("Web3 provider not found!");
                    return new web3_1.default(provider);
                }))();
            }
            return this.web3Promise;
        });
    }
    getRequiredApprovalAmount(chain, tx, assetAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (assetAmount.symbol.toLowerCase() === "eth") {
                return entities_1.AssetAmount(assetAmount.asset, "0");
            }
            // This will popup an approval request in metamask
            const web3 = yield this.getWeb3();
            const tokenContract = new web3.eth.Contract(erc20TokenAbi_1.erc20TokenAbi, assetAmount.address);
            // TODO - give interface option to approve unlimited spend via web3.utils.toTwosComplement(-1);
            // NOTE - We may want to move this out into its own separate function.
            // Although I couldn't think of a situation we'd call allowance separately from approve
            const hasAlreadyApprovedSpend = yield tokenContract.methods
                .allowance(tx.fromAddress, tx.msgs[0].contractAddress)
                .call();
            if (jsbi_1.default.lessThanOrEqual(assetAmount.toBigInt(), jsbi_1.default.BigInt(hasAlreadyApprovedSpend))) {
                return assetAmount;
            }
            return entities_1.AssetAmount(assetAmount.asset, "0");
        });
    }
    approve(chain, tx, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            const tokenContract = new web3.eth.Contract(erc20TokenAbi_1.erc20TokenAbi, amount.asset.address);
            const sendArgs = {
                from: tx.fromAddress,
                value: 0,
                gas: 100000,
            };
            const res = yield tokenContract.methods
                .approve(tx.msgs[0].contractAddress, amount.toBigInt().toString())
                .send(sendArgs);
            console.log("approveBridgeBankSpend:", res);
        });
    }
    sign(chain, tx) {
        throw "not implemented; implementation in ethbridge for all eth tx";
    }
    broadcast(chain, tx) {
        throw "not implemented; implementation in ethbridge for all eth tx";
    }
    getEthChainConfig(chain) {
        if (chain.chainConfig.chainType !== "eth") {
            throw new Error(this.constructor.name + " only accepts eth chainTypes");
        }
        return chain.chainConfig;
    }
    isChainSupported(chain) {
        return chain.chainConfig.chainType === "eth";
    }
    connect(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            const [address] = yield web3.eth.getAccounts();
            return address;
        });
    }
    hasConnected(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    canDisconnect(chain) {
        return false;
    }
    disconnect(chain) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    fetchBalances(chain, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            return Promise.all(chain.assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
                if (asset.symbol === chain.nativeAsset.symbol) {
                    return entities_1.AssetAmount(asset, yield web3.eth.getBalance(address));
                }
                if (!asset.address) {
                    return entities_1.AssetAmount(asset, "0");
                }
                const contract = new web3.eth.Contract(erc20TokenAbi_1.erc20TokenAbi, asset.address.toLowerCase());
                let amount = "0";
                try {
                    amount = yield contract.methods.balanceOf(address).call();
                }
                catch (error) {
                    console.error("token fetch error", asset);
                }
                return entities_1.AssetAmount(asset, amount);
            })));
        });
    }
}
exports.Web3WalletProvider = Web3WalletProvider;
//# sourceMappingURL=Web3WalletProvider.js.map