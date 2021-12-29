import { BroadcastTxResult } from "@cosmjs/launchpad/build/cosmosclient";
import { IndexedTx } from "@cosmjs/stargate";
import { QueryClient } from "@cosmjs/stargate/build/queries";
import { Asset, IBCChainConfig, Network, NetworkChainConfigLookup, Chain } from "../../../entities";
import { SifUnSignedClient } from "../../../services/utils/SifClient";
import { CosmosWalletProvider } from "../../wallets/cosmos/CosmosWalletProvider";
import { BaseBridge, BridgeParams, IBCBridgeTx, BridgeTx } from "../BaseBridge";
export declare type IBCBridgeContext = {
    sifRpcUrl: string;
    sifApiUrl: string;
    sifChainId: string;
    assets: Asset[];
    chainConfigsByNetwork: NetworkChainConfigLookup;
    sifUnsignedClient?: SifUnSignedClient;
    cosmosWalletProvider: CosmosWalletProvider;
};
export declare class IBCBridge extends BaseBridge<CosmosWalletProvider> {
    context: IBCBridgeContext;
    tokenRegistry: {
        load: () => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry[]>;
        findAssetEntry: (asset: import("../../../entities").IAsset) => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        findAssetEntryOrThrow: (asset: import("../../../entities").IAsset) => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>;
        loadCounterpartyEntry(nativeAsset: import("../../../entities").IAsset): Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        loadCounterpartyAsset(nativeAsset: import("../../../entities").IAsset): Promise<import("../../../entities").IAsset>;
        loadNativeAsset(counterpartyAsset: import("../../../entities").IAsset): Promise<import("../../../entities").IAsset>;
        loadCounterpartyAssetAmount: (nativeAssetAmount: import("../../../entities").IAssetAmount) => Promise<import("../../../entities").IAssetAmount>;
        loadNativeAssetAmount: (assetAmount: import("../../../entities").IAssetAmount) => Promise<import("../../../entities").IAssetAmount>;
        loadConnectionByNetworks(params: {
            sourceNetwork: Network;
            destinationNetwork: Network;
        }): Promise<{
            channelId: string | undefined;
        }>;
        loadConnection(params: {
            fromChain: Chain;
            toChain: Chain;
        }): Promise<{
            channelId: string | undefined;
        }>;
    };
    transferTimeoutMinutes: number;
    constructor(context: IBCBridgeContext);
    static create(context: IBCBridgeContext): IBCBridge;
    loadChainConfigByChainId(chainId: string): IBCChainConfig;
    loadChainConfigByNetwork(network: Network): IBCChainConfig;
    extractTransferMetadataFromTx(tx: IndexedTx | BroadcastTxResult): Promise<{
        sequence: string;
        dstChannel: string;
        dstPort: string;
        packet: string;
        timeoutTimestampNanoseconds: string;
    }>;
    checkIfPacketReceivedByTx(txOrTxHash: string | IndexedTx | BroadcastTxResult, destinationNetwork: Network): Promise<any>;
    checkIfPacketReceived(network: Network, receivingChannelId: string, receivingPort: string, sequence: string | number): Promise<any>;
    loadQueryClientByNetwork(network: Network): Promise<QueryClient & import("@cosmjs/stargate").IbcExtension & import("@cosmjs/stargate").BankExtension & import("@cosmjs/stargate").AuthExtension>;
    private resolveBridgeParamsForImport;
    private gasPrices;
    private lastFetchedGasPricesAt;
    fetchTransferGasFee(fromChain: Chain): Promise<import("../../../entities").IAssetAmount>;
    bridgeTokens(provider: CosmosWalletProvider, _params: BridgeParams, { shouldBatchTransfers, maxMsgsPerBatch, maxAmountPerMsg, gasPerBatch, }?: {
        shouldBatchTransfers?: boolean | undefined;
        maxMsgsPerBatch?: number | undefined;
        maxAmountPerMsg?: string | undefined;
        gasPerBatch?: undefined;
    }): Promise<BroadcastTxResult[]>;
    estimateFees(wallet: CosmosWalletProvider, params: BridgeParams): import("../../../entities").IAssetAmount | undefined;
    approveTransfer(provider: CosmosWalletProvider, params: BridgeParams): Promise<void>;
    transfer(provider: CosmosWalletProvider, params: BridgeParams): Promise<IBCBridgeTx>;
    waitForTransferComplete(provider: CosmosWalletProvider, tx: BridgeTx, onUpdate?: (update: Partial<BridgeTx>) => void): Promise<boolean>;
}
declare const _default: typeof IBCBridge.create;
export default _default;
