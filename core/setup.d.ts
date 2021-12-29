import { Network, Chain } from "./entities";
import { NetworkEnv } from "./config/getEnv";
import { WalletProviderContext } from "./clients/wallets";
import { CosmosWalletProvider } from "./clients/wallets/cosmos";
import { IBCBridge } from "./clients/bridges/IBCBridge/IBCBridge";
declare type WalletsOption = {
    cosmos: (context: Partial<WalletProviderContext>) => CosmosWalletProvider;
};
export declare const getSdkConfig: (params: {
    environment: NetworkEnv;
    wallets: WalletsOption;
}) => import("./services").ServiceContext;
export declare function createSdk(options: {
    environment: NetworkEnv;
    wallets: WalletsOption;
}): {
    wallets: {
        cosmos: CosmosWalletProvider;
    };
    chains: Record<Network, Chain>;
    bridges: {
        ibc: IBCBridge;
    };
};
export {};
