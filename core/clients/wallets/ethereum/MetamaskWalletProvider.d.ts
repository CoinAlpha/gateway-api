import { Web3WalletProvider } from "./Web3WalletProvider";
import { Chain } from "../../..";
import { WalletProviderContext } from "../WalletProvider";
import { IAsset } from "entities";
export declare class MetamaskWalletProvider extends Web3WalletProvider {
    context: WalletProviderContext;
    constructor(context: WalletProviderContext);
    private getMetamaskProvider;
    isInstalled(chain: Chain): Promise<boolean>;
    connect(chain: Chain): Promise<string>;
    hasConnected(chain: Chain): Promise<boolean>;
    suggestEthereumAsset(asset: IAsset, loadTokenIconUrl: (asset: IAsset) => Promise<string | undefined> | string | undefined, contractAddress?: string | undefined): Promise<boolean>;
}
