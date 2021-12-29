import { IAsset, Chain, Network } from "../entities";
import { IBCServiceContext } from "./IBCService/IBCService";
import { EthbridgeServiceContext } from "./EthbridgeService";
import { SifServiceContext } from "./SifService";
import { ClpServiceContext } from "./ClpService";
import { EventBusServiceContext } from "./EventBusService";
import { ChainsServiceContext } from "./ChainsService/ChainsService";
import { IDispensationServiceContext } from "./DispensationService";
import { CryptoeconomicsServiceContext } from "./CryptoeconomicsService";
import { StorageServiceContext } from "./StorageService";
import { WalletServiceContext } from "./WalletService";
import { TokenRegistryContext } from "./TokenRegistryService";
import { NativeDexClient } from "./utils/SifClient/NativeDexClient";
import Web3 from "web3";
export declare type Services = ReturnType<typeof createServices>;
export declare type WithService<T extends keyof Services = keyof Services> = {
    services: Pick<Services, T>;
};
export declare type ServiceContext = {
    blockExplorerUrl: string;
    assets: IAsset[];
} & SifServiceContext & ClpServiceContext & EthbridgeServiceContext & ClpServiceContext & EventBusServiceContext & IDispensationServiceContext & // add contexts from other APIs
CryptoeconomicsServiceContext & StorageServiceContext & IBCServiceContext & ChainsServiceContext & WalletServiceContext & TokenRegistryContext;
export declare function createServices(context: ServiceContext): {
    Web3: typeof Web3;
    chains: import("./ChainsService/ChainsService").ChainsService;
    ibc: import("./IBCService/IBCService").IBCService;
    clp: {
        getRawPools: () => Promise<import("../generated/proto/sifnode/clp/v1/querier").PoolsRes>;
        getAccountLiquidityProviderData: (params: {
            lpAddress: string;
        }) => Promise<import("../generated/proto/sifnode/clp/v1/types").LiquidityProviderData[]>;
        getPools: () => Promise<{
            amounts: [import("../entities").IAssetAmount, import("../entities").IAssetAmount];
            readonly externalAmount: import("../entities").IAssetAmount | undefined;
            readonly nativeAmount: import("../entities").IAssetAmount | undefined;
            otherAsset: (asset: IAsset) => import("../entities").IAssetAmount;
            symbol: () => string;
            contains: (...assets: IAsset[]) => boolean;
            toString: () => string;
            getAmount: (asset: string | IAsset) => import("../entities").IAssetAmount;
            poolUnits: import("../entities").IAmount;
            priceAsset(asset: IAsset): import("../entities").IAssetAmount;
            calcProviderFee(x: import("../entities").IAssetAmount): import("../entities").IAssetAmount;
            calcPriceImpact(x: import("../entities").IAssetAmount): import("../entities").IAmount;
            calcSwapResult(x: import("../entities").IAssetAmount): import("../entities").IAssetAmount;
            calcReverseSwapResult(Sa: import("../entities").IAssetAmount): import("../entities").IAssetAmount;
            calculatePoolUnits(nativeAssetAmount: import("../entities").IAssetAmount, externalAssetAmount: import("../entities").IAssetAmount): import("../entities").IAmount[];
        }[]>;
        getPoolSymbolsByLiquidityProvider: (address: string) => Promise<string[]>;
        swap: (params: {
            fromAddress: string;
            sentAmount: import("../entities").IAssetAmount;
            receivedAsset: IAsset;
            minimumReceived: import("../entities").IAssetAmount;
        }) => any;
        addLiquidity: (params: {
            fromAddress: string;
            nativeAssetAmount: import("../entities").IAssetAmount;
            externalAssetAmount: import("../entities").IAssetAmount;
        }) => any;
        createPool: (params: {
            fromAddress: string;
            nativeAssetAmount: import("../entities").IAssetAmount;
            externalAssetAmount: import("../entities").IAssetAmount;
        }) => any;
        getLiquidityProvider: (params: {
            asset: IAsset;
            lpAddress: string;
        }) => Promise<import("../entities").LiquidityProvider | null>;
        removeLiquidity: (params: {
            wBasisPoints: string;
            asymmetry: string;
            asset: IAsset;
            fromAddress: string;
        }) => any;
    };
    sif: {
        loadNativeDexClient(): Promise<NativeDexClient>;
        getClient(): import("./utils/SifClient").SifClient | null;
        getState(): {
            connected: boolean;
            address: string;
            accounts: string[];
            balances: import("../entities").IAssetAmount[];
            log: string;
        };
        getSupportedTokens(): IAsset[];
        setClient(): Promise<void>;
        initProvider(): Promise<void>;
        connect(): Promise<void>;
        isConnected(): boolean;
        unSignedClient: import("./utils/SifClient").SifUnSignedClient;
        onSocketError(handler: (a: any) => void): () => void;
        onTx(handler: (a: any) => void): () => void;
        onNewBlock(handler: (a: any) => void): () => void;
        setPhrase(mnemonic: string): Promise<string>;
        purgeClient(): Promise<void>;
        getBalance(address?: string | undefined, asset?: IAsset | undefined): Promise<import("../entities").IAssetAmount[]>;
        transfer(params: import("../entities").TxParams): Promise<any>;
        signAndBroadcast(msg: import("@cosmjs/launchpad").Msg | import("@cosmjs/launchpad").Msg[], memo?: string | undefined): Promise<import("../entities").TransactionStatus>;
    };
    ethbridge: import("../clients/bridges/EthBridge/EthBridge").EthBridge;
    bus: {
        onAny(handler: import("./EventBusService").EventHandler): void;
        on(eventType: "ErrorEvent" | "SuccessEvent" | "InfoEvent" | "TransactionErrorEvent" | "WalletConnectedEvent" | "WalletDisconnectedEvent" | "WalletConnectionErrorEvent" | "PegTransactionPendingEvent" | "PegTransactionCompletedEvent" | "PegTransactionErrorEvent" | "UnpegTransactionPendingEvent" | "UnpegTransactionCompletedEvent" | "UnpegTransactionErrorEvent" | "NoLiquidityPoolsFoundEvent" | import("./EventBusService").AppEventTypes, handler: import("./EventBusService").EventHandler): void;
        dispatch(event: import("./EventBusService").AppEvent): void;
    };
    dispensation: {
        claim: (params: {
            claimType: import("../generated/proto/sifnode/dispensation/v1/types").DistributionType;
            fromAddress: string;
        }) => any;
    };
    cryptoeconomics: {
        fetchData: (props: import("./CryptoeconomicsService").FetchDataProps) => Promise<import("./CryptoeconomicsService").CryptoeconomicsUserData>;
        getAddressLink: (address: string, rewardType: import("./CryptoeconomicsService").CryptoeconomicsRewardType) => string;
        fetchSummaryAPY({ rewardProgram, devnet, }: {
            rewardProgram?: "harvest" | undefined;
            devnet?: boolean | undefined;
        }): Promise<number>;
        fetchVsData: (options: import("./CryptoeconomicsService").FetchDataProps) => Promise<import("./CryptoeconomicsService").CryptoeconomicsUserData>;
        fetchLmData: (options: import("./CryptoeconomicsService").FetchDataProps) => Promise<import("./CryptoeconomicsService").CryptoeconomicsUserData>;
        fetchTimeseriesData: (props: {
            address: string;
            devnet: boolean;
        }) => Promise<import("./CryptoeconomicsService").CryptoeconomicsTimeseriesItem[]>;
    };
    storage: {
        getJSONItem<T>(key: string): T | undefined;
        setJSONItem<T_1>(key: string, value: T_1): void;
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
    };
    wallet: import("./WalletService").WalletService;
    tokenRegistry: {
        load: () => Promise<import("../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry[]>;
        findAssetEntry: (asset: IAsset) => Promise<import("../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        findAssetEntryOrThrow: (asset: IAsset) => Promise<import("../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>;
        loadCounterpartyEntry(nativeAsset: IAsset): Promise<import("../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        loadCounterpartyAsset(nativeAsset: IAsset): Promise<IAsset>;
        loadNativeAsset(counterpartyAsset: IAsset): Promise<IAsset>;
        loadCounterpartyAssetAmount: (nativeAssetAmount: import("../entities").IAssetAmount) => Promise<import("../entities").IAssetAmount>;
        loadNativeAssetAmount: (assetAmount: import("../entities").IAssetAmount) => Promise<import("../entities").IAssetAmount>;
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
};
