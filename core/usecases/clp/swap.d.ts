import { IAsset, IAssetAmount } from "../../entities";
import { Services } from "../../services";
export declare type SwapArgs = Pick<Services, "bus" | "sif" | "clp" | "ibc" | "tokenRegistry" | "wallet" | "chains">;
export declare function Swap({ bus, sif, clp, ibc, tokenRegistry, wallet, chains, }: SwapArgs): (sentAmount: IAssetAmount, receivedAsset: IAsset, minimumReceived: IAssetAmount) => Promise<import("../../entities").TransactionStatus>;
