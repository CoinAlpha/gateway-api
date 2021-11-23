import { IAssetAmount, Chain } from "./";

export enum WalletType {
  KEPLR = "keplr",
  METAMASK = "metamask",
}

export interface Wallet {
  type: WalletType;
  displayName: string;
  iconSrc: string;

  loadForChain(chain: Chain): Promise<WalletConnection>;
}

export type WalletConnection = {
  address: string;
  balances: IAssetAmount[];
  connected: boolean;
};

export type Mnemonic = string;
