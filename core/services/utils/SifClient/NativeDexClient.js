"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.NativeDexClient = void 0;
const TokenRegistryV1Query = __importStar(require("../../../generated/proto/sifnode/tokenregistry/v1/query"));
const TokenRegistryV1Tx = __importStar(require("../../../generated/proto/sifnode/tokenregistry/v1/tx"));
const CLPV1Query = __importStar(require("../../../generated/proto/sifnode/clp/v1/querier"));
const CLPV1Tx = __importStar(require("../../../generated/proto/sifnode/clp/v1/tx"));
const DispensationV1Query = __importStar(require("../../../generated/proto/sifnode/dispensation/v1/query"));
const DispensationV1Tx = __importStar(require("../../../generated/proto/sifnode/dispensation/v1/tx"));
const EthbridgeV1Query = __importStar(require("../../../generated/proto/sifnode/ethbridge/v1/query"));
const EthbridgeV1Tx = __importStar(require("../../../generated/proto/sifnode/ethbridge/v1/tx"));
const IBCTransferV1Tx = __importStar(require("@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx"));
const CosmosBankV1Tx = __importStar(require("@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx"));
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const stargate_1 = require("@cosmjs/stargate");
const registry_1 = require("@cosmjs/stargate/node_modules/@cosmjs/proto-signing/build/registry");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_2 = require("@cosmjs/stargate");
const NativeDexTransaction_1 = require("./NativeDexTransaction");
const launchpad_1 = require("@cosmjs/launchpad");
const parseTxFailure_1 = require("../../../services/SifService/parseTxFailure");
class NativeDexClient {
    constructor(rpcUrl, restUrl, chainId, t34, query, tx) {
        this.rpcUrl = rpcUrl;
        this.restUrl = restUrl;
        this.chainId = chainId;
        this.t34 = t34;
        this.query = query;
        this.tx = tx;
        this.parseTxResult = NativeDexClient.parseTxResult.bind(NativeDexClient);
    }
    static connect(rpcUrl, restUrl, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const t34 = yield tendermint_rpc_1.Tendermint34Client.connect(rpcUrl);
            const query = this.createQueryClient(t34);
            const tx = this.createTxClient();
            const instance = new this(rpcUrl, restUrl, chainId, t34, query, tx);
            return instance;
        });
    }
    static connectByChain(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = chain.chainConfig;
            return NativeDexClient.connect(config.rpcUrl, config.restUrl, config.chainId);
        });
    }
    /**
     *
     * Composes arguments for type Registry
     * @static
     * @return {*}  {[string, GeneratedType][]}
     * @memberof NativeDexClient
     */
    static getGeneratedTypes() {
        return [
            ...stargate_2.defaultRegistryTypes,
            ...this.createCustomTypesForModule(EthbridgeV1Tx),
            ...this.createCustomTypesForModule(DispensationV1Tx),
            ...this.createCustomTypesForModule(CLPV1Tx),
            ...this.createCustomTypesForModule(TokenRegistryV1Tx),
            ...this.createCustomTypesForModule(CosmosBankV1Tx),
        ];
    }
    /**
     *
     * Parses `BroadcastTxResult` into DEXv1-compatible output.
     * Will eventually be replaced with custom NativeDex result types
     * @static
     * @param {BroadcastTxResult} result
     * @return {*}  {TransactionStatus}
     * @memberof NativeDexClient
     */
    static parseTxResult(result) {
        try {
            if (launchpad_1.isBroadcastTxFailure(result)) {
                /* istanbul ignore next */ // TODO: fix coverage
                return parseTxFailure_1.parseTxFailure(result);
            }
            return {
                hash: result.transactionHash,
                memo: "",
                state: "accepted",
            };
        }
        catch (err) {
            const e = err;
            console.log("signAndBroadcast ERROR", e);
            return parseTxFailure_1.parseTxFailure({ transactionHash: "", rawLog: e === null || e === void 0 ? void 0 : e.message });
        }
    }
    /**
     *
     * Transforms custom sifnode protobuf modules into types for registry
     */
    static createCustomTypesForModule(nativeModule) {
        let types = [];
        for (const [prop, type] of Object.entries(nativeModule)) {
            if (!proto_signing_1.isTsProtoGeneratedType(type)) {
                continue;
            }
            types.push([`/${nativeModule.protobufPackage}.${prop}`, type]);
        }
        return types;
    }
    /**
     *
     * Builds registry with custom generated protbuf types
     */
    static getNativeRegistry() {
        return new registry_1.Registry([...NativeDexClient.getGeneratedTypes()]);
    }
    /**
     * Creates a stargate signing client with custom type registry
     */
    createSigningClient(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeRegistry = NativeDexClient.getNativeRegistry();
            const client = yield stargate_2.SigningStargateClient.connectWithSigner(this.rpcUrl, signer, {
                registry: nativeRegistry,
            });
            return client;
        });
    }
    /**
     *
     * Creates a type-safe amino-friendly transaction client API
     * @static
     * @return {*}
     * @memberof NativeDexClient
     */
    static createTxClient() {
        // Takes msg client impl & keeps the first argument, then adds a couple more
        /*
        @mccallofthewild -
         Turns protobuf module into a signing client in the same style as stargate query client.
         The design choice of including sender address & gas fees was made in order to facilitate
         data integrity in the confirmation stage, for both UI's and bots.
        */
        const createTxClient = (txModule) => {
            const protoMethods = txModule.MsgClientImpl.prototype;
            // careful with edits here, as the implementation below is @ts-ignore'd
            const createTxCompositionMethod = (methodName) => {
                const typeUrl = `/${txModule.protobufPackage}.Msg${methodName}`;
                const compositionMethod = (msg, senderAddress, { gas, price } = {
                    gas: this.feeTable.transfer.gas,
                    // @mccallofthewild - May want to change this to an `AssetAmount` at some point once the SDK structure is ready
                    price: {
                        denom: this.feeTable.transfer.amount[0].denom,
                        amount: this.feeTable.transfer.amount[0].amount,
                    },
                }, memo = "") => {
                    delete msg["timeoutTimestamp"];
                    return new NativeDexTransaction_1.NativeDexTransaction(senderAddress, [
                        {
                            typeUrl,
                            value: msg,
                        },
                    ], {
                        gas,
                        price,
                    }, memo);
                };
                compositionMethod.createRawEncodeObject = (msg) => ({
                    typeUrl,
                    value: msg,
                });
                return compositionMethod;
            };
            const signingClientMethods = {};
            for (let method of Object.getOwnPropertyNames(protoMethods)) {
                // @ts-ignore
                signingClientMethods[method] = createTxCompositionMethod(method);
            }
            return signingClientMethods;
        };
        const txs = {
            dispensation: createTxClient(DispensationV1Tx),
            ethbridge: createTxClient(EthbridgeV1Tx),
            clp: createTxClient(CLPV1Tx),
            registry: createTxClient(TokenRegistryV1Tx),
            ibc: createTxClient(IBCTransferV1Tx),
            bank: createTxClient(CosmosBankV1Tx),
        };
        return txs;
    }
    static createQueryClient(t34) {
        return stargate_2.QueryClient.withExtensions(t34, stargate_2.setupIbcExtension, stargate_2.setupBankExtension, stargate_2.setupAuthExtension, (base) => {
            const rpcClient = stargate_2.createProtobufRpcClient(base);
            return {
                tokenregistry: new TokenRegistryV1Query.QueryClientImpl(rpcClient),
                clp: new CLPV1Query.QueryClientImpl(rpcClient),
                dispensation: new DispensationV1Query.QueryClientImpl(rpcClient),
                ethbridge: new EthbridgeV1Query.QueryClientImpl(rpcClient),
            };
        });
    }
}
exports.NativeDexClient = NativeDexClient;
NativeDexClient.feeTable = stargate_1.buildFeeTable(stargate_1.defaultGasPrice, {
    send: 80000,
    transfer: 250000,
    delegate: 250000,
    undelegate: 250000,
    redelegate: 250000,
    // The gas multiplication per rewards.
    withdrawRewards: 140000,
    govVote: 250000,
}, {});
//# sourceMappingURL=NativeDexClient.js.map