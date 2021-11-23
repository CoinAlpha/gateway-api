import { reactive } from "@vue/reactivity";

import { TransactionStatus } from "../entities";
import { BridgeTx } from "../clients/bridges/BaseBridge";

export type PendingTransferItem = {
  transactionStatus: TransactionStatus;
  bridgeTx: BridgeTx;
};

// Store for reporting on current tx status
export type TxStore = {
  // txs as required by blockchain address
  eth: {
    [address: string]: {
      [hash: string]: TransactionStatus;
    };
  };

  pendingTransfers: {
    [hash: string]: PendingTransferItem;
  };
};

export const tx = reactive<TxStore>({
  eth: {},
  pendingTransfers: {},
}) as TxStore;
