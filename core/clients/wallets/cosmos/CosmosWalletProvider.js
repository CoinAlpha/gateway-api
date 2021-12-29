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
exports.CosmosWalletProvider = void 0;
const WalletProvider_1 = require("../WalletProvider");
const TokenRegistryService_1 = __importDefault(require("../../../services/TokenRegistryService"));
const entities_1 = require("../../../entities");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const stargate_1 = require("@cosmjs/stargate");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const NativeDexClient_1 = require("../../../services/utils/SifClient/NativeDexClient");
const createIBCHash_1 = require("../../../utils/createIBCHash");
class CosmosWalletProvider extends WalletProvider_1.WalletProvider {
    constructor(context) {
        super();
        this.context = context;
        this.createIBCHash = createIBCHash_1.createIBCHash;
        this.denomTracesCache = {};
        this.individualDenomTraceCache = {};
        this.tokenRegistry = TokenRegistryService_1.default(context);
    }
    isChainSupported(chain) {
        return chain.chainConfig.chainType === "ibc";
    }
    parseTxResultToStatus(txResult) {
        return NativeDexClient_1.NativeDexClient.parseTxResult(txResult);
    }
    getRequiredApprovalAmount(chain, tx, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return entities_1.AssetAmount(amount.asset, "0");
        });
    }
    approve(chain, tx, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            throw "not implemented";
        });
    }
    getIBCChainConfig(chain) {
        if (chain.chainConfig.chainType !== "ibc")
            throw new Error("Cannot connect to non-ibc chain " + chain.displayName);
        return chain.chainConfig;
    }
    getStargateClient(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = this.getIBCChainConfig(chain);
            const sendingSigner = yield this.getSendingSigner(chain);
            return stargate_1.SigningStargateClient === null || stargate_1.SigningStargateClient === void 0 ? void 0 : stargate_1.SigningStargateClient.connectWithSigner(chainConfig.rpcUrl, sendingSigner, {
                gasLimits: {
                    send: 80000,
                    ibcTransfer: 120000,
                    delegate: 250000,
                    undelegate: 250000,
                    redelegate: 250000,
                    // The gas multiplication per rewards.
                    withdrawRewards: 140000,
                    govVote: 250000,
                },
            });
        });
    }
    getQueryClient(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = this.getIBCChainConfig(chain);
            const tendermintClient = yield tendermint_rpc_1.Tendermint34Client.connect(chainConfig.rpcUrl);
            return stargate_1.QueryClient.withExtensions(tendermintClient, stargate_1.setupIbcExtension, stargate_1.setupBankExtension, stargate_1.setupAuthExtension);
        });
    }
    getIBCDenomTracesLookupCached(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = chain.chainConfig.chainId;
            if (!this.denomTracesCache[chainId]) {
                const promise = this.getIBCDenomTracesLookup(chain);
                this.denomTracesCache[chainId] = promise;
                promise.catch((error) => {
                    delete this.denomTracesCache[chainId];
                    throw error;
                });
            }
            return this.denomTracesCache[chainId];
        });
    }
    getIBCDenomTracesLookup(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = this.getIBCChainConfig(chain);
            // For some networks, the REST denomTraces works...
            // for others, the RPC one works. It's a mystery which networks have which implemented.
            const denomTracesRestPromise = (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const denomTracesRes = yield cross_fetch_1.default(`${chainConfig.restUrl}/ibc/applications/transfer/v1beta1/denom_traces`);
                    if (!denomTracesRes.ok)
                        throw new Error(`Failed to fetch denomTraces for ${chain.displayName}`);
                    const denomTracesJson = yield denomTracesRes.json();
                    return {
                        denomTraces: denomTracesJson.denom_traces.map((denomTrace) => {
                            return {
                                path: denomTrace.path,
                                baseDenom: denomTrace.base_denom,
                            };
                        }),
                    };
                }
                catch (error) {
                    // If REST fails, let it fail and go with RPC instead.
                    return undefined;
                }
            }))();
            const denomTracesRpcPromise = (() => __awaiter(this, void 0, void 0, function* () {
                const queryClient = yield this.getQueryClient(chain);
                return queryClient.ibc.transfer.allDenomTraces();
            }))();
            // Rest usually resolves first...
            let denomTraces = undefined;
            try {
                denomTraces = yield denomTracesRestPromise;
            }
            catch (error) {
                // continue if rest fails...
            }
            if (!(denomTraces === null || denomTraces === void 0 ? void 0 : denomTraces.denomTraces)) {
                // If RPC fails, it's a real error and will throw.
                denomTraces = yield denomTracesRpcPromise;
            }
            const hashToTraceMapping = {};
            for (let denomTrace of denomTraces.denomTraces) {
                const [port, ...channelIds] = denomTrace.path.split("/");
                const hash = yield createIBCHash_1.createIBCHash(port, channelIds[0], denomTrace.baseDenom);
                hashToTraceMapping[hash] = { isValid: false, denomTrace };
            }
            if (chain.network === entities_1.Network.SIFCHAIN) {
                // For sifchain, check for tokens that come from ANY ibc entry
                try {
                    const ibcEntries = (yield this.tokenRegistry.load()).filter((item) => !!item.ibcCounterpartyChannelId);
                    for (let [hash, item] of Object.entries(hashToTraceMapping)) {
                        hashToTraceMapping[hash].isValid = ibcEntries.some((entry) => item.denomTrace.path.startsWith("transfer/" + entry.ibcCounterpartyChannelId) ||
                            item.denomTrace.path.startsWith("transfer/" + entry.ibcChannelId));
                    }
                }
                catch (error) {
                    // invalid token we don't support anymore, ignore
                }
            }
            else {
                try {
                    // For other networks, check for tokens that come from specific counterparty channel
                    const entry = yield this.tokenRegistry.findAssetEntryOrThrow(chain.nativeAsset);
                    const channelId = entry.ibcCounterpartyChannelId;
                    if (!channelId) {
                        throw new Error("Cannot trace denoms, not an IBC chain " + chain.displayName);
                    }
                    for (let [hash, item] of Object.entries(hashToTraceMapping)) {
                        hashToTraceMapping[hash].isValid = item.denomTrace.path.startsWith(`transfer/${channelId}`);
                    }
                }
                catch (error) {
                    // invalid token we don't support anymore, ignore
                }
            }
            return hashToTraceMapping;
        });
    }
    getDenomTraceCached(chain, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            hash = hash.replace("ibc/", "");
            const key = chain.chainConfig.chainId + "_" + hash;
            if (!this.individualDenomTraceCache[key]) {
                this.individualDenomTraceCache[key] = this.getDenomTrace(chain, hash).catch((error) => {
                    delete this.individualDenomTraceCache[key];
                    return Promise.reject(error);
                });
            }
            return this.individualDenomTraceCache[key];
        });
    }
    getDenomTrace(chain, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryClient = yield this.getQueryClient(chain);
            const { denomTrace } = yield queryClient.ibc.transfer.denomTrace(hash);
            if (!denomTrace) {
                return;
            }
            if (chain.network === entities_1.Network.SIFCHAIN) {
                // For sifchain, check if the token came from ANY counterparty network
                const ibcEntries = (yield this.tokenRegistry.load()).filter((item) => !!item.ibcCounterpartyChannelId);
                const isValid = ibcEntries.some((entry) => denomTrace.path.startsWith("transfer/" + entry.ibcCounterpartyChannelId) || denomTrace.path.startsWith("transfer/" + entry.ibcChannelId));
                if (!isValid) {
                    return;
                }
            }
            else {
                // For other networks, check for tokens that come from specific counterparty channel
                const entry = yield this.tokenRegistry.findAssetEntryOrThrow(chain.nativeAsset);
                const channelId = entry.ibcCounterpartyChannelId;
                if (!denomTrace.path.startsWith(`transfer/${channelId}`)) {
                    return;
                }
            }
            return denomTrace;
        });
    }
    fetchBalances(chain, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryClient = yield this.getQueryClient(chain);
            const balances = yield (queryClient === null || queryClient === void 0 ? void 0 : queryClient.bank.allBalances(address));
            const denomTracesLookup = yield this.getIBCDenomTracesLookupCached(chain);
            const assetAmounts = [];
            for (let coin of balances) {
                if (!+coin.amount)
                    continue;
                if (!coin.denom.startsWith("ibc/")) {
                    const asset = chain.lookupAsset(coin.denom);
                    try {
                        // create asset it doesn't exist and is a precision-adjusted counterparty asset
                        const assetAmount = yield this.tokenRegistry.loadNativeAssetAmount(entities_1.AssetAmount(asset || coin.denom, coin.amount));
                        assetAmounts.push(assetAmount);
                    }
                    catch (error) {
                        // invalid token, ignore
                    }
                }
                else {
                    let lookupData = denomTracesLookup[coin.denom];
                    let denomTrace = lookupData === null || lookupData === void 0 ? void 0 : lookupData.denomTrace;
                    if (lookupData && !lookupData.isValid) {
                        continue;
                    }
                    else if (!lookupData) {
                        // If it's not in the master list of all denom traces, that list may just be outdated...
                        // Newly minted tokens aren't added to the master list immediately.
                        // @ts-ignore
                        denomTrace = yield this.getDenomTraceCached(chain, coin.denom);
                    }
                    if (!denomTrace) {
                        continue; // Ignore, it's an invalid coin from invalid chain
                    }
                    const registry = yield this.tokenRegistry.load();
                    const entry = registry.find((e) => {
                        return e.baseDenom === denomTrace.baseDenom;
                    });
                    if (!entry)
                        continue;
                    try {
                        const nativeAsset = entry.unitDenom && entry.baseDenom !== entry.unitDenom
                            ? chain.lookupAssetOrThrow(entry.unitDenom)
                            : chain.lookupAssetOrThrow(entry.baseDenom);
                        let asset = chain.assets.find((asset) => asset.symbol.toLowerCase() === nativeAsset.symbol.toLowerCase());
                        if (asset) {
                            asset.ibcDenom = coin.denom;
                        }
                        const counterpartyAsset = yield this.tokenRegistry.loadCounterpartyAsset(nativeAsset);
                        const assetAmount = entities_1.AssetAmount(counterpartyAsset, coin.amount);
                        assetAmounts.push(yield this.tokenRegistry.loadNativeAssetAmount(assetAmount));
                    }
                    catch (error) {
                        // ignore asset, doesnt exist in our list.
                    }
                }
            }
            return assetAmounts;
        });
    }
}
exports.CosmosWalletProvider = CosmosWalletProvider;
//# sourceMappingURL=CosmosWalletProvider.js.map