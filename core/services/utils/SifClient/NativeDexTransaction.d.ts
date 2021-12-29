import { StdTx, BroadcastTxResult } from "@cosmjs/launchpad";
import { TxRaw } from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";
export interface NativeDexTransactionFee {
    gas: string;
    price: {
        denom: string;
        amount: string;
    };
}
export declare class NativeDexTransaction<EncodeMsg> {
    readonly fromAddress: string;
    readonly msgs: EncodeMsg[];
    readonly fee: NativeDexTransactionFee;
    readonly memo: string;
    constructor(fromAddress: string, msgs: EncodeMsg[], fee?: NativeDexTransactionFee, memo?: string);
}
export declare class NativeDexSignedTransaction<T> {
    readonly raw: NativeDexTransaction<T>;
    readonly signed?: StdTx | TxRaw | undefined;
    constructor(raw: NativeDexTransaction<T>, signed?: StdTx | TxRaw | undefined);
}
export declare type NativeDexTransactionResult = BroadcastTxResult;
