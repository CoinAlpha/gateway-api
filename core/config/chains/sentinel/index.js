"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const sentinel_mainnet_1 = require("./sentinel-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: sentinel_mainnet_1.SENTINEL_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: sentinel_mainnet_1.SENTINEL_MAINNET,
};
//# sourceMappingURL=index.js.map