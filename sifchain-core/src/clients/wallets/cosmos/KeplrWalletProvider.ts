import {
  Coin,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupIbcExtension,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import { Uint53 } from "@cosmjs/math";
import pLimit from "p-limit";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { Chain } from "../../../entities";
import { WalletProviderContext } from "../WalletProvider";
import { toHex } from "@cosmjs/encoding";
import {
  OfflineSigner,
  OfflineDirectSigner,
  EncodeObject,
} from "@cosmjs/proto-signing";
import { CosmosWalletProvider } from "./CosmosWalletProvider";
import {
  makeSignDoc,
  makeStdTx,
  BroadcastMode,
  isBroadcastTxSuccess,
  isBroadcastTxFailure,
  StdTx,
} from "@cosmjs/launchpad";
import {
  NativeDexTransaction,
  NativeDexSignedTransaction,
} from "../../../services/utils/SifClient/NativeDexTransaction";
import { NativeAminoTypes } from "../../../services/utils/SifClient/NativeAminoTypes";
import { BroadcastTxResult } from "@cosmjs/launchpad";
import { parseLogs } from "@cosmjs/stargate/build/logs";
import { TxRaw } from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";
import getKeplrProvider from "../../../services/SifService/getKeplrProvider";

export class KeplrWalletProvider extends CosmosWalletProvider {
  static create(context: WalletProviderContext) {
    return new KeplrWalletProvider(context);
  }
  constructor(public context: WalletProviderContext) {
    super(context);
  }

  onAccountChanged(callback: () => void) {
    try {
      window.addEventListener("keplr_keystorechange", callback);
      return () => window.removeEventListener("keplr_keystorechange", callback);
    } catch (e) {}
  }

  async isInstalled(chain: Chain) {
    return (window as any).keplr != null;
  }

  async hasConnected(chain: Chain) {
    const chainConfig = this.getIBCChainConfig(chain);
    const keplr = await getKeplrProvider();
    try {
      await keplr?.getKey(chainConfig.keplrChainInfo.chainId);
      return true;
    } catch (error) {
      return false;
    }
  }

  isChainSupported(chain: Chain) {
    return chain.chainConfig.chainType === "ibc";
  }

  canDisconnect(chain: Chain) {
    return false;
  }
  async disconnect(chain: Chain) {
    throw new Error("Keplr wallets cannot disconnect");
  }

  async getSendingSigner(
    chain: Chain,
  ): Promise<OfflineSigner & OfflineDirectSigner> {
    const chainConfig = this.getIBCChainConfig(chain);
    const keplr = await getKeplrProvider();
    await keplr?.experimentalSuggestChain(chainConfig.keplrChainInfo);
    await keplr?.enable(chainConfig.chainId);
    const sendingSigner = keplr?.getOfflineSigner(chainConfig.chainId);

    if (!sendingSigner)
      throw new Error(`Failed to get sendingSigner for ${chainConfig.chainId}`);

    return sendingSigner;
  }

  async tryConnectAll(...chains: Chain[]) {
    const keplr = await getKeplrProvider();
    const chainIds = chains
      .filter((c) => c.chainConfig.chainType === "ibc")
      .map((c) => c.chainConfig.chainId);

    // @ts-ignore
    return keplr?.enable(chainIds);
  }
  async connect(chain: Chain) {
    // try to get the address quietly
    const keplr = await getKeplrProvider();
    const chainConfig = this.getIBCChainConfig(chain);
    await keplr?.experimentalSuggestChain(chainConfig.keplrChainInfo);
    const key = await keplr?.getKey(chain.chainConfig.chainId);
    let address = key?.bech32Address;
    // if quiet get fails, try to enable the wallet
    if (!address) {
      const sendingSigner = await this.getSendingSigner(chain);
      address = (await sendingSigner.getAccounts())[0]?.address;
    }
    // if enabling & quiet get fails, throw.
    // if quiet get fails, try to enable the wallet
    if (!address) {
      const sendingSigner = await this.getSendingSigner(chain);
      address = (await sendingSigner.getAccounts())[0]?.address;
    }

    if (!address) {
      throw new Error(
        `No address to connect to for chain ${chain.displayName}`,
      );
    }

    return address;
  }

  async sign(chain: Chain, tx: NativeDexTransaction<EncodeObject>) {
    const chainConfig = this.getIBCChainConfig(chain);
    const stargate = await StargateClient.connect(chainConfig.rpcUrl);

    const converter = new NativeAminoTypes();

    const msgs = tx.msgs.map(converter.toAmino.bind(converter));

    const fee = {
      amount: [tx.fee.price],
      gas: tx.fee.gas,
    };
    const account = await stargate.getAccount(tx.fromAddress || "");
    if (
      typeof account?.accountNumber !== "number" &&
      typeof account?.sequence === "number"
    ) {
      throw new Error(
        `This account (${tx.fromAddress}) does not yet exist on-chain. Please send some funds to it before proceeding.`,
      );
    }
    const keplr = await getKeplrProvider();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const signDoc = makeSignDoc(
      msgs,
      fee,
      chainConfig.chainId,
      tx.memo || "",
      account?.accountNumber.toString() || "",
      account?.sequence.toString() || "",
    );
    const key = await keplr?.getKey(chainConfig.chainId);
    let bech32Address = key?.bech32Address;
    const defaultKeplrOpts = keplr!.defaultOptions;
    keplr!.defaultOptions = {
      sign: {
        preferNoSetFee: false,
        preferNoSetMemo: true,
      },
    };
    const signResponse = await keplr!.signAmino(
      chainConfig.chainId,
      bech32Address || "",
      signDoc,
    );
    keplr!.defaultOptions = defaultKeplrOpts;
    const signedTx = makeStdTx(signResponse.signed, signResponse.signature);
    return new NativeDexSignedTransaction(tx, signedTx);
  }

  async broadcast(chain: Chain, tx: NativeDexSignedTransaction<EncodeObject>) {
    const signed = tx.signed as StdTx;
    if (!signed.msg)
      throw new Error("Invalid signedTx, possibly it was not amino signed.");

    const chainConfig = this.getIBCChainConfig(chain);
    const stargate = await StargateClient.connect(chainConfig.rpcUrl);
    const keplr = await getKeplrProvider();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const txHashUInt8Array = await keplr!.sendTx(
      chainConfig.chainId,
      signed,
      BroadcastMode.Block,
    );
    const txHashHex = toHex(txHashUInt8Array).toUpperCase();
    const resultRaw = await stargate.getTx(txHashHex);
    if (!resultRaw || !resultRaw.hash?.match(/^([0-9A-F][0-9A-F])+$/)) {
      console.error("INVALID TXHASH IN RESULT", resultRaw);
      throw new Error(
        "Received ill-formatted txhash. Must be non-empty upper-case hex",
      );
    }
    const result: BroadcastTxResult = {
      ...resultRaw,
      logs: JSON.parse(resultRaw.rawLog),
      height: resultRaw.height,
      transactionHash: resultRaw.hash,
    };
    if (isBroadcastTxSuccess(result)) {
      result.logs.forEach((log) => {
        // @ts-ignore
        log.msg_index = 0;
        // @ts-ignore
        log.log = "";
      });
    }

    return isBroadcastTxFailure(result)
      ? {
          height: Uint53.fromString(result.height + "").toNumber(),
          transactionHash: result.transactionHash,
          code: result.code,
          rawLog: result.rawLog || "",
        }
      : {
          logs: result.logs ? parseLogs(result.logs) : [],
          rawLog: result.rawLog || "",
          transactionHash: result.transactionHash,
          data: result.data,
        };
  }
}
