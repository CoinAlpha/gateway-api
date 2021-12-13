import {
  IAsset,
  AssetAmount,
  Amount,
  Pool,
  LiquidityProvider,
  Chain,
} from "../../entities";
import { NativeDexClient } from "../native";
import { TokenRegistry } from "../native/TokenRegistry";

export type LiquidityContext = {
  sifApiUrl: string;
  sifRpcUrl: string;
  sifChainId: string;
};

export const DEFAULT_SWAP_SLIPPAGE_PERCENT = 1;

export class BaseLiquidityClient {
  constructor(
    protected context: LiquidityContext,
    protected nativeChain: Chain,
  ) {}

  protected tokenRegistry = TokenRegistry(this.context);

  private nativeDexClientPromise?: Promise<NativeDexClient>;
  protected async getNativeDexClient() {
    if (!this.nativeDexClientPromise) {
      this.nativeDexClientPromise = NativeDexClient.connectByChain(
        this.nativeChain,
      );
    }
    return this.nativeDexClientPromise;
  }

  /**
   * Fetch all available liquidity pools.
   */
  async fetchAllPools() {
    const client = await this.getNativeDexClient();
    const res = await client.query.clp.GetPools({});
    const registry = await this.tokenRegistry.load();

    return res.pools
      .map((pool) => {
        const externalSymbol = pool.externalAsset?.symbol;
        const entry = registry.find(
          (item) =>
            item.denom === externalSymbol || item.baseDenom === externalSymbol,
        );
        if (!entry) return null;

        const asset = this.nativeChain.findAssetWithLikeSymbol(entry.baseDenom);

        if (!asset) {
          console.log(entry, externalSymbol);
        }
        if (!asset) return null;
        return Pool(
          AssetAmount(this.nativeChain.nativeAsset, pool.nativeAssetBalance),
          AssetAmount(asset, pool.externalAssetBalance),
          Amount(pool.poolUnits),
        );
      })
      .filter((i) => i != null) as Pool[];
  }

  /*
   * Fetch the liquidity pool associated with the given external asset.
   */
  async fetchPool(params: { asset: IAsset }) {
    const client = await this.getNativeDexClient();

    const entry = await this.tokenRegistry.findAssetEntryOrThrow(params.asset);
    const poolRes = await client.query.clp.GetPool({
      symbol: entry.denom,
    });

    if (!poolRes?.pool) return;
    const pool = Pool(
      AssetAmount(
        this.nativeChain.nativeAsset,
        poolRes.pool.nativeAssetBalance || "0",
      ),
      AssetAmount(params.asset, poolRes.pool.externalAssetBalance || "0"),
      Amount(poolRes.pool.poolUnits),
    );

    return pool;
  }

  /*
   * Fetch liquidity provider data for the given address (if it exists)
   * matching the given external asset.
   */
  async fetchLiquidityProvider(params: { address: string; asset: IAsset }) {
    const client = await this.getNativeDexClient();
    const entry = await this.tokenRegistry.findAssetEntryOrThrow(params.asset);

    const res = await client.query.clp.GetLiquidityProvider({
      lpAddress: params.address,
      symbol: entry.denom,
    });
    return LiquidityProvider(
      params.asset,
      Amount(res.liquidityProvider?.liquidityProviderUnits || "0"),
      params.address,
      Amount(res.nativeAssetBalance),
      Amount(res.externalAssetBalance),
    );
  }
}
