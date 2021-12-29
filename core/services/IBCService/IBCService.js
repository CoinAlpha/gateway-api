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
exports.IBCService = void 0;
const IBCBridge_1 = require("../../clients/bridges/IBCBridge/IBCBridge");
const entities_1 = require("../../entities");
// NOTE(ajoslin): this is deprecated, most functionality is moved to IBCBridge
// debug functions only left here or functions with old signatures
class IBCService extends IBCBridge_1.IBCBridge {
    static create(context) {
        return new IBCService(context);
    }
    // Backwards compatibility with old API
    transferIBCTokens(params, { shouldBatchTransfers = false, maxMsgsPerBatch = 800, maxAmountPerMsg = `9223372036854775807`, gasPerBatch = undefined, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromChain = entities_1.getChainsService().get(params.sourceNetwork);
            const toChain = entities_1.getChainsService().get(params.destinationNetwork);
            return this.bridgeTokens(this.context.cosmosWalletProvider, {
                assetAmount: params.assetAmountToTransfer,
                fromAddress: yield this.context.cosmosWalletProvider.connect(fromChain),
                toAddress: yield this.context.cosmosWalletProvider.connect(toChain),
                fromChain,
                toChain,
            }, {
                shouldBatchTransfers,
                maxMsgsPerBatch,
                maxAmountPerMsg,
                gasPerBatch,
            });
        });
    }
    logIBCNetworkMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            const allClients = [];
            const destinationNetwork = entities_1.Network.SIFCHAIN;
            let chainConfig;
            try {
                // if (destinationNetwork === Network.REGEN) throw "";
                chainConfig = this.loadChainConfigByNetwork(destinationNetwork);
            }
            catch (e) {
                // continue;
            }
            yield this.context.cosmosWalletProvider.connect(entities_1.getChainsService().get(destinationNetwork));
            const queryClient = yield this.loadQueryClientByNetwork(destinationNetwork);
            const allChannels = yield queryClient.ibc.channel.allChannels();
            let clients = yield Promise.all(allChannels.channels.map((channel) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const parsedClientState = yield fetch(`${chainConfig.restUrl}/ibc/core/connection/v1beta1/connections/${channel.connectionHops[0]}/client_state`).then((r) => r.json());
                    // console.log(parsedClientState);
                    // const allAcks = await queryClient.ibc.channel.allPacketAcknowledgements(
                    //   channel.portId,
                    //   channel.channelId,
                    // );
                    const channelId = channel.channelId;
                    const counterpartyChannelId = channel.counterparty.channelId;
                    const counterPartyChainId = parsedClientState.identified_client_state.client_state.chain_id;
                    const counterpartyConfig = this.loadChainConfigByChainId(counterPartyChainId);
                    const counterpartyQueryClient = yield this.loadQueryClientByNetwork(counterpartyConfig.network);
                    const counterpartyConnection = yield counterpartyQueryClient.ibc.channel.channel("transfer", counterpartyChannelId);
                    return {
                        srcChainId: chainConfig.chainId,
                        destChainId: counterPartyChainId,
                        // ackCount: allAcks.acknowledgements.length,
                        srcCxn: channel.connectionHops[0],
                        destCxn: (_a = counterpartyConnection.channel) === null || _a === void 0 ? void 0 : _a.connectionHops[0],
                        srcChannel: channelId,
                        destChannel: counterpartyChannelId,
                    };
                }
                catch (e) {
                    console.error(e);
                    return;
                }
            })));
            allClients.push(...clients.filter((c) => c));
            console.log(destinationNetwork.toUpperCase());
            console.table(clients.filter((c) => {
                return true;
            }));
            const tokenRegistryEntries = yield this.tokenRegistry.load();
            console.log("Sifchain Connections: ");
            console.log(JSON.stringify(allClients.filter((clientA) => {
                return tokenRegistryEntries.some((e) => e.ibcChannelId === clientA.srcChannel &&
                    e.ibcCounterpartyChannelId === clientA.destChannel);
            }), null, 2));
            // for (let clientA of allClients.filter((c) =>
            //   c.chainId.includes("sifchain"),
            // )) {
            //   for (let clientB of allClients) {
            //     if (
            //       clientA.counterPartyChainId === clientB.chainId &&
            //       clientA?.channelId === clientB.counterpartyChannelId &&
            // tokenRegistryEntries.some(
            //   (e) =>
            //     e.ibcChannelId === clientA.channelId &&
            //     e.ibcCounterpartyChannelId === clientA.counterpartyChannelId,
            // )
            //     ) {
            //       connections.push({
            //         srcChainId: clientA.chainId,
            //         destChainId: clientB.chainId,
            //         srcCxn: clientA.connection,
            //         dstCxn: clientB.connection,
            //         srcChannel: clientA.channelId,
            //         destChannel: clientB.channelId,
            //       });
            //     }
            //   }
            // }
        });
    }
}
exports.IBCService = IBCService;
function createIBCService(context) {
    return IBCService.create(context);
}
exports.default = createIBCService;
//# sourceMappingURL=IBCService.js.map