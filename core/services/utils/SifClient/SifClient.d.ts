import { Account, BroadcastMode, CosmosFeeTable, GasLimits, GasPrice, OfflineSigner, SigningCosmosClient, StdTx, BroadcastTxResult } from "@cosmjs/launchpad";
import { SifUnSignedClient } from "./SifUnsignedClient";
import { CosmosClient } from "@cosmjs/launchpad";
export declare class Compatible42CosmosClient extends CosmosClient {
    broadcastTx(tx: StdTx): Promise<BroadcastTxResult>;
}
export declare class Compatible42SigningCosmosClient extends SigningCosmosClient {
    constructor(apiUrl: string, senderAddress: string, signer: OfflineSigner, gasPrice?: GasPrice, gasLimits?: Partial<GasLimits<CosmosFeeTable>>, broadcastMode?: BroadcastMode);
    broadcastTx(tx: StdTx): Promise<BroadcastTxResult>;
}
export declare class SifClient extends Compatible42SigningCosmosClient {
    private wallet;
    private unsignedClient;
    rpcUrl: string;
    constructor(apiUrl: string, senderAddress: string, signer: OfflineSigner, wsUrl: string, rpcUrl: string, gasPrice?: GasPrice, gasLimits?: Partial<GasLimits<CosmosFeeTable>>, broadcastMode?: BroadcastMode);
    getRpcUrl(): string;
    getBankBalances(address: string): Promise<object[]>;
    getAccounts(): Promise<string[]>;
    getAccount(address: string): Promise<Account>;
    getUnsignedClient(): SifUnSignedClient;
}
