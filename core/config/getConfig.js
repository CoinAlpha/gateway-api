"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
// TODO - Conditional load or build-time tree shake
const config_localnet_json_1 = __importDefault(require("./networks/sifchain/config.localnet.json"));
const config_devnet_json_1 = __importDefault(require("./networks/sifchain/config.devnet.json"));
const config_devnet_042_json_1 = __importDefault(require("./networks/sifchain/config.devnet-042.json"));
const config_testnet_042_ibc_json_1 = __importDefault(require("./networks/sifchain/config.testnet-042-ibc.json"));
const config_testnet_json_1 = __importDefault(require("./networks/sifchain/config.testnet.json"));
const config_mainnet_json_1 = __importDefault(require("./networks/sifchain/config.mainnet.json"));
const assets_ethereum_localnet_json_1 = __importDefault(require("./networks/ethereum/assets.ethereum.localnet.json"));
const assets_ethereum_sifchain_devnet_json_1 = __importDefault(require("./networks/ethereum/assets.ethereum.sifchain-devnet.json"));
const assets_ethereum_sifchain_testnet_json_1 = __importDefault(require("./networks/ethereum/assets.ethereum.sifchain-testnet.json"));
const assets_ethereum_sifchain_testnet_042_json_1 = __importDefault(require("./networks/ethereum/assets.ethereum.sifchain-testnet-042.json"));
const assets_ethereum_mainnet_json_1 = __importDefault(require("./networks/ethereum/assets.ethereum.mainnet.json"));
const assets_sifchain_localnet_1 = __importDefault(require("./networks/sifchain/assets.sifchain.localnet"));
const assets_sifchain_mainnet_1 = __importDefault(require("./networks/sifchain/assets.sifchain.mainnet"));
const assets_sifchain_devnet_1 = __importDefault(require("./networks/sifchain/assets.sifchain.devnet"));
const parseConfig_1 = require("../utils/parseConfig");
const entities_1 = require("../entities");
const getEnv_1 = require("./getEnv");
const chains_1 = require("./chains");
const wallets_1 = require("../clients/wallets");
// Save assets for sync lookup throughout the app via Asset.get('symbol')
function cacheAsset(asset) {
    return entities_1.Asset(asset);
}
function getConfig(applicationNetworkEnv = getEnv_1.NetworkEnv.LOCALNET, sifchainAssetTag = "sifchain.localnet", ethereumAssetTag = "ethereum.localnet", createCosmosWalletProvider = (context) => new wallets_1.KeplrWalletProvider(context)) {
    const assetMap = {
        "sifchain.localnet": parseConfig_1.parseAssets(assets_sifchain_localnet_1.default.assets),
        "sifchain.mainnet": parseConfig_1.parseAssets(assets_sifchain_mainnet_1.default.assets),
        "sifchain.devnet": parseConfig_1.parseAssets(assets_sifchain_devnet_1.default.assets),
        "ethereum.localnet": parseConfig_1.parseAssets(assets_ethereum_localnet_json_1.default.assets),
        "ethereum.devnet": parseConfig_1.parseAssets(assets_ethereum_sifchain_devnet_json_1.default.assets),
        "ethereum.testnet": parseConfig_1.parseAssets(assets_ethereum_sifchain_testnet_json_1.default.assets),
        "ethereum.testnet_042_ibc": parseConfig_1.parseAssets(assets_ethereum_sifchain_testnet_042_json_1.default.assets),
        "ethereum.mainnet": parseConfig_1.parseAssets(assets_ethereum_mainnet_json_1.default.assets),
    };
    const sifchainAssets = assetMap[sifchainAssetTag] || [];
    const ethereumAssets = assetMap[ethereumAssetTag] || [];
    let allAssets = [...sifchainAssets, ...ethereumAssets];
    Object.values(entities_1.Network)
        .filter((n) => n !== entities_1.Network.ETHEREUM && n !== entities_1.Network.SIFCHAIN)
        .forEach((n) => {
        allAssets.push(...sifchainAssets.map((a) => (Object.assign(Object.assign({}, a), { network: n }))));
    });
    allAssets = allAssets.map(cacheAsset);
    const peggyCompatibleCosmosBaseDenoms = new Set([
        "uiris",
        "uatom",
        "uxprt",
        "ukava",
        "uakt",
        "hard",
        "uosmo",
        "uregen",
        "uion",
        "uixo",
        "ujuno",
        "udvpn",
        "ungm",
        "eeur",
        // not sure if these contracts actually exist
        "uphoton",
        "unyan",
    ]);
    const configMap = {
        localnet: parseConfig_1.parseConfig(config_localnet_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.LOCALNET], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
        devnet: parseConfig_1.parseConfig(config_devnet_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.DEVNET], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
        devnet_042: parseConfig_1.parseConfig(config_devnet_042_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.DEVNET_042], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
        testnet: parseConfig_1.parseConfig(config_testnet_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.TESTNET], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
        mainnet: parseConfig_1.parseConfig(config_mainnet_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.MAINNET], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
        testnet_042_ibc: parseConfig_1.parseConfig(config_testnet_042_ibc_json_1.default, allAssets, chains_1.chainConfigByNetworkEnv[getEnv_1.NetworkEnv.TESTNET_042_IBC], peggyCompatibleCosmosBaseDenoms, createCosmosWalletProvider),
    };
    const currConfig = configMap[applicationNetworkEnv];
    return currConfig;
}
exports.getConfig = getConfig;
//# sourceMappingURL=getConfig.js.map