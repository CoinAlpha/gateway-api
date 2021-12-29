import { TransactionStatus } from "../../entities";
import { BridgeTx } from "../../clients/bridges/BaseBridge";
declare type WalletType = "sif" | "eth" | "cosmoshub";
declare type ErrorEvent = {
    type: "ErrorEvent";
    payload: {
        message: string;
        detail?: {
            type: "etherscan" | "info";
            message: string;
        };
    };
};
declare type SuccessEvent = {
    type: "SuccessEvent";
    payload: {
        message: string;
        detail?: {
            type: "etherscan" | "info";
            message: string;
        };
    };
};
declare type InfoEvent = {
    type: "InfoEvent";
    payload: {
        message: string;
        detail?: {
            type: "etherscan" | "info";
            message: string;
        };
    };
};
declare type TransactionErrorEvent = {
    type: "TransactionErrorEvent";
    payload: {
        txStatus: TransactionStatus;
        message: string;
    };
};
declare type WalletConnectedEvent = {
    type: "WalletConnectedEvent";
    payload: {
        walletType: WalletType;
        address: string;
    };
};
declare type WalletDisconnectedEvent = {
    type: "WalletDisconnectedEvent";
    payload: {
        walletType: WalletType;
        address: string;
    };
};
declare type WalletConnectionErrorEvent = {
    type: "WalletConnectionErrorEvent";
    payload: {
        walletType: WalletType;
        message: string;
    };
};
declare type PegTransactionPendingEvent = {
    type: "PegTransactionPendingEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type PegTransactionCompletedEvent = {
    type: "PegTransactionCompletedEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type PegTransactionErrorEvent = {
    type: "PegTransactionErrorEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type UnpegTransactionPendingEvent = {
    type: "UnpegTransactionPendingEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type UnpegTransactionCompletedEvent = {
    type: "UnpegTransactionCompletedEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type UnpegTransactionErrorEvent = {
    type: "UnpegTransactionErrorEvent";
    payload: {
        bridgeTx: BridgeTx;
        transactionStatus: TransactionStatus;
    };
};
declare type NoLiquidityPoolsFoundEvent = {
    type: "NoLiquidityPoolsFoundEvent";
    payload: {};
};
export declare type AppEvent = ErrorEvent | SuccessEvent | InfoEvent | WalletConnectedEvent | WalletDisconnectedEvent | WalletConnectionErrorEvent | PegTransactionPendingEvent | PegTransactionCompletedEvent | PegTransactionErrorEvent | UnpegTransactionPendingEvent | UnpegTransactionCompletedEvent | UnpegTransactionErrorEvent | NoLiquidityPoolsFoundEvent | TransactionErrorEvent;
export {};
