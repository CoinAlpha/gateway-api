"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const iris_testnet_1 = require("./iris-testnet");
const iris_mainnet_1 = require("./iris-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: iris_testnet_1.IRIS_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: iris_testnet_1.IRIS_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: iris_testnet_1.IRIS_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: iris_testnet_1.IRIS_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: iris_testnet_1.IRIS_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: iris_mainnet_1.IRIS_MAINNET,
};
//# sourceMappingURL=index.js.map