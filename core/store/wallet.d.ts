import { CryptoeconomicsUserData } from "../services/CryptoeconomicsService";
import { Address, IAssetAmount, Network } from "../entities";
export declare type WalletStoreEntry = {
    chainId?: string;
    balances: IAssetAmount[];
    isConnected: boolean;
    address: Address;
    lmUserData?: CryptoeconomicsUserData;
    vsUserData?: CryptoeconomicsUserData;
};
export declare type WalletStore = {
    _map: Map<Network, WalletStoreEntry>;
    get: (network: Network) => WalletStoreEntry;
    set: (network: Network, data: WalletStoreEntry) => void;
    reset: (network: Network) => void;
};
export declare const wallet: WalletStore;
