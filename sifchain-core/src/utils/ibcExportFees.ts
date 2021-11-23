import {
  getChainsService,
  Network,
  AssetAmount,
  IAssetAmount,
} from "../entities";

export function calculateIBCExportFee(transferAmount: IAssetAmount) {
  const rowan = getChainsService()
    .get(Network.SIFCHAIN)
    .findAssetWithLikeSymbolOrThrow("rowan");

  // ibc exports have .99 rowan fee
  return AssetAmount(rowan, "990000000000000000");
}

export const IBC_EXPORT_FEE_ADDRESS =
  "sif1e8vmeyg4j5uftkhnvlz7493usjs7k6h3src0ph";
