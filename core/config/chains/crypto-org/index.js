"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const crypto_org_mainnet_1 = require("./crypto-org-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET_042]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.DEVNET]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.TESTNET]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
    [getEnv_1.NetworkEnv.MAINNET]: crypto_org_mainnet_1.CRYPTO_ORG_MAINNET,
};
//# sourceMappingURL=index.js.map