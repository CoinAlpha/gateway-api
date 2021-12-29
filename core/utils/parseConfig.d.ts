import { ServiceContext } from "../services";
import { Asset, Network, NetworkChainConfigLookup } from "../entities";
import { WalletProviderContext } from "../clients/wallets";
import { CosmosWalletProvider } from "../clients/wallets/cosmos/CosmosWalletProvider";
declare type TokenConfig = {
    symbol: string;
    displaySymbol: string;
    label?: string;
    decimals: number;
    imageUrl?: string;
    name: string;
    address: string;
    network: Network;
    homeNetwork: Network;
};
declare type CoinConfig = {
    label?: string;
    symbol: string;
    displaySymbol: string;
    decimals: number;
    imageUrl?: string;
    name: string;
    network: Network;
    homeNetwork: Network;
};
export declare type AssetConfig = CoinConfig | TokenConfig;
export declare type KeplrChainConfig = {
    rest: string;
    rpc: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: {
        bech32PrefixAccAddr: string;
        bech32PrefixAccPub: string;
        bech32PrefixValAddr: string;
        bech32PrefixValPub: string;
        bech32PrefixConsAddr: string;
        bech32PrefixConsPub: string;
    };
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
    }[];
    coinType: number;
    gasPriceStep: {
        low: number;
        average: number;
        high: number;
    };
};
export declare type CoreConfig = {
    sifAddrPrefix: string;
    sifApiUrl: string;
    sifWsUrl: string;
    sifRpcUrl: string;
    sifChainId: string;
    cryptoeconomicsUrl: string;
    blockExplorerUrl: string;
    web3Provider: "metamask" | string;
    nativeAsset: string;
    bridgebankContractAddress: string;
    keplrChainConfig: KeplrChainConfig;
};
export declare function parseAssets(configAssets: AssetConfig[]): Asset[];
export declare function parseConfig(config: CoreConfig, assets: Asset[], chainConfigsByNetwork: NetworkChainConfigLookup, peggyCompatibleCosmosBaseDenoms: Set<string>, createCosmosWalletProvider: (context: WalletProviderContext) => CosmosWalletProvider): ServiceContext;
export {};
