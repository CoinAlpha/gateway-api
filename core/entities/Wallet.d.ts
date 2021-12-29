import { IAssetAmount, Chain } from "./";
export declare enum WalletType {
    KEPLR = "keplr",
    METAMASK = "metamask"
}
export interface Wallet {
    type: WalletType;
    displayName: string;
    iconSrc: string;
    loadForChain(chain: Chain): Promise<WalletConnection>;
}
export declare type WalletConnection = {
    address: string;
    balances: IAssetAmount[];
    connected: boolean;
};
export declare type Mnemonic = string;
