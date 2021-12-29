import { Network, IAssetAmount, WalletConnection } from "../../entities";
export interface WalletActions {
    load(network: Network): Promise<WalletConnection>;
    loadIfConnected(network: Network): Promise<WalletConnection | {
        connected: false;
    }>;
    getBalances(network: Network, address: string, forceUpdate?: boolean): Promise<IAssetAmount[]>;
    disconnect(network: Network): Promise<void>;
}
