"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const emoney_mainnet_1 = require("./emoney-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: emoney_mainnet_1.EMONEY_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: emoney_mainnet_1.EMONEY_MAINNET,
};
//# sourceMappingURL=index.js.map