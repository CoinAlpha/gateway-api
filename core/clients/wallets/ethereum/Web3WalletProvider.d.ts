import { WalletProvider, WalletProviderContext } from "../WalletProvider";
import { Chain, IAssetAmount, EthChainConfig } from "../../../entities";
import { provider, WebsocketProvider, IpcProvider } from "web3-core";
import Web3 from "web3";
import { NativeDexTransaction, NativeDexSignedTransaction, NativeDexTransactionResult } from "../../../services/utils/SifClient/NativeDexTransaction";
export declare class Web3Transaction {
    readonly contractAddress: string;
    constructor(contractAddress: string);
}
export declare function isEventEmittingProvider(provider?: unknown): provider is WebsocketProvider | IpcProvider;
export declare class Web3WalletProvider extends WalletProvider<Web3Transaction> {
    context: WalletProviderContext;
    private options;
    constructor(context: WalletProviderContext, options: {
        getWeb3Provider: () => Promise<provider>;
    });
    isInstalled(chain: Chain): Promise<boolean>;
    private onProviderEvent;
    onChainChanged(callback: () => void): Promise<() => void>;
    onAccountChanged(callback: () => void): Promise<() => void>;
    private web3Promise?;
    getWeb3(): Promise<Web3>;
    getRequiredApprovalAmount(chain: Chain, tx: NativeDexTransaction<Web3Transaction>, assetAmount: IAssetAmount): Promise<IAssetAmount>;
    approve(chain: Chain, tx: NativeDexTransaction<Web3Transaction>, amount: IAssetAmount): Promise<void | undefined>;
    sign(chain: Chain, tx: NativeDexTransaction<Web3Transaction>): Promise<NativeDexSignedTransaction<Web3Transaction>>;
    broadcast(chain: Chain, tx: NativeDexSignedTransaction<Web3Transaction>): Promise<NativeDexTransactionResult>;
    getEthChainConfig(chain: Chain): EthChainConfig;
    isChainSupported(chain: Chain): boolean;
    connect(chain: Chain): Promise<string>;
    hasConnected(chain: Chain): Promise<boolean>;
    canDisconnect(chain: Chain): boolean;
    disconnect(chain: Chain): Promise<void>;
    fetchBalances(chain: Chain, address: string): Promise<IAssetAmount[]>;
}
