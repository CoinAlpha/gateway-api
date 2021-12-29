"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChain = void 0;
const isLikeSymbol_1 = require("../../utils/isLikeSymbol");
const url_join_ts_1 = require("url-join-ts");
class BaseChain {
    constructor(context) {
        this.context = context;
        this.chainConfig = context.chainConfig;
        this.assets = context.assets.filter((a) => a.network === context.chainConfig.network);
        this.assetMap = new Map();
        this.assets.forEach((asset) => {
            this.assetMap.set(asset.symbol.toLowerCase(), asset);
        });
        this.nativeAsset = this.assets.find((a) => a.symbol === context.chainConfig.nativeAssetSymbol);
    }
    get network() {
        return this.chainConfig.network;
    }
    get displayName() {
        return this.chainConfig.displayName;
    }
    lookupAsset(symbol) {
        return this.assetMap.get(symbol.toLowerCase());
    }
    lookupAssetOrThrow(symbol) {
        const asset = this.lookupAsset(symbol);
        if (!asset) {
            throw new Error(`Asset with symbol ${symbol} not found in chain ${this.displayName}`);
        }
        return asset;
    }
    findAssetWithLikeSymbol(symbol) {
        return this.assets.find((asset) => isLikeSymbol_1.isLikeSymbol(asset.symbol, symbol));
    }
    findAssetWithLikeSymbolOrThrow(symbol) {
        const asset = this.assets.find((asset) => isLikeSymbol_1.isLikeSymbol(asset.symbol, symbol));
        if (!asset)
            throw new Error(`Asset ${symbol} not found in chain ${this.displayName}`);
        return asset;
    }
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "transactions", hash);
    }
    getBlockExplorerUrlForAddress(address) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "accounts", address);
    }
}
exports.BaseChain = BaseChain;
//# sourceMappingURL=_BaseChain.js.map