import { Services } from "../../services";
import { Store } from "../../store";
import {
  Pool,
  AssetAmount,
  Amount,
  Network,
  LiquidityProvider,
} from "../../entities";
import { isIBCDenom } from "../../services/utils/IbcService";
import { createPoolKey } from "../../utils";
import { AccountPool } from "../../store/pools";

type PickSif = Pick<Services["sif"], "getState">;
type PickClp = Pick<
  Services["clp"],
  "getAccountLiquidityProviderData" | "getRawPools"
>;
type PickChains = Pick<
  Services["chains"],
  "get" | "findChainAssetMatch" | "findChainAssetMatch"
>;
type PickTokenRegistry = Pick<Services["tokenRegistry"], "load">;
type SyncPoolsArgs = {
  sif: PickSif;
  clp: PickClp;
  chains: PickChains;
  tokenRegistry: PickTokenRegistry;
};

type SyncPoolsStore = Pick<Store, "accountpools" | "pools">;

export function SyncPools(
  { sif, clp, chains, tokenRegistry }: SyncPoolsArgs,
  store: SyncPoolsStore,
) {
  return {
    syncPublicPools,
    syncUserPools,
  };

  async function syncPublicPools() {
    const nativeAsset = chains.get(Network.SIFCHAIN).nativeAsset;
    const registry = await tokenRegistry.load();

    const rawPools = await clp.getRawPools();
    const pools = rawPools.pools
      .map((pool) => {
        const externalSymbol = pool.externalAsset?.symbol;
        const entry = registry.find(
          (item) =>
            item.denom === externalSymbol || item.baseDenom === externalSymbol,
        );
        if (!entry) return null;

        const asset = chains
          .get(Network.SIFCHAIN)
          .findAssetWithLikeSymbol(entry.baseDenom);

        if (!asset) {
          console.log(entry, externalSymbol);
        }
        if (!asset) return null;

        return Pool(
          AssetAmount(nativeAsset, pool.nativeAssetBalance),
          AssetAmount(asset, pool.externalAssetBalance),
          Amount(pool.poolUnits),
        );
      })
      .filter((val) => val != null) as Pool[];

    for (let pool of pools) {
      store.pools[pool.symbol()] = pool;
    }
  }

  async function syncUserPools(address: string) {
    const registry = await tokenRegistry.load();

    // This is a hot method when there are a heap of pools
    // Ideally we would have a better rest endpoint design
    const currentAccountPools: Record<string, AccountPool> = {};
    if (!store.accountpools[address]) {
      store.accountpools[address] = {};
    }

    const rawLpData = await clp.getAccountLiquidityProviderData({
      lpAddress: address,
    });

    rawLpData.forEach((lpItem) => {
      const symbol = lpItem.liquidityProvider?.asset?.symbol;
      if (!symbol) return;

      const entry = registry.find(
        (item) => item.denom === symbol || item.baseDenom === symbol,
      );
      if (!entry) return;

      const asset = chains
        .get(Network.SIFCHAIN)
        .findAssetWithLikeSymbol(entry.baseDenom);
      if (!asset) return;

      const lp = LiquidityProvider(
        asset,
        Amount(lpItem.liquidityProvider!.liquidityProviderUnits),
        address,
        Amount(lpItem.nativeAssetBalance),
        Amount(lpItem.externalAssetBalance),
      );
      const pool = createPoolKey(
        asset,
        chains.get(Network.SIFCHAIN).nativeAsset,
      );
      currentAccountPools[pool] = { lp, pool };
    });

    Object.keys(store.accountpools[address]).forEach((poolId) => {
      // If pool is gone now, delete. Ie user remioved all liquidity
      if (!currentAccountPools[poolId]) {
        delete store.accountpools[address][poolId];
      }
    });
    Object.keys(currentAccountPools).forEach((poolId) => {
      store.accountpools[address][poolId] = currentAccountPools[poolId];
    });
  }
}
