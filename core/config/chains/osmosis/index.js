"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const osmosis_mainnet_1 = require("./osmosis-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: osmosis_mainnet_1.OSMOSIS_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: osmosis_mainnet_1.OSMOSIS_MAINNET,
};
//# sourceMappingURL=index.js.map