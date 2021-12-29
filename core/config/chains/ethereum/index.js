"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const ethereum_testnet_1 = require("./ethereum-testnet");
const ethereum_mainnet_1 = require("./ethereum-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: ethereum_testnet_1.ETHEREUM_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: ethereum_testnet_1.ETHEREUM_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: ethereum_testnet_1.ETHEREUM_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: ethereum_testnet_1.ETHEREUM_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: ethereum_mainnet_1.ETHEREUM_MAINNET,
};
//# sourceMappingURL=index.js.map