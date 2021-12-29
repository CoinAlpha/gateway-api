"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const terra_testnet_1 = require("./terra-testnet");
const terra_mainnet_1 = require("./terra-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: terra_testnet_1.TERRA_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: terra_testnet_1.TERRA_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: terra_testnet_1.TERRA_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: terra_testnet_1.TERRA_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: terra_testnet_1.TERRA_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: terra_mainnet_1.TERRA_MAINNET,
};
//# sourceMappingURL=index.js.map