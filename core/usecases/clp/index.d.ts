import { UsecaseContext } from "..";
declare const _default: ({ services, store, }: UsecaseContext<"sif" | "clp" | "bus" | "ibc" | "chains" | "tokenRegistry" | "wallet", "pools" | "wallet" | "accountpools">) => {
    swap: (sentAmount: import("../../entities").IAssetAmount, receivedAsset: import("../../entities").IAsset, minimumReceived: import("../../entities").IAssetAmount) => Promise<import("../../entities").TransactionStatus>;
    addLiquidity: (nativeAssetAmount: import("../../entities").IAssetAmount, externalAssetAmount: import("../../entities").IAssetAmount) => Promise<import("../../entities").TransactionStatus>;
    removeLiquidity: (asset: import("../../entities").IAsset, wBasisPoints: string, asymmetry: string) => Promise<import("../../entities").TransactionStatus>;
    syncPools: {
        syncPublicPools: () => Promise<void>;
        syncUserPools: (address: string) => Promise<void>;
    };
    subscribeToPublicPools: (delay?: number) => () => void;
    subscribeToUserPools: (address: string, delay?: number) => () => void;
};
export default _default;
