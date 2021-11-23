import {
  Account,
  BroadcastMode,
  CosmosFeeTable,
  GasLimits,
  GasPrice,
  OfflineSigner,
  SigningCosmosClient,
  AuthAccountsResponse,
  logs,
  StdTx,
  BroadcastTxResult,
} from "@cosmjs/launchpad";
import { fromHex } from "@cosmjs/encoding";
import { Uint53 } from "@cosmjs/math";
import { SifUnSignedClient } from "./SifUnsignedClient";
import { CosmosClient } from "@cosmjs/launchpad";

export class Compatible42CosmosClient extends CosmosClient {
  // NOTE(59023g): in 0.42, the result.logs array items do not include `msg_index` and
  // `log` so we hardcode these values. It does assume logs array length is always 1
  async broadcastTx(tx: StdTx): Promise<BroadcastTxResult> {
    console.log({ tx });
    const result: any = await this.lcdClient.post("/cosmos/tx/v1beta1/txs", {
      tx_bytes: tx,
      mode: 1,
    });
    console.log({ result });
    if (!result.txhash?.match(/^([0-9A-F][0-9A-F])+$/)) {
      console.error("INVALID TXHASH IN RESULT", result);
      throw new Error(
        "Received ill-formatted txhash. Must be non-empty upper-case hex",
      );
    }
    result.logs = result.logs || [];
    result.logs[0] = result.logs[0] || {};
    result.logs[0].msg_index = 0;
    result.logs[0].log = "";

    return result.code !== undefined
      ? {
          height: Uint53.fromString(result.height).toNumber(),
          transactionHash: result.txhash,
          code: result.code,
          rawLog: result.raw_log || "",
        }
      : {
          logs: result.logs ? logs.parseLogs(result.logs) : [],
          rawLog: result.raw_log || "",
          transactionHash: result.txhash,
          data: result.data ? fromHex(result.data) : undefined,
        };
  }
}

export class Compatible42SigningCosmosClient extends SigningCosmosClient {
  constructor(
    apiUrl: string,
    senderAddress: string,
    signer: OfflineSigner,
    gasPrice?: GasPrice,
    gasLimits?: Partial<GasLimits<CosmosFeeTable>>,
    broadcastMode?: BroadcastMode,
  ) {
    super(apiUrl, senderAddress, signer, gasPrice, gasLimits, broadcastMode);
    // NOTE(ajoslin): in 0.42, the response format for /auth/accounts/:address changed.
    // It used to have `.result.type` equal to `cosmos-sdk/Account`, but now it is
    // `cosmos-sdk/BaseAccount`. We need to check for this new type and coerce
    // the response back to the old type by overriding this method.
    (this.lcdClient.auth as any).account = async (address: string) => {
      const path = `/auth/accounts/${address}`;
      const responseData = await this.lcdClient.get(path);
      if (
        responseData.result.type !== "cosmos-sdk/Account" &&
        responseData.result.type !== "cosmos-sdk/BaseAccount"
      ) {
        throw new Error("Unexpected response data format");
      }
      responseData.result.type = "cosmos-sdk/Account";
      // Note (59023g): New Legacy API wraps return values with omitempty so if empty,
      // does not return a value.  This prevents wallet from connecting in UI
      if (!responseData.result.value.sequence) {
        responseData.result.value.sequence = "0";
      }
      if (!responseData.result.value.account_number) {
        responseData.result.value.account_number = "0";
      }
      return responseData as AuthAccountsResponse;
    };
  }

  // NOTE(59023g): in 0.42, the result.logs array items do not include `msg_index` and
  // `log` so we hardcode these values. It does assume logs array length is always 1
  async broadcastTx(tx: StdTx): Promise<BroadcastTxResult> {
    const result: any = await this.lcdClient.broadcastTx(tx);
    if (!result.txhash?.match(/^([0-9A-F][0-9A-F])+$/)) {
      console.error("INVALID TXHASH IN RESULT", result);
      throw new Error(
        "Received ill-formatted txhash. Must be non-empty upper-case hex",
      );
    }
    result.logs = result.logs || [];
    result.logs[0] = result.logs[0] || {};
    result.logs[0].msg_index = 0;
    result.logs[0].log = "";

    return result.code !== undefined
      ? {
          height: Uint53.fromString(result.height).toNumber(),
          transactionHash: result.txhash,
          code: result.code,
          rawLog: result.raw_log || "",
        }
      : {
          logs: result.logs ? logs.parseLogs(result.logs) : [],
          rawLog: result.raw_log || "",
          transactionHash: result.txhash,
          data: result.data ? fromHex(result.data) : undefined,
        };
  }
}

export class SifClient extends Compatible42SigningCosmosClient {
  private wallet: OfflineSigner;
  private unsignedClient: SifUnSignedClient;
  rpcUrl: string;
  constructor(
    apiUrl: string,
    senderAddress: string,
    signer: OfflineSigner,
    wsUrl: string,
    rpcUrl: string,
    gasPrice?: GasPrice,
    gasLimits?: Partial<GasLimits<CosmosFeeTable>>,
    broadcastMode: BroadcastMode = BroadcastMode.Block,
  ) {
    super(apiUrl, senderAddress, signer, gasPrice, gasLimits, broadcastMode);

    this.rpcUrl = rpcUrl;
    this.wallet = signer;
    this.unsignedClient = new SifUnSignedClient(
      apiUrl,
      wsUrl,
      rpcUrl,
      broadcastMode,
    );
  }

  getRpcUrl() {
    return this.rpcUrl;
  }

  async getBankBalances(address: string): Promise<object[]> {
    const { result } = await this.lcdClient.get(`bank/balances/${address}`);
    return result;
  }

  async getAccounts(): Promise<string[]> {
    const accounts = await this.wallet.getAccounts();
    return accounts.map(({ address }) => address);
  }

  async getAccount(address: string): Promise<Account> {
    // NOTE(ajoslin): in 0.42, the response format for /auth/accounts/:address changed.
    // It used to contain a `.result.balance` array, it no longer does.
    // We need to add this field ourselves by fetching `/bank/balances/:address response
    // and adding it to payload.
    const [account, balance] = await Promise.all([
      super.getAccount(address),
      this.getBankBalances(address),
    ]);
    (account as any).balance = balance;
    return account as Account;
  }

  getUnsignedClient() {
    return this.unsignedClient;
  }
}
