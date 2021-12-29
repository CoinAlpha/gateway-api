"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const akash_testnet_1 = require("./akash-testnet");
const akash_mainnet_1 = require("./akash-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: akash_testnet_1.AKASH_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: akash_testnet_1.AKASH_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: akash_testnet_1.AKASH_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: akash_testnet_1.AKASH_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: akash_testnet_1.AKASH_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: akash_mainnet_1.AKASH_MAINNET,
};
//# sourceMappingURL=index.js.map