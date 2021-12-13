import { Asset, IAsset } from "../entities";

export const createPoolKey = (a: IAsset | string, b: IAsset | string) => {
  if (typeof a === "string") a = Asset.get(a);
  if (typeof b === "string") b = Asset.get(b);

  return [a, b]
    .map((asset) => asset.symbol.toLowerCase())
    .sort()
    .join("_");
};
