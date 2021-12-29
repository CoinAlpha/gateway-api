import { Chain } from "../../entities";
import { KeplrWalletProvider, MetamaskWalletProvider, TerraStationWalletProvider } from "../../clients/wallets";
import { provider } from "web3-core";
export declare type WalletServiceContext = {
    sifRpcUrl: string;
    sifApiUrl: string;
    sifChainId: string;
    chains: Chain[];
    getWeb3Provider: () => Promise<provider>;
};
export declare class WalletService {
    private context;
    protected constructor(context: WalletServiceContext);
    static create(context: WalletServiceContext): WalletService;
    keplrProvider: KeplrWalletProvider;
    metamaskProvider: MetamaskWalletProvider;
    terraProvider: TerraStationWalletProvider;
    getPreferredProvider(chain: Chain): KeplrWalletProvider | TerraStationWalletProvider | MetamaskWalletProvider;
    tryConnectAllWallets(): Promise<void | undefined>;
}
declare const _default: typeof WalletService.create;
export default _default;
