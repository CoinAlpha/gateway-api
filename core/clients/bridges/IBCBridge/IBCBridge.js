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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBCBridge = void 0;
const cosmosclient_1 = require("@cosmjs/launchpad/build/cosmosclient");
const stargate_1 = require("@cosmjs/stargate");
const logs_1 = require("@cosmjs/stargate/build/logs");
const queries_1 = require("@cosmjs/stargate/build/queries");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const cross_fetch_1 = require("cross-fetch");
const entities_1 = require("../../../entities");
const TokenRegistryService_1 = require("../../../services/TokenRegistryService/TokenRegistryService");
const NativeAminoTypes_1 = require("../../../services/utils/SifClient/NativeAminoTypes");
const NativeDexClient_1 = require("../../../services/utils/SifClient/NativeDexClient");
const NativeDexTransaction_1 = require("../../../services/utils/SifClient/NativeDexTransaction");
const ibcExportFees_1 = require("../../../utils/ibcExportFees");
const BaseBridge_1 = require("../BaseBridge");
const getTransferTimeoutData_1 = require("./getTransferTimeoutData");
const parseTxFailure_1 = require("../../../services/SifService/parseTxFailure");
class IBCBridge extends BaseBridge_1.BaseBridge {
    constructor(context) {
        super();
        this.context = context;
        this.tokenRegistry = TokenRegistryService_1.TokenRegistryService(this.context);
        this.transferTimeoutMinutes = 45;
        this.gasPrices = {};
        this.lastFetchedGasPricesAt = 0;
    }
    static create(context) {
        return new this(context);
    }
    loadChainConfigByChainId(chainId) {
        // @ts-ignore
        const chainConfig = Object.values(this.context.chainConfigsByNetwork).find((c) => (c === null || c === void 0 ? void 0 : c.chainId) === chainId);
        if ((chainConfig === null || chainConfig === void 0 ? void 0 : chainConfig.chainType) !== "ibc") {
            throw new Error(`No IBC chain config for network ${chainId}`);
        }
        return chainConfig;
    }
    loadChainConfigByNetwork(network) {
        // @ts-ignore
        const chainConfig = this.context.chainConfigsByNetwork[network];
        if ((chainConfig === null || chainConfig === void 0 ? void 0 : chainConfig.chainType) !== "ibc") {
            throw new Error(`No IBC chain config for network ${network}`);
        }
        return chainConfig;
    }
    extractTransferMetadataFromTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = logs_1.parseRawLog(tx.rawLog);
            const sequence = logs_1.findAttribute(logs, "send_packet", "packet_sequence")
                .value;
            const dstChannel = logs_1.findAttribute(logs, "send_packet", "packet_dst_channel")
                .value;
            const dstPort = logs_1.findAttribute(logs, "send_packet", "packet_dst_port").value;
            const packet = logs_1.findAttribute(logs, "send_packet", "packet_data").value;
            const timeoutTimestampNanoseconds = logs_1.findAttribute(logs, "send_packet", "packet_timeout_timestamp").value;
            return {
                sequence,
                dstChannel,
                dstPort,
                packet,
                timeoutTimestampNanoseconds,
            };
        });
    }
    checkIfPacketReceivedByTx(txOrTxHash, destinationNetwork) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceChain = this.loadChainConfigByNetwork(destinationNetwork);
            const client = yield stargate_1.StargateClient.connect(sourceChain.rpcUrl);
            const tx = typeof txOrTxHash === "string"
                ? yield client.getTx(txOrTxHash)
                : txOrTxHash;
            if (typeof tx !== "object" || tx === null)
                throw new Error("invalid txOrTxHash. not found");
            const meta = yield this.extractTransferMetadataFromTx(tx);
            return this.checkIfPacketReceived(destinationNetwork, meta.dstChannel, meta.dstPort, meta.sequence);
        });
    }
    checkIfPacketReceived(network, receivingChannelId, receivingPort, sequence) {
        return __awaiter(this, void 0, void 0, function* () {
            const didReceive = Promise.resolve()
                .then((e) => __awaiter(this, void 0, void 0, function* () {
                const queryClient = yield this.loadQueryClientByNetwork(network);
                const receipt = yield queryClient.ibc.channel.packetReceipt(receivingPort, receivingChannelId, +sequence);
                return receipt.received;
            }))
                .catch((e) => {
                return cross_fetch_1.fetch(`${this.loadChainConfigByNetwork(network).restUrl}/ibc/core/channel/v1beta1/channels/${receivingChannelId}/ports/${receivingPort}/packet_receipts/${sequence}`).then((r) => r.json().then((res) => {
                    return res.received;
                }));
            });
            return didReceive;
        });
    }
    loadQueryClientByNetwork(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const destChainConfig = this.loadChainConfigByNetwork(network);
            const tendermintClient = yield tendermint_rpc_1.Tendermint34Client.connect(destChainConfig.rpcUrl);
            const queryClient = queries_1.QueryClient.withExtensions(tendermintClient, queries_1.setupIbcExtension, queries_1.setupBankExtension, queries_1.setupAuthExtension);
            return queryClient;
        });
    }
    resolveBridgeParamsForImport(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const paramsCopy = __rest(params, []);
            if (params.toChain.network === entities_1.Network.SIFCHAIN &&
                params.fromChain.chainConfig.chainType === "ibc") {
                paramsCopy.assetAmount = yield this.tokenRegistry.loadCounterpartyAssetAmount(params.assetAmount);
            }
            return paramsCopy;
        });
    }
    fetchTransferGasFee(fromChain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Date.now() - this.lastFetchedGasPricesAt > 5 * 60 * 1000) {
                try {
                    this.gasPrices = yield cross_fetch_1.fetch("https://gas-meter.vercel.app/gas-v1.json").then((r) => {
                        return r.json();
                    });
                    this.lastFetchedGasPricesAt = Date.now();
                }
                catch (error) {
                    this.gasPrices = {};
                }
            }
            return entities_1.AssetAmount(fromChain.nativeAsset, this.gasPrices[fromChain.chainConfig.chainId] ||
                NativeDexClient_1.NativeDexClient.feeTable.transfer.gas);
        });
    }
    bridgeTokens(provider, _params, 
    // Load testing options
    { shouldBatchTransfers = false, maxMsgsPerBatch = 800, maxAmountPerMsg = `9223372036854775807`, gasPerBatch = undefined, } = {}) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield this.resolveBridgeParamsForImport(_params);
            const toChainConfig = provider.getIBCChainConfig(params.toChain);
            const fromChainConfig = provider.getIBCChainConfig(params.fromChain);
            const receivingSigner = yield provider.getSendingSigner(params.toChain);
            const receivingStargateCient = yield (stargate_1.SigningStargateClient === null || stargate_1.SigningStargateClient === void 0 ? void 0 : stargate_1.SigningStargateClient.connectWithSigner(toChainConfig.rpcUrl, receivingSigner, {
                // we create amino additions, but these will not be used, because IBC types are already included & assigned
                // on top of the amino additions by default
                aminoTypes: new NativeAminoTypes_1.NativeAminoTypes(),
                gasLimits: {
                    send: 80000,
                    transfer: 360000,
                    delegate: 250000,
                    undelegate: 250000,
                    redelegate: 250000,
                    // The gas multiplication per rewards.
                    withdrawRewards: 140000,
                    govVote: 250000,
                },
            }));
            const { channelId } = yield this.tokenRegistry.loadConnection({
                fromChain: params.fromChain,
                toChain: params.toChain,
            });
            const symbol = params.assetAmount.asset.symbol;
            const registry = yield this.tokenRegistry.load();
            const transferTokenEntry = registry.find((t) => t.baseDenom === symbol);
            const timeoutHeight = yield getTransferTimeoutData_1.getTransferTimeoutData(receivingStargateCient, this.transferTimeoutMinutes);
            if (!transferTokenEntry) {
                throw new Error("Invalid transfer symbol not in whitelist: " + symbol);
            }
            const totalSupply = yield (yield provider.getQueryClient(params.fromChain)).bank.totalSupply();
            let transferDenom;
            if (totalSupply.some((coin) => coin.denom === transferTokenEntry.baseDenom)) {
                // transfering FROM token entry's token's chain: use baseDenom
                transferDenom = transferTokenEntry.baseDenom;
            }
            else {
                const ibcDenom = transferTokenEntry.denom.startsWith("ibc/")
                    ? transferTokenEntry.denom
                    : yield provider.createIBCHash("transfer", channelId, transferTokenEntry.denom);
                // transfering this entry's token elsewhere: use ibc hash
                transferDenom = params.assetAmount.asset.ibcDenom || ibcDenom;
            }
            const sifConfig = this.loadChainConfigByNetwork(entities_1.Network.SIFCHAIN);
            const client = yield NativeDexClient_1.NativeDexClient.connect(sifConfig.rpcUrl, sifConfig.restUrl, sifConfig.chainId);
            if (!channelId)
                throw new Error("Channel id not found");
            let encodeMsgs = [
                client.tx.ibc.Transfer.createRawEncodeObject({
                    sourcePort: "transfer",
                    sourceChannel: channelId,
                    sender: params.fromAddress,
                    receiver: params.toAddress,
                    token: {
                        denom: transferDenom,
                        amount: params.assetAmount.toBigInt().toString(),
                    },
                    timeoutHeight: timeoutHeight,
                }),
            ];
            const feeAmount = yield this.estimateFees(provider, params);
            if (feeAmount === null || feeAmount === void 0 ? void 0 : feeAmount.amount.greaterThan("0")) {
                const feeEntry = registry.find((item) => item.baseDenom === feeAmount.asset.symbol);
                if (!feeEntry) {
                    throw new Error("Failed to find whiteliste entry for fee symbol " +
                        feeAmount.asset.symbol);
                }
                const sendFeeMsg = client.tx.bank.Send.createRawEncodeObject({
                    fromAddress: params.fromAddress,
                    toAddress: ibcExportFees_1.IBC_EXPORT_FEE_ADDRESS,
                    amount: [
                        {
                            denom: feeEntry.denom,
                            amount: feeAmount.toBigInt().toString(),
                        },
                    ],
                });
                encodeMsgs.unshift(sendFeeMsg);
            }
            const batches = [];
            while (encodeMsgs.length) {
                batches.push(encodeMsgs.splice(0, maxMsgsPerBatch));
            }
            console.log({ batches });
            const responses = [];
            for (let batch of batches) {
                try {
                    const gasAssetAmount = yield this.fetchTransferGasFee(params.fromChain);
                    const txDraft = new NativeDexTransaction_1.NativeDexTransaction(params.fromAddress, batch, {
                        price: {
                            denom: params.fromChain.nativeAsset.symbol,
                            amount: ((_a = fromChainConfig.keplrChainInfo.gasPriceStep) === null || _a === void 0 ? void 0 : _a.high.toString()) ||
                                NativeDexClient_1.NativeDexClient.feeTable.transfer.amount[0].amount,
                        },
                        gas: 
                        // crank the gas when a decimal conversion is occuring on sifnode
                        transferTokenEntry.ibcCounterpartyDenom &&
                            transferTokenEntry.ibcCounterpartyDenom !== transferTokenEntry.denom
                            ? "500000"
                            : gasAssetAmount.toBigInt().toString(),
                    });
                    const signedTx = yield provider.sign(params.fromChain, txDraft);
                    const sentTx = yield provider.broadcast(params.fromChain, signedTx);
                    responses.push(sentTx);
                }
                catch (err) {
                    console.error(err);
                    const e = err;
                    responses.push({
                        code: +(((_e = (_d = (_c = (_b = e === null || e === void 0 ? void 0 : e.message) === null || _b === void 0 ? void 0 : _b.split("code ")) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.split(" ")) === null || _e === void 0 ? void 0 : _e[0]) || "") ||
                            100000000000000000,
                        log: e.message,
                        rawLog: e.message,
                        transactionHash: "",
                        hash: new Uint8Array(),
                        events: [],
                        height: -1,
                    });
                }
            }
            console.log({ responses });
            return responses;
        });
    }
    estimateFees(wallet, params) {
        if (params.toChain.network !== entities_1.Network.SIFCHAIN) {
            return ibcExportFees_1.calculateIBCExportFee(params.assetAmount);
        }
        else {
            return undefined;
        }
    }
    // No approvals needed for IBC transfers.
    approveTransfer(provider, params) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    transfer(provider, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield this.bridgeTokens(provider, params);
            // Get the last of the batched tx first.
            for (let txResult of responses.reverse()) {
                if (cosmosclient_1.isBroadcastTxFailure(txResult)) {
                    throw new Error(parseTxFailure_1.parseTxFailure(txResult).memo);
                }
                const logs = logs_1.parseRawLog(txResult.rawLog);
                // Abort if not IBC transfer tx receipt (eg a fee payment)
                if (!logs.some((item) => item.events.some((ev) => ev.type === "ibc_transfer"))) {
                    continue;
                }
                return Object.assign(Object.assign({ type: "ibc" }, params), { hash: txResult.transactionHash, meta: {
                        logs,
                    } });
            }
            throw new Error("No transactions sent");
        });
    }
    waitForTransferComplete(provider, tx, onUpdate) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ibcTx = tx;
            // Filter out non-ibc tx from logs like fee transfers
            const logs = (_b = (_a = ibcTx.meta) === null || _a === void 0 ? void 0 : _a.logs) === null || _b === void 0 ? void 0 : _b.filter((item) => item.events.some((ev) => ev.type === "ibc_transfer"));
            if (!logs)
                return false;
            const sequence = logs_1.findAttribute(logs, "send_packet", "packet_sequence");
            const dstChannel = logs_1.findAttribute(logs, "send_packet", "packet_dst_channel");
            const dstPort = logs_1.findAttribute(logs, "send_packet", "packet_dst_port");
            const timeoutHeight = logs_1.findAttribute(logs, "send_packet", "packet_timeout_height");
            // timeoutHeight comes back from logs in format with `1-` in front sometimes.
            // i.e.: {value: '1-2048035'}
            let timeoutHeightValue = parseInt(timeoutHeight.value.split("-")[1] || timeoutHeight.value);
            const config = tx.toChain.chainConfig;
            const client = yield (stargate_1.SigningStargateClient === null || stargate_1.SigningStargateClient === void 0 ? void 0 : stargate_1.SigningStargateClient.connectWithSigner(config.rpcUrl, yield provider.getSendingSigner(tx.toChain)));
            while (true) {
                yield new Promise((r) => setTimeout(r, 5000));
                const blockHeight = yield client.getHeight();
                if (blockHeight >= timeoutHeightValue) {
                    throw new Error("Timed out waiting for packet receipt");
                }
                try {
                    const received = yield this.checkIfPacketReceived(tx.toChain.network, dstChannel.value, dstPort.value, sequence.value);
                    if (received) {
                        return true;
                    }
                }
                catch (e) { }
            }
        });
    }
}
exports.IBCBridge = IBCBridge;
exports.default = IBCBridge.create;
//# sourceMappingURL=IBCBridge.js.map