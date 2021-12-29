import { WalletProvider, WalletProviderContext } from "../WalletProvider";
import TokenRegistryService from "../../../services/TokenRegistryService";
import { Chain, IBCChainConfig, IAssetAmount } from "../../../entities";
import { OfflineSigner, OfflineDirectSigner, EncodeObject } from "@cosmjs/proto-signing";
import { SigningStargateClient, QueryClient } from "@cosmjs/stargate";
import { DenomTrace } from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/transfer";
import { NativeDexTransaction } from "../../../services/utils/SifClient/NativeDexTransaction";
import { BroadcastTxResult } from "@cosmjs/launchpad";
declare type IBCHashDenomTraceLookup = Record<string, {
    isValid: boolean;
    denomTrace: DenomTrace;
}>;
export declare abstract class CosmosWalletProvider extends WalletProvider<EncodeObject> {
    context: WalletProviderContext;
    tokenRegistry: ReturnType<typeof TokenRegistryService>;
    constructor(context: WalletProviderContext);
    isChainSupported(chain: Chain): boolean;
    parseTxResultToStatus(txResult: BroadcastTxResult): import("../../../entities").TransactionStatus;
    abstract getSendingSigner(chain: Chain): Promise<OfflineSigner & OfflineDirectSigner>;
    getRequiredApprovalAmount(chain: Chain, tx: NativeDexTransaction<EncodeObject>, amount: IAssetAmount): Promise<IAssetAmount>;
    approve(chain: Chain, tx: NativeDexTransaction<EncodeObject>, amount: IAssetAmount): Promise<void>;
    getIBCChainConfig(chain: Chain): IBCChainConfig;
    createIBCHash: (port: string, channelId: string, denom: string) => Promise<string>;
    getStargateClient(chain: Chain): Promise<SigningStargateClient>;
    getQueryClient(chain: Chain): Promise<QueryClient & import("@cosmjs/stargate").IbcExtension & import("@cosmjs/stargate").BankExtension & import("@cosmjs/stargate").AuthExtension>;
    private denomTracesCache;
    getIBCDenomTracesLookupCached(chain: Chain): Promise<Record<string, {
        isValid: boolean;
        denomTrace: DenomTrace;
    }>>;
    getIBCDenomTracesLookup(chain: Chain): Promise<IBCHashDenomTraceLookup>;
    private individualDenomTraceCache;
    getDenomTraceCached(chain: Chain, hash: string): Promise<DenomTrace | undefined>;
    getDenomTrace(chain: Chain, hash: string): Promise<DenomTrace | undefined>;
    fetchBalances(chain: Chain, address: string): Promise<IAssetAmount[]>;
}
export {};
