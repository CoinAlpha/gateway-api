"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const likecoin_mainnet_1 = require("./likecoin-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: likecoin_mainnet_1.LIKECOIN_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: likecoin_mainnet_1.LIKECOIN_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: likecoin_mainnet_1.LIKECOIN_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: likecoin_mainnet_1.LIKECOIN_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: likecoin_mainnet_1.LIKECOIN_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: likecoin_mainnet_1.LIKECOIN_MAINNET,
};
//# sourceMappingURL=index.js.map