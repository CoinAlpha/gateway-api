import { IAssetAmount, TransactionStatus, Chain } from "../../entities";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { Log } from "@cosmjs/stargate/build/logs";
import { WalletProvider } from "../wallets";

export type BridgeApproveStartedEvent = { type: "approve_started" };
export type BridgeApprovedEvent = { type: "approved" };
export type BridgeSentEvent = { type: "sent"; tx: TransactionStatus };
export type BridgeTxError = { type: "tx_error"; tx: TransactionStatus };
export type BridgeApproveError = {
  type: "approve_error";
  tx?: TransactionStatus;
};
export type BridgeSigningEvent = { type: "signing" };
export type BridgeEvent =
  | BridgeApproveStartedEvent
  | BridgeApprovedEvent
  | BridgeSigningEvent
  | BridgeSentEvent
  | BridgeTxError
  | BridgeApproveError;

export type BridgeParams = {
  assetAmount: IAssetAmount;
  fromAddress: string;
  toAddress: string;
  fromChain: Chain;
  toChain: Chain;
};

export interface BaseBridgeTx {
  fromChain: Chain;
  toChain: Chain;
  assetAmount: IAssetAmount;
  fromAddress: string;
  toAddress: string;
  hash: string;
}

export type IBCBridgeTx = BaseBridgeTx & {
  type: "ibc";
  meta?: {
    logs?: Log[];
  };
};

export type EthBridgeTx = BaseBridgeTx & {
  type: "eth";
  startingHeight: number;
  confirmCount: number;
  completionConfirmCount: number;
};

export type BridgeTx = IBCBridgeTx | EthBridgeTx;

export interface BridgeTxEvents {
  tx_sent: (tx: BridgeTx) => void;
  tx_complete: (tx: BridgeTx) => void;
}
export const bridgeTxEmitter = new EventEmitter() as TypedEmitter<BridgeTxEvents>;

export abstract class BaseBridge<WalletProviderType> {
  abstract estimateFees(
    wallet: WalletProviderType,
    params: BridgeParams,
  ): IAssetAmount | undefined;

  abstract approveTransfer(
    wallet: WalletProviderType,
    params: BridgeParams,
  ): Promise<undefined | void>;

  abstract transfer(
    wallet: WalletProviderType,
    params: BridgeParams,
  ): Promise<BridgeTx>;

  abstract waitForTransferComplete(
    wallet: WalletProviderType,
    transferTx: BridgeTx,
    onUpdateTx: (update?: Partial<BridgeTx>) => void,
  ): Promise<boolean>;
}
