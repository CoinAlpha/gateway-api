import { TestSifAccount } from "./accounts";
export declare function createTestSifService(account?: TestSifAccount): Promise<{
    loadNativeDexClient(): Promise<import("../../services/utils/SifClient/NativeDexClient").NativeDexClient>;
    getClient(): import("../../services/utils/SifClient").SifClient | null;
    getState(): {
        connected: boolean;
        address: string;
        accounts: string[];
        balances: import("../..").IAssetAmount[];
        log: string;
    };
    getSupportedTokens(): import("../..").IAsset[];
    setClient(): Promise<void>;
    initProvider(): Promise<void>;
    connect(): Promise<void>;
    isConnected(): boolean;
    unSignedClient: import("../../services/utils/SifClient").SifUnSignedClient;
    onSocketError(handler: (a: any) => void): () => void;
    onTx(handler: (a: any) => void): () => void;
    onNewBlock(handler: (a: any) => void): () => void;
    setPhrase(mnemonic: string): Promise<string>;
    purgeClient(): Promise<void>;
    getBalance(address?: string | undefined, asset?: import("../..").IAsset | undefined): Promise<import("../..").IAssetAmount[]>;
    transfer(params: import("../..").TxParams): Promise<any>;
    signAndBroadcast(msg: import("@cosmjs/launchpad").Msg | import("@cosmjs/launchpad").Msg[], memo?: string | undefined): Promise<import("../..").TransactionStatus>;
}>;
