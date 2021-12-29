import { TransactionStatus } from "../entities";
import { BridgeTx } from "../clients/bridges/BaseBridge";
export declare type PendingTransferItem = {
    transactionStatus: TransactionStatus;
    bridgeTx: BridgeTx;
};
export declare type TxStore = {
    eth: {
        [address: string]: {
            [hash: string]: TransactionStatus;
        };
    };
    pendingTransfers: {
        [hash: string]: PendingTransferItem;
    };
};
export declare const tx: TxStore;
