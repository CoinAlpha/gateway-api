import { Services, WithService } from "../services";
import { Store, WithStore } from "../store";
export declare type UsecaseContext<T extends keyof Services = keyof Services, S extends keyof Store = keyof Store> = WithService<T> & WithStore<S>;
export declare type Usecases = ReturnType<typeof createUsecases>;
export declare function createUsecases(context: UsecaseContext): {
    interchain: {
        (from: import("..").Chain, to: import("..").Chain): {
            estimateFees(params: import("../clients/bridges/BaseBridge").BridgeParams): import("..").IAssetAmount | undefined;
            approveTransfer(params: import("../clients/bridges/BaseBridge").BridgeParams): Promise<void>;
            transfer(params: import("../clients/bridges/BaseBridge").BridgeParams): Promise<import("../clients/bridges/BaseBridge").IBCBridgeTx>;
            waitForTransferComplete(tx: import("../clients/bridges/BaseBridge").BridgeTx, onUpdate?: ((update: Partial<import("../clients/bridges/BaseBridge").IBCBridgeTx> | Partial<import("../clients/bridges/BaseBridge").EthBridgeTx>) => void) | undefined): Promise<boolean>;
        } | {
            estimateFees(params: import("../clients/bridges/BaseBridge").BridgeParams): import("..").IAssetAmount | undefined;
            approveTransfer(params: import("../clients/bridges/BaseBridge").BridgeParams): Promise<void>;
            transfer(params: import("../clients/bridges/BaseBridge").BridgeParams): Promise<import("../clients/bridges/BaseBridge").EthBridgeTx>;
            waitForTransferComplete(tx: import("../clients/bridges/BaseBridge").BridgeTx, onUpdate?: ((update: Partial<import("../clients/bridges/BaseBridge").IBCBridgeTx> | Partial<import("../clients/bridges/BaseBridge").EthBridgeTx>) => void) | undefined): Promise<boolean>;
        };
        txManager: {
            listenForSentTransfers: () => () => import("typed-emitter").default<import("../clients/bridges/BaseBridge").BridgeTxEvents>;
            loadSavedTransferList(userSifAddress: string): void;
        };
    };
    clp: {
        swap: (sentAmount: import("..").IAssetAmount, receivedAsset: import("..").IAsset, minimumReceived: import("..").IAssetAmount) => Promise<import("..").TransactionStatus>;
        addLiquidity: (nativeAssetAmount: import("..").IAssetAmount, externalAssetAmount: import("..").IAssetAmount) => Promise<import("..").TransactionStatus>;
        removeLiquidity: (asset: import("..").IAsset, wBasisPoints: string, asymmetry: string) => Promise<import("..").TransactionStatus>;
        syncPools: {
            syncPublicPools: () => Promise<void>;
            syncUserPools: (address: string) => Promise<void>;
        };
        subscribeToPublicPools: (delay?: number) => () => void;
        subscribeToUserPools: (address: string, delay?: number) => () => void;
    };
    wallet: {
        sif: {
            initSifWallet(): () => void;
            getCosmosBalances(address: string): Promise<import("..").IAssetAmount[]>;
            sendCosmosTransaction(params: import("..").TxParams): Promise<any>;
            connectToSifWallet(): Promise<void>;
        };
    };
    walletNew: {
        keplr: import("./walletNew/types").WalletActions;
        metamask: import("./walletNew/types").WalletActions;
    };
    reward: {
        subscribeToRewardData(rewardType: import("../services/CryptoeconomicsService").CryptoeconomicsRewardType): () => void;
        notifyLmMaturity(): () => void;
        notifyVsMaturity(): () => void;
        claim: ({ rewardProgramName, ...params }: {
            claimType: import("../generated/proto/sifnode/dispensation/v1/types").DistributionType;
            fromAddress: string;
            rewardProgramName: "harvest" | "COSMOS_IBC_REWARDS_V1";
        }) => Promise<import("..").TransactionStatus>;
    };
};
