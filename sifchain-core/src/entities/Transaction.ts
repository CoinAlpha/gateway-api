export type TransactionStatus = {
  code?: number;
  hash: string;
  state:
    | "requested"
    | "accepted"
    | "failed"
    | "rejected"
    | "out_of_gas"
    | "completed"; // Do we need to differentiate between failed and rejected here?
  memo?: string;
  symbol?: string;
};

export type TxHash = string;
