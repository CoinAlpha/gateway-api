import { Asset, IAsset } from "./Asset";
import { IAmount } from "./Amount";

export function LiquidityProvider(
  asset: IAsset,
  units: IAmount,
  address: string,
  nativeAmount: IAmount,
  externalAmount: IAmount,
) {
  return { asset, units, address, nativeAmount, externalAmount };
}
export type LiquidityProvider = {
  asset: IAsset;
  units: IAmount;
  address: string;
  nativeAmount: IAmount;
  externalAmount: IAmount;
};
