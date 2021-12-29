"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const juno_mainnet_1 = require("./juno-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: juno_mainnet_1.JUNO_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: juno_mainnet_1.JUNO_MAINNET,
};
//# sourceMappingURL=index.js.map