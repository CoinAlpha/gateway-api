"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainsService = exports.networkChainCtorLookup = void 0;
const entities_1 = require("../../entities");
const chains_1 = require("../../clients/chains");
__exportStar(require("../../clients/chains"), exports);
exports.networkChainCtorLookup = {
    [entities_1.Network.SIFCHAIN]: chains_1.SifchainChain,
    [entities_1.Network.ETHEREUM]: chains_1.EthereumChain,
    [entities_1.Network.COSMOSHUB]: chains_1.CosmoshubChain,
    [entities_1.Network.IRIS]: chains_1.IrisChain,
    [entities_1.Network.AKASH]: chains_1.AkashChain,
    [entities_1.Network.SENTINEL]: chains_1.SentinelChain,
    [entities_1.Network.CRYPTO_ORG]: chains_1.CryptoOrgChain,
    [entities_1.Network.PERSISTENCE]: chains_1.PersistenceChain,
    [entities_1.Network.REGEN]: chains_1.RegenChain,
    [entities_1.Network.OSMOSIS]: chains_1.OsmosisChain,
    [entities_1.Network.TERRA]: chains_1.TerraChain,
    [entities_1.Network.JUNO]: chains_1.JunoChain,
    [entities_1.Network.IXO]: chains_1.IxoChain,
    [entities_1.Network.BAND]: chains_1.BandChain,
    [entities_1.Network.LIKECOIN]: chains_1.LikecoinChain,
    [entities_1.Network.EMONEY]: chains_1.EmoneyChain,
};
class ChainsService {
    constructor(context) {
        this.context = context;
        this._list = [];
        this.map = new Map();
        Object.keys(exports.networkChainCtorLookup).forEach((network) => {
            const n = network;
            this.addChain(new exports.networkChainCtorLookup[n]({
                assets: this.context.assets,
                chainConfig: this.context.chainConfigsByNetwork[n],
            }));
        });
        entities_1.setChainsService(this);
    }
    addChain(chain) {
        this._list.push(chain);
        this.map.set(chain.network, chain);
    }
    findChainAssetMatch(match) {
        const matchKeys = Object.keys(match);
        let chain, asset;
        for (chain of this.list()) {
            for (asset of chain.assets) {
                const isMatch = matchKeys.every((key) => asset[key] === match[key]);
                if (isMatch)
                    return { asset, chain };
            }
        }
    }
    findChainAssetMatchOrThrow(match) {
        const result = this.findChainAssetMatch(match);
        if (!result) {
            throw new Error(`No matching chain + asset found for ${JSON.stringify(match)}`);
        }
        return result;
    }
    // returns array of chains
    list() {
        return this._list;
    }
    get(network) {
        const chain = this.map.get(network);
        if (!chain)
            throw new Error("Chain not found for " + network);
        return chain;
    }
    get nativeChain() {
        return this.get(entities_1.Network.SIFCHAIN);
    }
}
exports.ChainsService = ChainsService;
function createChainsService(c) {
    return new ChainsService(c);
}
exports.default = createChainsService;
//# sourceMappingURL=ChainsService.js.map