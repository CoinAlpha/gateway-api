import { IAssetAmount, Chain, TransactionStatus } from "../../entities";
import { NativeDexTransaction, NativeDexSignedTransaction, NativeDexTransactionResult } from "../../services/utils/SifClient/NativeDexTransaction";
export declare type WalletProviderContext = {
    sifRpcUrl: string;
    sifChainId: string;
    sifApiUrl: string;
};
export declare abstract class WalletProvider<TxType> {
    abstract context: WalletProviderContext;
    abstract isChainSupported(chain: Chain): boolean;
    abstract connect(chain: Chain): Promise<string>;
    abstract hasConnected(chain: Chain): Promise<boolean>;
    abstract canDisconnect(chain: Chain): boolean;
    abstract disconnect(chain: Chain): Promise<void>;
    abstract fetchBalances(chain: Chain, address: string): Promise<IAssetAmount[]>;
    abstract getRequiredApprovalAmount(chain: Chain, tx: NativeDexTransaction<TxType>, amount: IAssetAmount): Promise<IAssetAmount>;
    abstract approve(chain: Chain, tx: NativeDexTransaction<TxType>, amount: IAssetAmount): Promise<void | undefined>;
    abstract sign(chain: Chain, tx: NativeDexTransaction<TxType>): Promise<NativeDexSignedTransaction<TxType>>;
    abstract broadcast(chain: Chain, tx: NativeDexSignedTransaction<TxType>): Promise<NativeDexTransactionResult>;
    abstract isInstalled(chain: Chain): Promise<boolean>;
    parseTxResultToStatus(result: NativeDexTransactionResult): TransactionStatus;
}
