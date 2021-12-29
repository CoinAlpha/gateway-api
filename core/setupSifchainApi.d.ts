import { NetworkEnv } from "./config/getEnv";
export declare function setupSifchainApi(environment?: NetworkEnv): {
    services: {
        Web3: typeof import("web3").default;
        chains: import("./services/ChainsService").ChainsService;
        ibc: import("./services/IBCService/IBCService").IBCService;
        clp: {
            getRawPools: () => Promise<import("./generated/proto/sifnode/clp/v1/querier").PoolsRes>;
            getAccountLiquidityProviderData: (params: {
                lpAddress: string;
            }) => Promise<import("./generated/proto/sifnode/clp/v1/types").LiquidityProviderData[]>;
            getPools: () => Promise<{
                amounts: [import(".").IAssetAmount, import(".").IAssetAmount];
                readonly externalAmount: import(".").IAssetAmount | undefined;
                readonly nativeAmount: import(".").IAssetAmount | undefined;
                otherAsset: (asset: import(".").IAsset) => import(".").IAssetAmount;
                symbol: () => string;
                contains: (...assets: import(".").IAsset[]) => boolean;
                toString: () => string;
                getAmount: (asset: string | import(".").IAsset) => import(".").IAssetAmount;
                poolUnits: import(".").IAmount;
                priceAsset(asset: import(".").IAsset): import(".").IAssetAmount;
                calcProviderFee(x: import(".").IAssetAmount): import(".").IAssetAmount;
                calcPriceImpact(x: import(".").IAssetAmount): import(".").IAmount;
                calcSwapResult(x: import(".").IAssetAmount): import(".").IAssetAmount;
                calcReverseSwapResult(Sa: import(".").IAssetAmount): import(".").IAssetAmount;
                calculatePoolUnits(nativeAssetAmount: import(".").IAssetAmount, externalAssetAmount: import(".").IAssetAmount): import(".").IAmount[];
            }[]>;
            getPoolSymbolsByLiquidityProvider: (address: string) => Promise<string[]>;
            swap: (params: {
                fromAddress: string;
                sentAmount: import(".").IAssetAmount;
                receivedAsset: import(".").IAsset;
                minimumReceived: import(".").IAssetAmount;
            }) => any;
            addLiquidity: (params: {
                fromAddress: string;
                nativeAssetAmount: import(".").IAssetAmount;
                externalAssetAmount: import(".").IAssetAmount;
            }) => any;
            createPool: (params: {
                fromAddress: string;
                nativeAssetAmount: import(".").IAssetAmount;
                externalAssetAmount: import(".").IAssetAmount;
            }) => any;
            getLiquidityProvider: (params: {
                asset: import(".").IAsset;
                lpAddress: string;
            }) => Promise<import(".").LiquidityProvider | null>;
            removeLiquidity: (params: {
                wBasisPoints: string;
                asymmetry: string;
                asset: import(".").IAsset;
                fromAddress: string;
            }) => any;
        };
        sif: {
            loadNativeDexClient(): Promise<import("./services/utils/SifClient/NativeDexClient").NativeDexClient>;
            getClient(): import("./services/utils/SifClient").SifClient | null;
            getState(): {
                connected: boolean;
                address: string;
                accounts: string[];
                balances: import(".").IAssetAmount[];
                log: string;
            };
            getSupportedTokens(): import(".").IAsset[];
            setClient(): Promise<void>;
            initProvider(): Promise<void>;
            connect(): Promise<void>;
            isConnected(): boolean;
            unSignedClient: import("./services/utils/SifClient").SifUnSignedClient;
            onSocketError(handler: (a: any) => void): () => void;
            onTx(handler: (a: any) => void): () => void;
            onNewBlock(handler: (a: any) => void): () => void;
            setPhrase(mnemonic: string): Promise<string>;
            purgeClient(): Promise<void>;
            getBalance(address?: string | undefined, asset?: import(".").IAsset | undefined): Promise<import(".").IAssetAmount[]>;
            transfer(params: import(".").TxParams): Promise<any>;
            signAndBroadcast(msg: import("@cosmjs/launchpad").Msg | import("@cosmjs/launchpad").Msg[], memo?: string | undefined): Promise<import(".").TransactionStatus>;
        };
        ethbridge: import("./clients/bridges/EthBridge/EthBridge").EthBridge;
        bus: {
            onAny(handler: import("./services/EventBusService").EventHandler): void;
            on(eventType: "ErrorEvent" | "SuccessEvent" | "InfoEvent" | "TransactionErrorEvent" | "WalletConnectedEvent" | "WalletDisconnectedEvent" | "WalletConnectionErrorEvent" | "PegTransactionPendingEvent" | "PegTransactionCompletedEvent" | "PegTransactionErrorEvent" | "UnpegTransactionPendingEvent" | "UnpegTransactionCompletedEvent" | "UnpegTransactionErrorEvent" | "NoLiquidityPoolsFoundEvent" | import("./services/EventBusService").AppEventTypes, handler: import("./services/EventBusService").EventHandler): void;
            dispatch(event: import("./services/EventBusService").AppEvent): void;
        };
        dispensation: {
            claim: (params: {
                claimType: import("./generated/proto/sifnode/dispensation/v1/types").DistributionType;
                fromAddress: string;
            }) => any;
        };
        cryptoeconomics: {
            fetchData: (props: import("./services/CryptoeconomicsService").FetchDataProps) => Promise<import("./services/CryptoeconomicsService").CryptoeconomicsUserData>;
            getAddressLink: (address: string, rewardType: import("./services/CryptoeconomicsService").CryptoeconomicsRewardType) => string;
            fetchSummaryAPY({ rewardProgram, devnet, }: {
                rewardProgram?: "harvest" | undefined;
                devnet?: boolean | undefined;
            }): Promise<number>;
            fetchVsData: (options: import("./services/CryptoeconomicsService").FetchDataProps) => Promise<import("./services/CryptoeconomicsService").CryptoeconomicsUserData>;
            fetchLmData: (options: import("./services/CryptoeconomicsService").FetchDataProps) => Promise<import("./services/CryptoeconomicsService").CryptoeconomicsUserData>;
            fetchTimeseriesData: (props: {
                address: string;
                devnet: boolean;
            }) => Promise<import("./services/CryptoeconomicsService").CryptoeconomicsTimeseriesItem[]>;
        };
        storage: {
            getJSONItem<T>(key: string): T | undefined;
            setJSONItem<T_1>(key: string, value: T_1): void;
            getItem: (key: string) => string | null;
            setItem: (key: string, value: string) => void;
        };
        wallet: import("./services/WalletService").WalletService;
        tokenRegistry: {
            load: () => Promise<import("./generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry[]>;
            findAssetEntry: (asset: import(".").IAsset) => Promise<import("./generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
            findAssetEntryOrThrow: (asset: import(".").IAsset) => Promise<import("./generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>;
            loadCounterpartyEntry(nativeAsset: import(".").IAsset): Promise<import("./generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
            loadCounterpartyAsset(nativeAsset: import(".").IAsset): Promise<import(".").IAsset>;
            loadNativeAsset(counterpartyAsset: import(".").IAsset): Promise<import(".").IAsset>;
            loadCounterpartyAssetAmount: (nativeAssetAmount: import(".").IAssetAmount) => Promise<import(".").IAssetAmount>;
            loadNativeAssetAmount: (assetAmount: import(".").IAssetAmount) => Promise<import(".").IAssetAmount>;
            loadConnectionByNetworks(params: {
                sourceNetwork: import(".").Network;
                destinationNetwork: import(".").Network;
            }): Promise<{
                channelId: string | undefined;
            }>;
            loadConnection(params: {
                fromChain: import(".").Chain;
                toChain: import(".").Chain;
            }): Promise<{
                channelId: string | undefined;
            }>;
        };
    };
    store: import("./store").Store;
    cleanup: () => void;
    config: import("./services").ServiceContext;
};
