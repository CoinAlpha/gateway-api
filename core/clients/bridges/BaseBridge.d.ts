import { IAssetAmount, TransactionStatus, Chain } from "../../entities";
import TypedEmitter from "typed-emitter";
import { Log } from "@cosmjs/stargate/build/logs";
export declare type BridgeApproveStartedEvent = {
    type: "approve_started";
};
export declare type BridgeApprovedEvent = {
    type: "approved";
};
export declare type BridgeSentEvent = {
    type: "sent";
    tx: TransactionStatus;
};
export declare type BridgeTxError = {
    type: "tx_error";
    tx: TransactionStatus;
};
export declare type BridgeApproveError = {
    type: "approve_error";
    tx?: TransactionStatus;
};
export declare type BridgeSigningEvent = {
    type: "signing";
};
export declare type BridgeEvent = BridgeApproveStartedEvent | BridgeApprovedEvent | BridgeSigningEvent | BridgeSentEvent | BridgeTxError | BridgeApproveError;
export declare type BridgeParams = {
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
export declare type IBCBridgeTx = BaseBridgeTx & {
    type: "ibc";
    meta?: {
        logs?: Log[];
    };
};
export declare type EthBridgeTx = BaseBridgeTx & {
    type: "eth";
    startingHeight: number;
    confirmCount: number;
    completionConfirmCount: number;
};
export declare type BridgeTx = IBCBridgeTx | EthBridgeTx;
export interface BridgeTxEvents {
    tx_sent: (tx: BridgeTx) => void;
    tx_complete: (tx: BridgeTx) => void;
}
export declare const bridgeTxEmitter: TypedEmitter<BridgeTxEvents>;
export declare abstract class BaseBridge<WalletProviderType> {
    abstract estimateFees(wallet: WalletProviderType, params: BridgeParams): IAssetAmount | undefined;
    abstract approveTransfer(wallet: WalletProviderType, params: BridgeParams): Promise<undefined | void>;
    abstract transfer(wallet: WalletProviderType, params: BridgeParams): Promise<BridgeTx>;
    abstract waitForTransferComplete(wallet: WalletProviderType, transferTx: BridgeTx, onUpdateTx: (update?: Partial<BridgeTx>) => void): Promise<boolean>;
}
