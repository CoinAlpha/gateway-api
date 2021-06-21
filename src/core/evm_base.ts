export interface EVMBase {
  getStatus(): string;

  getBalances(addresses: Array<string>): Array<number>;

  getAllowances(symbols: Array<string>, spender: string): Array<number>;

  approve(symbol: string, spender: string, amount: string): string;

  poll(tx: string): string;

  getAddresses(symbols: Array<string>): Array<string>;

  getGasPrice(): number;
}
