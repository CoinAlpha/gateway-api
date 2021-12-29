import { Chain, Network, IAsset, IAssetAmount } from "../../entities";
import { RegistryEntry } from "../../generated/proto/sifnode/tokenregistry/v1/types";
export declare type TokenRegistryContext = {
    sifRpcUrl: string;
    sifApiUrl: string;
    sifChainId: string;
};
export declare const TokenRegistryService: (context: TokenRegistryContext) => {
    load: () => Promise<RegistryEntry[]>;
    findAssetEntry: (asset: IAsset) => Promise<RegistryEntry | undefined>;
    findAssetEntryOrThrow: (asset: IAsset) => Promise<RegistryEntry>;
    loadCounterpartyEntry(nativeAsset: IAsset): Promise<RegistryEntry | undefined>;
    loadCounterpartyAsset(nativeAsset: IAsset): Promise<IAsset>;
    loadNativeAsset(counterpartyAsset: IAsset): Promise<IAsset>;
    loadCounterpartyAssetAmount: (nativeAssetAmount: IAssetAmount) => Promise<IAssetAmount>;
    loadNativeAssetAmount: (assetAmount: IAssetAmount) => Promise<IAssetAmount>;
    loadConnectionByNetworks(params: {
        sourceNetwork: Network;
        destinationNetwork: Network;
    }): Promise<{
        channelId: string | undefined;
    }>;
    loadConnection(params: {
        fromChain: Chain;
        toChain: Chain;
    }): Promise<{
        channelId: string | undefined;
    }>;
};
export default TokenRegistryService;
