import { Asset, IAsset } from "./Asset";
import { IAssetAmount } from "./AssetAmount";
import { createPoolKey } from "@sifchain/sdk";

export type Pair = ReturnType<typeof Pair>;

export function Pair(nativeAsset: IAssetAmount, externalAsset: IAssetAmount) {
  const amounts: [IAssetAmount, IAssetAmount] = [nativeAsset, externalAsset];

  return {
    amounts,

    otherAsset(asset: IAsset) {
      const otherAsset = amounts.find(
        (amount) => amount.symbol !== asset.symbol,
      );
      if (!otherAsset) throw new Error("Asset doesnt exist in pair");
      return otherAsset;
    },

    symbol() {
      return createPoolKey(externalAsset, nativeAsset);
    },

    contains(...assets: IAsset[]) {
      const local = amounts.map((a) => a.symbol);

      const other = assets.map((a) => a.symbol);

      return !!local.find((s) => other.includes(s));
    },

    getAmount(asset: IAsset | string) {
      const assetSymbol = typeof asset === "string" ? asset : asset.symbol;
      const found = this.amounts.find((amount) => {
        return amount.symbol === assetSymbol;
      });
      if (!found) throw new Error(`Asset ${assetSymbol} doesnt exist in pair`);
      return found;
    },

    toString() {
      return amounts.map((a) => a.toString()).join(" | ");
    },
  };
}
