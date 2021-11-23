import {
  coins,
  isBroadcastTxFailure,
  makeCosmoshubPath,
  Msg,
  Secp256k1HdWallet,
} from "@cosmjs/launchpad";
import { reactive } from "@vue/reactivity";
import {
  Address,
  Asset,
  AssetAmount,
  IAssetAmount,
  Network,
  TransactionStatus,
  TxParams,
} from "../../entities";
import { Mnemonic } from "../../entities";

import { SifClient, SifUnSignedClient } from "../utils/SifClient";
import { ensureSifAddress } from "./utils";
import getKeplrProvider from "./getKeplrProvider";
import { KeplrChainConfig } from "../../utils/parseConfig";
import { parseTxFailure } from "./parseTxFailure";
import { debounce } from "../../utils/debounce";
import { NativeDexClient } from "../../services/utils/SifClient/NativeDexClient";

export type SifServiceContext = {
  sifAddrPrefix: string;
  sifApiUrl: string;
  sifChainId: string;
  sifWsUrl: string;
  sifRpcUrl: string;
  keplrChainConfig: KeplrChainConfig;
  assets: Asset[];
};
type HandlerFn<T> = (a: T) => void;

/**
 * Constructor for SifService
 *
 * SifService handles communication between our ui core Domain and the SifNode blockchain. This includes non-module related interaction
 */
export default function createSifService({
  sifAddrPrefix,
  sifApiUrl,
  sifWsUrl,
  sifRpcUrl,
  keplrChainConfig,
  assets,
  sifChainId,
}: SifServiceContext) {
  const state: {
    connected: boolean;
    address: Address;
    accounts: Address[];
    balances: IAssetAmount[];
    log: string; // latest transaction hash
  } = reactive({
    connected: false,
    accounts: [],
    address: "",
    balances: [],
    log: "unset",
  });

  const keplrProviderPromise = getKeplrProvider();
  let keplrProvider: any;
  let client: SifClient | null = null;
  let polling: any;
  let connecting: boolean = false;

  const unSignedClient = new SifUnSignedClient(sifApiUrl, sifWsUrl, sifRpcUrl);

  const supportedTokens = assets.filter(
    (asset) => asset.network === Network.SIFCHAIN,
  );

  async function createSifClientFromMnemonic(mnemonic: string) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(
      mnemonic,
      makeCosmoshubPath(0),
      sifAddrPrefix,
    );
    const accounts = await wallet.getAccounts();

    const address = accounts.length > 0 ? accounts[0].address : "";

    if (!address) {
      throw new Error("No address on sif account");
    }

    return new SifClient(sifApiUrl, address, wallet, sifWsUrl, sifRpcUrl);
  }

  const triggerUpdate = debounce(async () => {
    // try {
    //   if (!polling) {
    //     while (true) {
    //       triggerUpdate();
    //       await new Promise((r) => setTimeout(r, 15000));
    //     }
    //   }
    //   await instance.setClient();
    //   if (!client) {
    //     state.connected = false;
    //     state.address = "";
    //     state.balances = [];
    //     state.accounts = [];
    //     state.log = "";
    //     return;
    //   }
    //   state.connected = !!client;
    //   state.address = client.senderAddress;
    //   state.accounts = await client.getAccounts();
    //   // Don't fetch balances here... thats the job of the new wallet store.
    //   state.balances = []; // await instance.getBalance(client.senderAddress);
    // } catch (e) {
    //   console.error("Sifchain Wallet Connect Error", e);
    //   if (!e.toString().toLowerCase().includes("no address found on chain")) {
    //     state.connected = false;
    //     state.address = "";
    //     state.balances = [];
    //     state.accounts = [];
    //     state.log = "";
    //     if (polling) {
    //       clearInterval(polling);
    //       polling = null;
    //     }
    //   }
    // }
  }, 100);
  const nativeDexClientPromise = NativeDexClient.connect(
    sifRpcUrl,
    sifApiUrl,
    sifChainId,
  );
  const instance = {
    async loadNativeDexClient() {
      return nativeDexClientPromise;
    },
    getClient() {
      return client;
    },
    /**
     * getState returns the service's reactive state to be listened to by consuming clients.
     */
    getState() {
      return state;
    },

    getSupportedTokens() {
      return supportedTokens;
    },

    async setClient() {
      if (!keplrProvider) {
        keplrProvider = await keplrProviderPromise;
      }
      if (connecting || client) {
        return;
      }
      connecting = true;
      /* 
        Only load dev env keplr configs.
        Will need to change chain id in devnet, testnet so keplr asks to add experimental chain. 
        Otherwise, if sifchain, auto maps to production chain per keplr code.
      */
      if (!state.connected && keplrChainConfig.chainId !== "sifchain") {
        await this.connect();
      }
      const offlineSigner = keplrProvider.getOfflineSigner(
        keplrChainConfig.chainId,
      );
      const accounts = await offlineSigner.getAccounts();
      // console.log("account", accounts);
      const address = accounts?.[0]?.address || "";
      if (!address) {
        throw "No address on sif account";
      }
      client = new SifClient(
        sifApiUrl,
        address,
        offlineSigner,
        sifWsUrl,
        sifRpcUrl,
      );
      connecting = false;
    },

    async initProvider() {
      try {
        keplrProvider = await keplrProviderPromise;
        if (!keplrProvider) {
          return;
        }
        triggerUpdate();
      } catch (e) {
        console.log("initProvider", e);
      }
    },

    async connect() {
      if (!keplrProvider) {
        keplrProvider = await keplrProviderPromise;
      }
      // open extension
      if (keplrProvider.experimentalSuggestChain) {
        try {
          await keplrProvider.experimentalSuggestChain(keplrChainConfig);
          await keplrProvider.enable(keplrChainConfig.chainId);
          // console.log("enabling keplr", keplrChainConfig);
          await instance.setClient();
        } catch (error) {
          console.log(error);
          throw { message: "Failed to Suggest Chain" };
        }
      } else {
        throw {
          message: "Keplr Outdated",
          detail: { type: "info", message: "Need at least 0.6.4" },
        };
      }
    },

    isConnected() {
      return state.connected;
    },

    unSignedClient,

    onSocketError(handler: HandlerFn<any>) {
      return unSignedClient.onSocketError(handler);
    },

    onTx(handler: HandlerFn<any>) {
      return unSignedClient.onTx(handler);
    },

    onNewBlock(handler: HandlerFn<any>) {
      return unSignedClient.onNewBlock(handler);
    },

    // Required solely for testing purposes
    async setPhrase(mnemonic: Mnemonic): Promise<Address> {
      try {
        if (!mnemonic) {
          throw "No mnemonic. Can't generate wallet.";
        }
        client = await createSifClientFromMnemonic(mnemonic);
        return client.senderAddress;
      } catch (error) {
        throw error;
      }
    },

    async purgeClient() {
      // We currently delegate auth to Keplr so this is irrelevant
    },

    async getBalance(
      address?: Address,
      asset?: Asset,
    ): Promise<IAssetAmount[]> {
      if (!client) {
        throw "No client. Please sign in.";
      }
      if (!address) {
        throw "Address undefined. Fail";
      }

      ensureSifAddress(address);
      return state.balances;
      // return IBCService({
      //   assets: assets,
      //   chainConfigsByNetwork,
      // })
      //   .createWalletByNetwork(Network.SIFCHAIN)
      //   .then((w) => {
      //     state.connected = true;
      //     state.accounts = w.addresses;
      //     state.balances = w?.balances;
      //     return w.balances;
      //     // console.table(w.balances);
      //   });
      // try {
      //   const account = await client.getAccount(address);
      //   if (!account) {
      //     throw "No Address found on chain";
      //   } // todo handle this better
      //   const supportedTokenSymbols = supportedTokens.map((s) => s.symbol);
      //   return account.balance
      //     .filter((balance) => supportedTokenSymbols.includes(balance.denom))
      //     .map(({ amount, denom }) => {
      //       const asset = supportedTokens.find(
      //         (token) => token.symbol === denom || token.ibcDenom == denom,
      //       )!; // will be found because of filter above
      //       return AssetAmount(asset, amount);
      //     })
      //     .filter((balance) => {
      //       // If an aseet is supplied filter for it
      //       if (!asset) {
      //         return true;
      //       }
      //       return balance.asset.symbol === asset.symbol;
      //     });
      // } catch (error) {
      //   throw error;
      // }
    },

    async transfer(params: TxParams): Promise<any> {
      if (!client) {
        throw "No client. Please sign in.";
      }
      if (!params.asset) {
        throw "No asset.";
      }
      try {
        const msg = {
          type: "cosmos-sdk/MsgSend",
          value: {
            amount: [
              {
                amount: params.amount.toString(),
                denom: params.asset.symbol,
              },
            ],
            from_address: client.senderAddress,
            to_address: params.recipient,
          },
        };

        const fee = {
          amount: coins(250000, params.asset.symbol),
          gas: "500000", // TODO - see if "auto" setting
        };

        return await client.signAndBroadcast([msg], fee, params.memo);
      } catch (err) {
        console.error(err);
      }
    },

    async signAndBroadcast(
      msg: Msg | Msg[],
      memo?: string,
    ): Promise<TransactionStatus> {
      if (!client) {
        throw "No client. Please sign in.";
      }
      try {
        const fee = {
          // Keplr overwrites this in app but for unit/integration tests where we
          // dont connect to keplr we need to specify an amount of rowan to pay for the fee.
          amount: coins(250000, "rowan"),
          gas: "500000", // TODO - see if "auto" setting
        };

        const msgArr = Array.isArray(msg) ? msg : [msg];
        const result = await client.signAndBroadcast(msgArr, fee, memo);

        if (isBroadcastTxFailure(result)) {
          /* istanbul ignore next */ // TODO: fix coverage
          return parseTxFailure(result);
        }

        return {
          hash: result.transactionHash,
          memo,
          state: "accepted",
        };
      } catch (_err) {
        const err = _err as any;
        console.log("signAndBroadcast ERROR", err);
        return parseTxFailure({ transactionHash: "", rawLog: err.message });
      }
    },
  };

  instance.initProvider();

  return instance;
}
