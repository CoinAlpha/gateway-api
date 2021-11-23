import { Network, Chain } from "./entities";
import { getConfig } from "./config/getConfig";
import { NetworkEnv, profileLookup } from "./config/getEnv";
import { WalletProviderContext } from "./clients/wallets";
import { CosmosWalletProvider } from "./clients/wallets/cosmos";
import { IBCBridge } from "./clients/bridges/IBCBridge/IBCBridge";
import { networkChainCtorLookup } from "./services/ChainsService";

type WalletsOption = {
  cosmos: (context: Partial<WalletProviderContext>) => CosmosWalletProvider;
};

export const getSdkConfig = (params: {
  environment: NetworkEnv;
  wallets: WalletsOption;
}) => {
  const { tag, ethAssetTag, sifAssetTag } = profileLookup[params.environment];
  if (typeof tag == "undefined")
    throw new Error("environment " + params.environment + " not found");

  return getConfig(tag, sifAssetTag, ethAssetTag, params.wallets.cosmos);
};

export function createSdk(options: {
  environment: NetworkEnv;
  wallets: WalletsOption;
}) {
  const config = getSdkConfig(options);
  return {
    wallets: {
      cosmos: config.cosmosWalletProvider,
    },
    chains: (Object.fromEntries(
      Object.keys(networkChainCtorLookup).map((network) => {
        return [
          network,
          new networkChainCtorLookup[network as Network]({
            assets: config.assets,
            chainConfig: config.chainConfigsByNetwork[network as Network],
          }),
        ];
      }),
    ) as unknown) as Record<Network, Chain>,
    bridges: {
      ibc: new IBCBridge(config),
    },
  };
}
