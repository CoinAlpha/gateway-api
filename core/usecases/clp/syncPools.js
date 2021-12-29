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
exports.SyncPools = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
function SyncPools({ sif, clp, chains, tokenRegistry }, store) {
    return {
        syncPublicPools,
        syncUserPools,
    };
    function syncPublicPools() {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeAsset = chains.get(entities_1.Network.SIFCHAIN).nativeAsset;
            const registry = yield tokenRegistry.load();
            const rawPools = yield clp.getRawPools();
            const pools = rawPools.pools
                .map((pool) => {
                var _a;
                const externalSymbol = (_a = pool.externalAsset) === null || _a === void 0 ? void 0 : _a.symbol;
                const entry = registry.find((item) => item.denom === externalSymbol || item.baseDenom === externalSymbol);
                if (!entry)
                    return null;
                const asset = chains
                    .get(entities_1.Network.SIFCHAIN)
                    .findAssetWithLikeSymbol(entry.baseDenom);
                if (!asset) {
                    console.log(entry, externalSymbol);
                }
                if (!asset)
                    return null;
                return entities_1.Pool(entities_1.AssetAmount(nativeAsset, pool.nativeAssetBalance), entities_1.AssetAmount(asset, pool.externalAssetBalance), entities_1.Amount(pool.poolUnits));
            })
                .filter((val) => val != null);
            for (let pool of pools) {
                store.pools[pool.symbol()] = pool;
            }
        });
    }
    function syncUserPools(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = yield tokenRegistry.load();
            // This is a hot method when there are a heap of pools
            // Ideally we would have a better rest endpoint design
            const currentAccountPools = {};
            if (!store.accountpools[address]) {
                store.accountpools[address] = {};
            }
            const rawLpData = yield clp.getAccountLiquidityProviderData({
                lpAddress: address,
            });
            rawLpData.forEach((lpItem) => {
                var _a, _b;
                const symbol = (_b = (_a = lpItem.liquidityProvider) === null || _a === void 0 ? void 0 : _a.asset) === null || _b === void 0 ? void 0 : _b.symbol;
                if (!symbol)
                    return;
                const entry = registry.find((item) => item.denom === symbol || item.baseDenom === symbol);
                if (!entry)
                    return;
                const asset = chains
                    .get(entities_1.Network.SIFCHAIN)
                    .findAssetWithLikeSymbol(entry.baseDenom);
                if (!asset)
                    return;
                const lp = entities_1.LiquidityProvider(asset, entities_1.Amount(lpItem.liquidityProvider.liquidityProviderUnits), address, entities_1.Amount(lpItem.nativeAssetBalance), entities_1.Amount(lpItem.externalAssetBalance));
                const pool = utils_1.createPoolKey(asset, chains.get(entities_1.Network.SIFCHAIN).nativeAsset);
                currentAccountPools[pool] = { lp, pool };
            });
            Object.keys(store.accountpools[address]).forEach((poolId) => {
                // If pool is gone now, delete. Ie user remioved all liquidity
                if (!currentAccountPools[poolId]) {
                    delete store.accountpools[address][poolId];
                }
            });
            Object.keys(currentAccountPools).forEach((poolId) => {
                store.accountpools[address][poolId] = currentAccountPools[poolId];
            });
        });
    }
}
exports.SyncPools = SyncPools;
//# sourceMappingURL=syncPools.js.map