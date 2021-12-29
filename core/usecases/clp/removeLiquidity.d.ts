import { IAsset } from "../../entities";
import { Services } from "../../services";
declare type PickBus = Pick<Services["bus"], "dispatch">;
declare type PickSif = Pick<Services["sif"], "getState" | "signAndBroadcast" | "loadNativeDexClient" | "unSignedClient">;
declare type PickClp = Pick<Services["clp"], "removeLiquidity">;
declare type RemoveLiquidityServices = {
    bus: PickBus;
    sif: PickSif;
    clp: PickClp;
    tokenRegistry: Services["tokenRegistry"];
    wallet: Services["wallet"];
    chains: Services["chains"];
};
export declare function RemoveLiquidity({ bus, sif, clp, tokenRegistry, wallet, chains, }: RemoveLiquidityServices): (asset: IAsset, wBasisPoints: string, asymmetry: string) => Promise<import("../../entities").TransactionStatus>;
export {};
