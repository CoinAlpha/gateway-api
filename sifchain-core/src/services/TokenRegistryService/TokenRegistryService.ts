import { fromBaseUnits, toBaseUnits } from "../../utils";
import {
  Chain,
  Network,
  getChainsService,
  IAsset,
  Asset,
  IAssetAmount,
  AssetAmount,
} from "../../entities";
import { RegistryEntry } from "../../generated/proto/sifnode/tokenregistry/v1/types";
import { NativeDexClient } from "../utils/SifClient/NativeDexClient";

export type TokenRegistryContext = {
  sifRpcUrl: string;
  sifApiUrl: string;
  sifChainId: string;
};

let tokenRegistryPromise: Promise<RegistryEntry[]>;
export const TokenRegistryService = (context: TokenRegistryContext) => {
  const loadTokenRegistry = async () => {
    if (!tokenRegistryPromise) {
      tokenRegistryPromise = (async () => {
        const dex = await NativeDexClient.connect(
          context.sifRpcUrl,
          context.sifApiUrl,
          context.sifChainId,
        );
        const res = await dex.query?.tokenregistry.Entries({});
        const data = res?.registry?.entries;
        if (!data) throw new Error("Whitelist not found");
        return data as RegistryEntry[];
      })();
    }
    return tokenRegistryPromise;
  };

  const self = {
    load: () => loadTokenRegistry(),
    findAssetEntry: async (asset: IAsset) => {
      const items = await loadTokenRegistry();
      return items.find((item) => item.baseDenom === asset.symbol);
    },
    findAssetEntryOrThrow: async (asset: IAsset) => {
      const entry = await self.findAssetEntry(asset);
      if (!entry)
        throw new Error("TokenRegistry entry not found for " + asset.symbol);
      return entry;
    },
    async loadCounterpartyEntry(nativeAsset: IAsset) {
      const entry = await this.findAssetEntryOrThrow(nativeAsset);
      if (
        !entry.ibcCounterpartyDenom ||
        entry.ibcCounterpartyDenom === entry.denom
      ) {
        return entry;
      }
      const items = await loadTokenRegistry();
      return items.find((item) => entry.ibcCounterpartyDenom === item.denom);
    },
    async loadCounterpartyAsset(nativeAsset: IAsset) {
      const entry = await this.findAssetEntryOrThrow(nativeAsset);
      if (
        !entry.ibcCounterpartyDenom ||
        entry.ibcCounterpartyDenom === entry.denom
      ) {
        return nativeAsset;
      }
      const items = await loadTokenRegistry();
      const counterpartyEntry = items.find(
        (item) => entry.ibcCounterpartyDenom === item.denom,
      )!;
      return Asset({
        ...nativeAsset,
        symbol: counterpartyEntry.denom,
        decimals: +counterpartyEntry.decimals,
      });
    },
    async loadNativeAsset(counterpartyAsset: IAsset) {
      const entry = await this.findAssetEntryOrThrow(counterpartyAsset);
      if (!entry.unitDenom || entry.unitDenom === entry.denom) {
        return counterpartyAsset;
      }
      const items = await loadTokenRegistry();
      const nativeEntry = items.find((item) => entry.unitDenom === item.denom)!;
      return Asset({
        ...counterpartyAsset,
        symbol: nativeEntry.denom,
        decimals: +nativeEntry.decimals,
      });
    },
    loadCounterpartyAssetAmount: async (
      nativeAssetAmount: IAssetAmount,
    ): Promise<IAssetAmount> => {
      await self.load();
      const counterpartyAsset = await self.loadCounterpartyAsset(
        nativeAssetAmount.asset,
      );
      const decimalAmount = fromBaseUnits(
        nativeAssetAmount.amount.toString(),
        nativeAssetAmount.asset,
      );
      const convertedIntAmount = toBaseUnits(decimalAmount, counterpartyAsset);
      return AssetAmount(counterpartyAsset, convertedIntAmount);
    },
    loadNativeAssetAmount: async (
      assetAmount: IAssetAmount,
    ): Promise<IAssetAmount> => {
      await self.load();
      const nativeAsset = await self.loadNativeAsset(assetAmount.asset);
      const decimalAmount = fromBaseUnits(
        assetAmount.amount.toString(),
        assetAmount.asset,
      );
      const convertedIntAmount = toBaseUnits(decimalAmount, nativeAsset);
      return AssetAmount(nativeAsset, convertedIntAmount);
    },
    async loadConnectionByNetworks(params: {
      sourceNetwork: Network;
      destinationNetwork: Network;
    }) {
      return this.loadConnection({
        fromChain: getChainsService().get(params.sourceNetwork),
        toChain: getChainsService().get(params.destinationNetwork),
      });
    },
    async loadConnection(params: { fromChain: Chain; toChain: Chain }) {
      const items = await loadTokenRegistry();

      const sourceIsNative = params.fromChain.network === Network.SIFCHAIN;

      const counterpartyChain = sourceIsNative
        ? params.toChain
        : params.fromChain;

      const item = items
        .reverse()
        .find(
          (item) =>
            item.baseDenom?.toLowerCase() ===
            counterpartyChain.nativeAsset.symbol.toLowerCase(),
        );

      // console.log("loadConnection", {
      //   ...params,
      //   counterpartyWhitelistItem: item,
      // });

      if (sourceIsNative) {
        return { channelId: item?.ibcChannelId };
      } else {
        return { channelId: item?.ibcCounterpartyChannelId };
      }
    },
  };
  return self;
};

export default TokenRegistryService;
