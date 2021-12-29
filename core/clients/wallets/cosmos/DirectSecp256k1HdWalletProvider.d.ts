import { DirectSecp256k1HdWallet, EncodeObject } from "@cosmjs/proto-signing";
import { Chain } from "../../../entities";
import { WalletProviderContext } from "../WalletProvider";
import { CosmosWalletProvider } from "./CosmosWalletProvider";
import { NativeDexTransaction, NativeDexSignedTransaction } from "../../../services/utils/SifClient/NativeDexTransaction";
import { BroadcastTxResult } from "@cosmjs/launchpad";
export declare type DirectSecp256k1HdWalletProviderOptions = {
    mnemonic: string;
};
export declare class DirectSecp256k1HdWalletProvider extends CosmosWalletProvider {
    context: WalletProviderContext;
    private options;
    static create(context: WalletProviderContext, options: DirectSecp256k1HdWalletProviderOptions): DirectSecp256k1HdWalletProvider;
    isInstalled(chain: Chain): Promise<boolean>;
    constructor(context: WalletProviderContext, options: DirectSecp256k1HdWalletProviderOptions);
    hasConnected(chain: Chain): Promise<boolean>;
    isChainSupported(chain: Chain): boolean;
    canDisconnect(chain: Chain): boolean;
    disconnect(chain: Chain): Promise<void>;
    getSendingSigner(chain: Chain): Promise<DirectSecp256k1HdWallet>;
    connect(chain: Chain): Promise<string>;
    sign(chain: Chain, tx: NativeDexTransaction<EncodeObject>): Promise<NativeDexSignedTransaction<EncodeObject>>;
    broadcast(chain: Chain, tx: NativeDexSignedTransaction<EncodeObject>): Promise<BroadcastTxResult>;
}
