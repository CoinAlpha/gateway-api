import { Services } from "../../services";
import { Store } from "../../store";
declare type PickSif = Pick<Services["sif"], "getState">;
declare type PickClp = Pick<Services["clp"], "getAccountLiquidityProviderData" | "getRawPools">;
declare type PickChains = Pick<Services["chains"], "get" | "findChainAssetMatch" | "findChainAssetMatch">;
declare type PickTokenRegistry = Pick<Services["tokenRegistry"], "load">;
declare type SyncPoolsArgs = {
    sif: PickSif;
    clp: PickClp;
    chains: PickChains;
    tokenRegistry: PickTokenRegistry;
};
declare type SyncPoolsStore = Pick<Store, "accountpools" | "pools">;
export declare function SyncPools({ sif, clp, chains, tokenRegistry }: SyncPoolsArgs, store: SyncPoolsStore): {
    syncPublicPools: () => Promise<void>;
    syncUserPools: (address: string) => Promise<void>;
};
export {};
