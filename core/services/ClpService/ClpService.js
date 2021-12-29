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
const SifClient_1 = require("../utils/SifClient");
const toPool_1 = require("../utils/SifClient/toPool");
const TokenRegistryService_1 = __importDefault(require("../../services/TokenRegistryService"));
const NativeDexClient_1 = require("../../services/utils/SifClient/NativeDexClient");
// TS not null type guard
function notNull(val) {
    return val !== null;
}
function createClpService({ sifApiUrl, nativeAsset, sifChainId, sifWsUrl, sifRpcUrl, sifUnsignedClient = new SifClient_1.SifUnSignedClient(sifApiUrl, sifWsUrl, sifRpcUrl), }) {
    const client = sifUnsignedClient;
    const dexClientPromise = NativeDexClient_1.NativeDexClient.connect(sifRpcUrl, sifApiUrl, sifChainId);
    const tokenRegistry = TokenRegistryService_1.default({
        sifRpcUrl,
        sifApiUrl,
        sifChainId,
    });
    const instance = {
        getRawPools() {
            return __awaiter(this, void 0, void 0, function* () {
                const queryClient = yield dexClientPromise;
                return queryClient.query.clp.GetPools({});
            });
        },
        getPools() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const rawPools = yield client.getPools();
                    return (rawPools
                        .map(toPool_1.toPool(nativeAsset))
                        // toPool can return a null pool for invalid pools lets filter them out
                        .filter(notNull));
                }
                catch (error) {
                    return [];
                }
            });
        },
        addLiquidity(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const externalAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(params.externalAssetAmount.asset);
                return yield client.addLiquidity({
                    base_req: { chain_id: sifChainId, from: params.fromAddress },
                    external_asset: {
                        source_chain: params.externalAssetAmount.asset.network,
                        symbol: externalAssetEntry.denom,
                        ticker: params.externalAssetAmount.asset.symbol,
                    },
                    external_asset_amount: params.externalAssetAmount.toBigInt().toString(),
                    native_asset_amount: params.nativeAssetAmount.toBigInt().toString(),
                    signer: params.fromAddress,
                });
            });
        },
        createPool(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const externalAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(params.externalAssetAmount.asset);
                return yield client.createPool({
                    base_req: { chain_id: sifChainId, from: params.fromAddress },
                    external_asset: {
                        source_chain: params.externalAssetAmount.asset.homeNetwork,
                        symbol: externalAssetEntry.denom,
                        ticker: params.externalAssetAmount.asset.symbol,
                    },
                    external_asset_amount: params.externalAssetAmount.toBigInt().toString(),
                    native_asset_amount: params.nativeAssetAmount.toBigInt().toString(),
                    signer: params.fromAddress,
                });
            });
        },
        swap(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const sentAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(params.sentAmount);
                const receivedAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(params.receivedAsset);
                return yield client.swap({
                    base_req: { chain_id: sifChainId, from: params.fromAddress },
                    received_asset: {
                        source_chain: params.receivedAsset.network,
                        symbol: receivedAssetEntry.denom,
                        ticker: receivedAssetEntry.baseDenom,
                    },
                    sent_amount: params.sentAmount.toBigInt().toString(),
                    sent_asset: {
                        source_chain: params.sentAmount.asset.network,
                        symbol: sentAssetEntry.denom,
                        ticker: sentAssetEntry.baseDenom,
                    },
                    min_receiving_amount: params.minimumReceived.toBigInt().toString(),
                    signer: params.fromAddress,
                });
            });
        },
        getLiquidityProvider(params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield tokenRegistry.load();
                const entry = yield tokenRegistry.findAssetEntryOrThrow(params.asset);
                const response = yield client.getLiquidityProvider({
                    // cannot use params.asset.ibcDenom because ibcDenom is set when loading balances,
                    // and the user does not always have a balance for the asset they have pooled
                    symbol: entry.denom,
                    lpAddress: params.lpAddress,
                });
                const { liquidity_provider, native_asset_balance, external_asset_balance, } = response.result;
                const { liquidity_provider_units, liquidity_provider_address, } = liquidity_provider;
                return entities_1.LiquidityProvider(params.asset, entities_1.Amount(liquidity_provider_units), liquidity_provider_address, entities_1.Amount(native_asset_balance), entities_1.Amount(external_asset_balance));
            });
        },
        getPoolSymbolsByLiquidityProvider(address) {
            return __awaiter(this, void 0, void 0, function* () {
                // Unfortunately it is expensive for the backend to
                // filter pools so we need to annoyingly do this in two calls
                // First we get the metadata
                const poolMeta = yield client.getAssets(address);
                if (!poolMeta)
                    return [];
                return poolMeta.map(({ symbol }) => symbol);
            });
        },
        getAccountLiquidityProviderData(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const queryClient = yield dexClientPromise;
                const res = yield queryClient.query.clp.GetLiquidityProviderData({
                    lpAddress: params.lpAddress,
                });
                return res.liquidityProviderData;
            });
        },
        removeLiquidity(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const externalAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(params.asset);
                return yield client.removeLiquidity({
                    asymmetry: params.asymmetry,
                    base_req: { chain_id: sifChainId, from: params.fromAddress },
                    external_asset: {
                        source_chain: params.asset.network,
                        symbol: externalAssetEntry.denom,
                        ticker: params.asset.symbol,
                    },
                    signer: params.fromAddress,
                    w_basis_points: params.wBasisPoints,
                });
            });
        },
    };
    return instance;
}
exports.default = createClpService;
//# sourceMappingURL=ClpService.js.map