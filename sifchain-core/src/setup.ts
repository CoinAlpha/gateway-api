import { Network, Chain } from "./entities";
import { NetworkEnv } from "./config/getEnv";
import { IBCBridge } from "./clients/bridges/IBCBridge/IBCBridge";
import { EthBridge } from "./clients/bridges/EthBridge/EthBridge";
import { LiquidityClient } from "./clients/liquidity";
import { networkChainCtorLookup } from "./clients";
import { getSdkConfig } from "./utils/getSdkConfig";

export function createSdk(options: { environment: NetworkEnv }) {
  const config = getSdkConfig(options);
  const chains = Object.fromEntries(
    Object.keys(networkChainCtorLookup).map((network) => {
      const n = network as Network;
      return [
        n,
        new networkChainCtorLookup[n]({
          assets: config.assets,
          chainConfig: config.chainConfigsByNetwork[network as Network],
        }),
      ];
    }),
  ) as unknown as Record<Network, Chain>;
  return {
    context: config,
    chains,
    bridges: {
      ibc: new IBCBridge(config),
      eth: new EthBridge(config),
    },
    liquidity: new LiquidityClient(config, chains.sifchain),
  };
}
