"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const regen_mainnet_1 = require("./regen-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: regen_mainnet_1.REGEN_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: regen_mainnet_1.REGEN_MAINNET,
};
//# sourceMappingURL=index.js.map