import { TransactionStatus } from "../../entities";
import { BridgeTx } from "../../clients/bridges/BaseBridge";

// Add more wallet types here as they come up
type WalletType = "sif" | "eth" | "cosmoshub";

type ErrorEvent = {
  type: "ErrorEvent";
  payload: {
    message: string;
    detail?: {
      type: "etherscan" | "info";
      message: string;
    };
  };
};

type SuccessEvent = {
  type: "SuccessEvent";
  payload: {
    message: string;
    detail?: {
      type: "etherscan" | "info";
      message: string;
    };
  };
};

type InfoEvent = {
  type: "InfoEvent";
  payload: {
    message: string;
    detail?: {
      type: "etherscan" | "info";
      message: string;
    };
  };
};

type TransactionErrorEvent = {
  type: "TransactionErrorEvent";
  payload: {
    txStatus: TransactionStatus;
    message: string;
  };
};

type WalletConnectedEvent = {
  type: "WalletConnectedEvent";
  payload: { walletType: WalletType; address: string };
};

type WalletDisconnectedEvent = {
  type: "WalletDisconnectedEvent";
  payload: { walletType: WalletType; address: string };
};

type WalletConnectionErrorEvent = {
  type: "WalletConnectionErrorEvent";
  payload: { walletType: WalletType; message: string };
};

type PegTransactionPendingEvent = {
  type: "PegTransactionPendingEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type PegTransactionCompletedEvent = {
  type: "PegTransactionCompletedEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type PegTransactionErrorEvent = {
  type: "PegTransactionErrorEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type UnpegTransactionPendingEvent = {
  type: "UnpegTransactionPendingEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type UnpegTransactionCompletedEvent = {
  type: "UnpegTransactionCompletedEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type UnpegTransactionErrorEvent = {
  type: "UnpegTransactionErrorEvent";
  payload: {
    bridgeTx: BridgeTx;
    transactionStatus: TransactionStatus;
  };
};

type NoLiquidityPoolsFoundEvent = {
  type: "NoLiquidityPoolsFoundEvent";
  payload: {};
};

export type AppEvent =
  | ErrorEvent
  | SuccessEvent
  | InfoEvent
  | WalletConnectedEvent
  | WalletDisconnectedEvent
  | WalletConnectionErrorEvent
  | PegTransactionPendingEvent
  | PegTransactionCompletedEvent
  | PegTransactionErrorEvent
  | UnpegTransactionPendingEvent
  | UnpegTransactionCompletedEvent
  | UnpegTransactionErrorEvent
  | NoLiquidityPoolsFoundEvent
  | TransactionErrorEvent;
