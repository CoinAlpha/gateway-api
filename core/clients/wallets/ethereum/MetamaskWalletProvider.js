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
exports.MetamaskWalletProvider = void 0;
const Web3WalletProvider_1 = require("./Web3WalletProvider");
const getMetamaskProvider_1 = require("./getMetamaskProvider");
class MetamaskWalletProvider extends Web3WalletProvider_1.Web3WalletProvider {
    constructor(context) {
        super(context, {
            getWeb3Provider: () => getMetamaskProvider_1.getMetamaskProvider(),
        });
        this.context = context;
    }
    getMetamaskProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            return web3.currentProvider;
        });
    }
    isInstalled(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.getMetamaskProvider());
        });
    }
    connect(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.getMetamaskProvider();
            const chainId = yield provider.request({ method: "eth_chainId" });
            console.log({ chainId });
            const [address] = yield provider.request({
                method: "eth_requestAccounts",
            });
            return address;
        });
    }
    hasConnected(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.getWeb3();
            const accounts = yield web3.eth.getAccounts();
            return accounts.length > 0;
        });
    }
    suggestEthereumAsset(asset, loadTokenIconUrl, contractAddress = asset.address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractAddress)
                throw new Error("No contract address supplied");
            const metamask = yield this.getMetamaskProvider();
            const wasAdded = yield metamask.request({
                method: "wallet_watchAsset",
                params: {
                    // @ts-ignore
                    type: "ERC20",
                    options: {
                        address: contractAddress,
                        symbol: asset.displaySymbol.toUpperCase(),
                        decimals: asset.decimals,
                        image: yield loadTokenIconUrl(asset),
                    },
                },
            });
            return !!wasAdded;
        });
    }
}
exports.MetamaskWalletProvider = MetamaskWalletProvider;
//# sourceMappingURL=MetamaskWalletProvider.js.map