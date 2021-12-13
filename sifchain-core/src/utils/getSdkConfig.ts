import { profileLookup, getConfig, NetworkEnv } from "../";

export const getSdkConfig = (params: { environment: NetworkEnv }) => {
  const { tag, ethAssetTag, sifAssetTag } = profileLookup[params.environment];
  if (typeof tag == "undefined")
    throw new Error("environment " + params.environment + " not found");

  return getConfig(tag, sifAssetTag, ethAssetTag);
};
