import { IAsset, Network } from "../../../entities";

export function isOriginallySifchainNativeToken(asset: IAsset) {
  return (
    asset.homeNetwork !== Network.ETHEREUM ||
    asset.symbol.toLowerCase() === "erowan"
  );
}
