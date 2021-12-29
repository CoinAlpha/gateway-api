"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEnv_1 = require("../../getEnv");
const sifchain_devnet_042_1 = require("./sifchain-devnet-042");
const sifchain_testnet_042_ibc_1 = require("./sifchain-testnet-042-ibc");
const sifchain_devnet_1 = require("./sifchain-devnet");
const sifchain_testnet_1 = require("./sifchain-testnet");
const sifchain_mainnet_1 = require("./sifchain-mainnet");
exports.default = {
    [getEnv_1.NetworkEnv.LOCALNET]: sifchain_testnet_042_ibc_1.SIFCHAIN_TESTNET_042,
    [getEnv_1.NetworkEnv.TESTNET_042_IBC]: sifchain_testnet_042_ibc_1.SIFCHAIN_TESTNET_042,
    [getEnv_1.NetworkEnv.DEVNET_042]: sifchain_devnet_042_1.SIFCHAIN_DEVNET_042,
    [getEnv_1.NetworkEnv.DEVNET]: sifchain_devnet_1.SIFCHAIN_DEVNET,
    [getEnv_1.NetworkEnv.TESTNET]: sifchain_testnet_1.SIFCHAIN_TESTNET,
    [getEnv_1.NetworkEnv.MAINNET]: sifchain_mainnet_1.SIFCHAIN_MAINNET,
};
//# sourceMappingURL=index.js.map