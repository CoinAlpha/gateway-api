"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const ixo_mainnet_1 = require("./ixo-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: ixo_mainnet_1.IXO_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: ixo_mainnet_1.IXO_MAINNET,
};
//# sourceMappingURL=index.js.map