"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const cosmoshub_testnet_1 = require("./cosmoshub-testnet");
const cosmoshub_mainnet_1 = require("./cosmoshub-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: cosmoshub_testnet_1.COSMOSHUB_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: cosmoshub_testnet_1.COSMOSHUB_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: cosmoshub_testnet_1.COSMOSHUB_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: cosmoshub_testnet_1.COSMOSHUB_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: cosmoshub_testnet_1.COSMOSHUB_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: cosmoshub_mainnet_1.COSMOSHUB_MAINNET,
};
//# sourceMappingURL=index.js.map