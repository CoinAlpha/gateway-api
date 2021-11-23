import { CosmosWalletProvider } from "./CosmosWalletProvider";
import { WalletProviderContext } from "../WalletProvider";

import {
  ChromeExtensionController,
  ChromeExtensionStatus,
} from "@terra-money/wallet-provider/modules/chrome-extension";

import {
  LCDClient,
  Coins,
  Msg,
  BankMsg,
  CreateTxOptions,
  Extension,
} from "@terra-money/terra.js";
import { MsgTransfer } from "@terra-money/terra.js/dist/core/ibc-transfer/msgs/MsgTransfer";
import { Coin } from "@terra-money/terra.js/dist/core/Coin";

import * as TWP from "@terra-money/wallet-provider";
import { Chain, IAssetAmount, AssetAmount } from "../../../entities";
import { OfflineSigner, OfflineDirectSigner } from "@cosmjs/proto-signing";
import {
  NativeDexTransaction,
  NativeDexSignedTransaction,
} from "../../../services/utils/SifClient/NativeDexTransaction";
import { EncodeObject } from "@cosmjs/proto-signing";
import { SubscribeToTx } from "clients/bridges/EthBridge/subscribeToTx";
import {
  BroadcastTxResult,
  BroadcastTxSuccess,
  BroadcastTxFailure,
} from "@cosmjs/launchpad";
import {
  SigningStargateClient,
  StargateClient,
  IndexedTx,
} from "@cosmjs/stargate";
import { KeplrWalletProvider } from "./KeplrWalletProvider";
import { NativeAminoTypes } from "../../../services/utils/SifClient/NativeAminoTypes";
import { parseRawLog } from "@cosmjs/stargate/build/logs";

// @ts-ignore
window.TWP = TWP;

export class TerraStationWalletProvider extends CosmosWalletProvider {
  async isInstalled(chain: Chain) {
    return !!(window as any).isTerraExtensionAvailable;
  }

  private extensionControllerChainIdLookup: Record<
    string,
    ChromeExtensionController
  > = {};
  private getExtensionController(chain: Chain) {
    const config = this.getIBCChainConfig(chain);
    if (!this.extensionControllerChainIdLookup[config.chainId]) {
      const name = config.chainId.includes("bombay") ? "testnet" : "mainnet";

      const networkInfo = {
        name,
        chainID: config.chainId,
        lcd: config.restUrl,
      };
      this.extensionControllerChainIdLookup[
        config.chainId
      ] = new ChromeExtensionController({
        defaultNetwork: networkInfo,
        enableWalletConnection: true,
        dangerously__chromeExtensionCompatibleBrowserCheck: () => false,
      });
    }
    return this.extensionControllerChainIdLookup[config.chainId];
  }

  async connect(chain: Chain) {
    let address: string | boolean;
    try {
      address = await this.getExtensionController(chain).connect();
    } catch (error) {
      console.error(error);
      address = false;
    }

    if (!address) {
      throw new Error("Chrome extension not installed");
    }
    return address;
  }
  async hasConnected(chain: Chain): Promise<boolean> {
    const controller = this.getExtensionController(chain);

    await controller.checkStatus();
    return typeof controller._terraAddress.value === "string";
  }
  canDisconnect(chain: Chain): boolean {
    return false;
  }
  disconnect(chain: Chain): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // The only thing that works for us is the Terra wallet's `post` method, which both
  // signs and sends. We just do a "noop" sign here then do the actual post in the broadcast method.
  async sign(
    chain: Chain,
    tx: NativeDexTransaction<EncodeObject>,
  ): Promise<NativeDexSignedTransaction<EncodeObject>> {
    if (!tx.msgs[0]?.typeUrl.includes("MsgTransfer")) {
      throw new Error(
        "Sifchain Terra Station wallet integration currently supports ONLY IBC Transfers!",
      );
    }
    return new NativeDexSignedTransaction<EncodeObject>(tx);
  }

  async broadcast(
    chain: Chain,
    signedTx: NativeDexSignedTransaction<EncodeObject>,
  ): Promise<BroadcastTxResult> {
    const tx = signedTx.raw;

    const chainConfig = this.getIBCChainConfig(chain);
    const stargate = await StargateClient.connect(chainConfig.rpcUrl);

    const controller = this.getExtensionController(chain);
    const converter = new NativeAminoTypes();
    const msgs = tx.msgs.map(converter.toAmino.bind(converter));

    // The Terra dist has a MsgTransfer type in it, but it isn't fully supported by the wallet controller yet.
    // We have to do a little monkey-patching to make the Terra wallet take it.

    // Terra Coin type doesn't have a fromAmino, which is used by MsgTransfer.fromAmino...
    // @ts-ignore
    Coin.fromAmino = Coin.fromData;

    // @ts-ignore
    const transfer = MsgTransfer.fromAmino(msgs[0]).toData();

    // Returned transfer doesn't have a toJSON object, which is required for Terra Station...
    const envelope = {
      ...transfer,
      toJSON: () => JSON.stringify(transfer),
    };

    const txDraft = {
      msgs: [envelope],
      memo: tx.memo || "",
      // Fee is auto-calculated by Terra Station
    };

    // @ts-ignore
    const chromeRes = (await controller.post(txDraft, {
      terraAddress: tx.fromAddress,
    })) as {
      payload: TWP.TxResult;
    };

    const res = chromeRes.payload;

    // The ibc tx from terra station doesn't give us any rawLog data, so
    // we fetch the inflight TX to get it.
    let txResponseData: IndexedTx | null = null;
    if (res.success) {
      let retries = 25;
      while (!txResponseData && retries-- > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txResponseData = await stargate.getTx(res.result.txhash);
      }
    }

    if (!txResponseData) {
      res.success = false;
    }

    if (res.success) {
      // @ts-ignore
      return {
        transactionHash: res.result.txhash,
        rawLog: txResponseData?.rawLog || res.result.raw_log,
        logs: parseRawLog(txResponseData?.rawLog || res.result.raw_log),
      } as BroadcastTxSuccess;
    } else {
      return {
        transactionHash: res.result.txhash,
        height: res.result.height,
        rawLog: txResponseData?.rawLog || res.result.raw_log,
        logs: parseRawLog(txResponseData?.rawLog || res.result.raw_log),
        code: -1,
      } as BroadcastTxFailure;
    }
  }

  static create(context: WalletProviderContext) {}
  constructor(public context: WalletProviderContext) {
    super(context);
  }

  async getSendingSigner(
    chain: Chain,
  ): Promise<OfflineSigner & OfflineDirectSigner> {
    return KeplrWalletProvider.prototype.getSendingSigner.call(this, chain);
  }
}
