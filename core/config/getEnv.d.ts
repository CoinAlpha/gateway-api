import { AppCookies } from "./AppCookies";
export declare enum NetworkEnv {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCALNET = "localnet",
    DEVNET_042 = "devnet_042",
    TESTNET_042_IBC = "testnet_042_ibc"
}
export declare const networkEnvsByIndex: NetworkEnv[];
declare type AssetTag = string;
declare type ProfileLookup = Record<NetworkEnv | number, {
    tag: NetworkEnv;
    ethAssetTag: AssetTag;
    sifAssetTag: AssetTag;
    cosmoshubAssetTag: AssetTag;
}>;
export declare const profileLookup: ProfileLookup;
export declare function getNetworkEnv(hostname: string): NetworkEnv | null;
export declare function isNetworkEnvSymbol(a: any): a is NetworkEnv;
declare type GetEnvArgs = {
    location: {
        hostname: string;
    };
    cookies?: Pick<AppCookies, "getEnv">;
};
export declare function getEnv({ location: { hostname }, cookies, }: GetEnvArgs): {
    tag: NetworkEnv;
    ethAssetTag: string;
    sifAssetTag: string;
    cosmoshubAssetTag: string;
};
export {};
