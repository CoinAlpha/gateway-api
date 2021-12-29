"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = exports.isNetworkEnvSymbol = exports.getNetworkEnv = exports.profileLookup = exports.networkEnvsByIndex = exports.NetworkEnv = void 0;
const AppCookies_1 = require("./AppCookies");
var NetworkEnv;
(function (NetworkEnv) {
    NetworkEnv["MAINNET"] = "mainnet";
    NetworkEnv["TESTNET"] = "testnet";
    NetworkEnv["DEVNET"] = "devnet";
    NetworkEnv["LOCALNET"] = "localnet";
    NetworkEnv["DEVNET_042"] = "devnet_042";
    NetworkEnv["TESTNET_042_IBC"] = "testnet_042_ibc";
})(NetworkEnv = exports.NetworkEnv || (exports.NetworkEnv = {}));
// NOTE(ajoslin): support legacy `?_env=n` urls, from
// 0-4
exports.networkEnvsByIndex = [
    NetworkEnv.MAINNET,
    NetworkEnv.TESTNET,
    NetworkEnv.DEVNET,
    NetworkEnv.LOCALNET,
    NetworkEnv.DEVNET_042,
    NetworkEnv.TESTNET_042_IBC,
];
exports.profileLookup = {
    [NetworkEnv.MAINNET]: {
        tag: NetworkEnv.MAINNET,
        ethAssetTag: "ethereum.mainnet",
        sifAssetTag: "sifchain.mainnet",
        cosmoshubAssetTag: "cosmoshub.mainnet",
    },
    [NetworkEnv.DEVNET_042]: {
        tag: NetworkEnv.DEVNET_042,
        ethAssetTag: "ethereum.devnet",
        sifAssetTag: "sifchain.devnet",
        cosmoshubAssetTag: "cosmoshub.testnet",
    },
    [NetworkEnv.TESTNET_042_IBC]: {
        tag: NetworkEnv.TESTNET_042_IBC,
        ethAssetTag: "ethereum.testnet_042_ibc",
        sifAssetTag: "sifchain.devnet",
        cosmoshubAssetTag: "cosmoshub.testnet",
    },
    [NetworkEnv.TESTNET]: {
        tag: NetworkEnv.TESTNET,
        ethAssetTag: "ethereum.testnet",
        sifAssetTag: "sifchain.devnet",
        cosmoshubAssetTag: "cosmoshub.testnet",
    },
    get [1]() {
        return this[NetworkEnv.TESTNET];
    },
    [NetworkEnv.DEVNET]: {
        tag: NetworkEnv.DEVNET,
        ethAssetTag: "ethereum.devnet",
        sifAssetTag: "sifchain.devnet",
        cosmoshubAssetTag: "cosmoshub.testnet",
    },
    get [2]() {
        return this[NetworkEnv.DEVNET];
    },
    [NetworkEnv.LOCALNET]: {
        tag: NetworkEnv.LOCALNET,
        ethAssetTag: "ethereum.localnet",
        sifAssetTag: "sifchain.localnet",
        cosmoshubAssetTag: "cosmoshub.testnet",
    },
    get [3]() {
        return this[NetworkEnv.LOCALNET];
    },
};
// Here we list hostnames that have default env settings
const hostDefaultEnvs = [
    { test: /dex\.sifchain\.finance$/, net: NetworkEnv.MAINNET },
    { test: /testnet\.sifchain\.finance$/, net: NetworkEnv.TESTNET },
    { test: /devnet\.sifchain\.finance$/, net: NetworkEnv.DEVNET },
    { test: /dex-v2.*?\.sifchain\.finance$/, net: NetworkEnv.TESTNET_042_IBC },
    { test: /sifchain\.vercel\.app$/, net: NetworkEnv.DEVNET },
    { test: /gateway\.pinata\.cloud$/, net: NetworkEnv.DEVNET },
    { test: /localhost$/, net: NetworkEnv.DEVNET },
];
function getNetworkEnv(hostname) {
    for (const { test, net } of hostDefaultEnvs) {
        if (test.test(hostname)) {
            return net;
        }
    }
    return null;
}
exports.getNetworkEnv = getNetworkEnv;
function isNetworkEnvSymbol(a) {
    return (Object.values(NetworkEnv).includes(a) || !!exports.networkEnvsByIndex[a]);
}
exports.isNetworkEnvSymbol = isNetworkEnvSymbol;
function getEnv({ location: { hostname }, cookies = AppCookies_1.AppCookies(), }) {
    const cookieEnv = cookies.getEnv();
    const defaultNetworkEnv = getNetworkEnv(hostname);
    let sifEnv;
    if (cookieEnv != null && exports.networkEnvsByIndex[+cookieEnv]) {
        sifEnv = exports.networkEnvsByIndex[+cookieEnv];
    }
    else if (isNetworkEnvSymbol(cookieEnv)) {
        sifEnv = cookieEnv;
    }
    else {
        sifEnv = defaultNetworkEnv;
    }
    // console.log("sifEnv", profileLookup[sifEnv as NetworkEnv]);
    if (sifEnv != null && exports.profileLookup[sifEnv]) {
        return exports.profileLookup[sifEnv];
    }
    console.error(new Error(`Cannot render environment ${sifEnv} ${cookieEnv}`));
    return exports.profileLookup[NetworkEnv.MAINNET];
}
exports.getEnv = getEnv;
//# sourceMappingURL=getEnv.js.map