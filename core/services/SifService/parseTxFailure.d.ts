import { TransactionStatus } from "../../entities";
export declare function parseEthereumTxFailure(txFailure: {
    transactionHash: string;
    rawLog?: string;
}): TransactionStatus;
export declare function parseTxFailure(txFailure: {
    transactionHash: string;
    rawLog?: string;
}): TransactionStatus;