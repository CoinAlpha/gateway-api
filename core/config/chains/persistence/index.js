"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const persistence_testnet_1 = require("./persistence-testnet");
const persistence_mainnet_1 = require("./persistence-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: persistence_testnet_1.PERSISTENCE_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: persistence_testnet_1.PERSISTENCE_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: persistence_testnet_1.PERSISTENCE_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: persistence_testnet_1.PERSISTENCE_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: persistence_testnet_1.PERSISTENCE_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: persistence_mainnet_1.PERSISTENCE_MAINNET,
};
//# sourceMappingURL=index.js.map