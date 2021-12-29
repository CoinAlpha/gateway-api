import { ServiceContext } from "../services";
import { NetworkEnv } from "./getEnv";
import { WalletProviderContext } from "../clients/wallets";
import { CosmosWalletProvider } from "../clients/wallets/cosmos/CosmosWalletProvider";
declare type ChainNetwork = string;
export declare type AppConfig = ServiceContext;
export declare function getConfig(applicationNetworkEnv?: NetworkEnv, sifchainAssetTag?: ChainNetwork, ethereumAssetTag?: ChainNetwork, createCosmosWalletProvider?: (context: WalletProviderContext) => CosmosWalletProvider): AppConfig;
export {};
