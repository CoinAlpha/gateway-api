// TODO - Conditional load or build-time tree shake
import localnetconfig from "./networks/sifchain/config.localnet.json";
import devnetconfig from "./networks/sifchain/config.devnet.json";
import devnet042config from "./networks/sifchain/config.devnet-042.json";
import testnet042ibcconfig from "./networks/sifchain/config.testnet-042-ibc.json";
import testnetconfig from "./networks/sifchain/config.testnet.json";
import mainnnetconfig from "./networks/sifchain/config.mainnet.json";

import assetsEthereumLocalnet from "./networks/ethereum/assets.ethereum.localnet.json";
import assetsEthereumDevnet from "./networks/ethereum/assets.ethereum.sifchain-devnet.json";
import assetsEthereumTestnet from "./networks/ethereum/assets.ethereum.sifchain-testnet.json";
import assetsEthereumTestnet042IBC from "./networks/ethereum/assets.ethereum.sifchain-testnet-042.json";
import assetsEthereumMainnet from "./networks/ethereum/assets.ethereum.mainnet.json";

import assetsSifchainLocalnet from "./networks/sifchain/assets.sifchain.localnet";
import assetsSifchainMainnet from "./networks/sifchain/assets.sifchain.mainnet";
import assetsSifchainDevnet from "./networks/sifchain/assets.sifchain.devnet";

import {
  parseConfig,
  parseAssets,
  CoreConfig,
  AssetConfig,
} from "../utils/parseConfig";
import { Asset, Network } from "../entities";
import { ServiceContext } from "../services";
import { NetworkEnv } from "./getEnv";
import { chainConfigByNetworkEnv } from "./chains";
import { KeplrWalletProvider, WalletProviderContext } from "../clients/wallets";
import { CosmosWalletProvider } from "../clients/wallets/cosmos/CosmosWalletProvider";
import { NativeDexClient } from "../services/utils/SifClient/NativeDexClient";

type ConfigMap = Record<NetworkEnv, ServiceContext>;

// type ChainNetwork = `${Network}.${NetworkEnv}`;
type ChainNetwork = string;
type AssetMap = Record<ChainNetwork, Asset[]>;

// Save assets for sync lookup throughout the app via Asset.get('symbol')
function cacheAsset(asset: Asset) {
  return Asset(asset);
}

export type AppConfig = ServiceContext; // Will include other injectables

export function getConfig(
  applicationNetworkEnv: NetworkEnv = NetworkEnv.LOCALNET,
  sifchainAssetTag: ChainNetwork = "sifchain.localnet",
  ethereumAssetTag: ChainNetwork = "ethereum.localnet",
  createCosmosWalletProvider: (
    context: WalletProviderContext,
  ) => CosmosWalletProvider = (context) => new KeplrWalletProvider(context),
): AppConfig {
  const assetMap: Partial<AssetMap> = {
    "sifchain.localnet": parseAssets(
      assetsSifchainLocalnet.assets as AssetConfig[],
    ),
    "sifchain.mainnet": parseAssets(
      assetsSifchainMainnet.assets as AssetConfig[],
    ),
    "sifchain.devnet": parseAssets(
      assetsSifchainDevnet.assets as AssetConfig[],
    ),
    "ethereum.localnet": parseAssets(
      assetsEthereumLocalnet.assets as AssetConfig[],
    ),
    "ethereum.devnet": parseAssets(
      assetsEthereumDevnet.assets as AssetConfig[],
    ),
    "ethereum.testnet": parseAssets(
      assetsEthereumTestnet.assets as AssetConfig[],
    ),
    "ethereum.testnet_042_ibc": parseAssets(
      assetsEthereumTestnet042IBC.assets as AssetConfig[],
    ),
    "ethereum.mainnet": parseAssets(
      assetsEthereumMainnet.assets as AssetConfig[],
    ),
  };

  const sifchainAssets = assetMap[sifchainAssetTag] || [];
  const ethereumAssets = assetMap[ethereumAssetTag] || [];

  let allAssets = [...sifchainAssets, ...ethereumAssets];

  Object.values(Network)
    .filter((n) => n !== Network.ETHEREUM && n !== Network.SIFCHAIN)
    .forEach((n) => {
      allAssets.push(
        ...sifchainAssets.map((a) => ({
          ...a,
          network: n,
        })),
      );
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
  const configMap: ConfigMap = {
    localnet: parseConfig(
      localnetconfig as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.LOCALNET],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
    devnet: parseConfig(
      devnetconfig as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.DEVNET],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
    devnet_042: parseConfig(
      devnet042config as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.DEVNET_042],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
    testnet: parseConfig(
      testnetconfig as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.TESTNET],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
    mainnet: parseConfig(
      mainnnetconfig as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.MAINNET],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
    testnet_042_ibc: parseConfig(
      testnet042ibcconfig as CoreConfig,
      allAssets,
      chainConfigByNetworkEnv[NetworkEnv.TESTNET_042_IBC],
      peggyCompatibleCosmosBaseDenoms,
      createCosmosWalletProvider,
    ),
  };

  const currConfig = configMap[applicationNetworkEnv];

  return currConfig;
}
