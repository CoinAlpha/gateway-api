import { StdTx, BroadcastTxResult } from "@cosmjs/launchpad";
import { EncodeObject } from "@cosmjs/proto-signing";
import { IAssetAmount } from "@sifchain/sdk";
import { TxRaw } from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";

export interface NativeDexTransactionFee {
  gas: string;
  price: {
    denom: string;
    amount: string;
  };
}
export class NativeDexTransaction<EncodeMsg> {
  constructor(
    readonly fromAddress: string,
    readonly msgs: EncodeMsg[],
    readonly fee: NativeDexTransactionFee = {
      gas: "",
      price: {
        denom: "",
        amount: "",
      },
    },
    readonly memo: string = "",
  ) {}
}

export class NativeDexSignedTransaction<T> {
  constructor(
    readonly raw: NativeDexTransaction<T>,
    readonly signed?: StdTx | TxRaw,
  ) {}
}

export type NativeDexTransactionResult = BroadcastTxResult;
