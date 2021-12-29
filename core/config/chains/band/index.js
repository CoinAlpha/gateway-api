"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const band_testnet_1 = require("./band-testnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: band_testnet_1.BAND_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: band_testnet_1.BAND_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: band_testnet_1.BAND_TESTNET,
    [getEnv_1.NetworkEnv.DEVNET]: band_testnet_1.BAND_TESTNET,
    [getEnv_1.NetworkEnv.TESTNET]: band_testnet_1.BAND_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: band_testnet_1.BAND_TESTNET,
};
//# sourceMappingURL=index.js.map