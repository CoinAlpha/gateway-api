import { Address, TxParams } from "../../entities";
import { UsecaseContext } from "..";
declare const _default: ({ services, store, }: UsecaseContext<"sif" | "clp" | "bus", "wallet">) => {
    initSifWallet(): () => void;
    getCosmosBalances(address: Address): Promise<import("../../entities").IAssetAmount[]>;
    sendCosmosTransaction(params: TxParams): Promise<any>;
    connectToSifWallet(): Promise<void>;
};
export default _default;
