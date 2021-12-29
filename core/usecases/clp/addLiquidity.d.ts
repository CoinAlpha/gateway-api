import { IAssetAmount } from "../../entities";
import { Services } from "../../services";
import { Store } from "../../store";
declare type PickBus = Pick<Services["bus"], "dispatch">;
declare type PickSif = Pick<Services["sif"], "getState" | "signAndBroadcast" | "unSignedClient" | "loadNativeDexClient">;
declare type PickClp = Pick<Services["clp"], "addLiquidity" | "createPool">;
declare type AddLiquidityServices = {
    bus: PickBus;
    sif: PickSif;
    clp: PickClp;
    ibc: Services["ibc"];
    wallet: Services["wallet"];
    tokenRegistry: Services["tokenRegistry"];
    chains: Services["chains"];
};
declare type AddLiquidityStore = Pick<Store, "pools">;
export declare function AddLiquidity({ bus, clp, sif, ibc, tokenRegistry, wallet, chains }: AddLiquidityServices, store: AddLiquidityStore): (nativeAssetAmount: IAssetAmount, externalAssetAmount: IAssetAmount) => Promise<import("../../entities").TransactionStatus>;
export {};
