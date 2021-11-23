import {
  DirectSecp256k1HdWallet,
  EncodeObject,
  makeSignDoc,
} from "@cosmjs/proto-signing";

import { Chain } from "../../../entities";
import { WalletProviderContext } from "../WalletProvider";
import { TokenRegistryService } from "../../../services/TokenRegistryService/TokenRegistryService";
import { stringToPath } from "@cosmjs/crypto";
import { CosmosWalletProvider } from "./CosmosWalletProvider";
import {
  NativeDexTransaction,
  NativeDexSignedTransaction,
} from "../../../services/utils/SifClient/NativeDexTransaction";
import { SigningStargateClient } from "@cosmjs/stargate";
import {
  TxRaw,
  TxBody,
  SignDoc,
} from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";
import { BroadcastTxResult } from "@cosmjs/launchpad";

export type DirectSecp256k1HdWalletProviderOptions = {
  mnemonic: string;
};

export class DirectSecp256k1HdWalletProvider extends CosmosWalletProvider {
  static create(
    context: WalletProviderContext,
    options: DirectSecp256k1HdWalletProviderOptions,
  ) {
    return new DirectSecp256k1HdWalletProvider(context, options);
  }

  async isInstalled(chain: Chain) {
    return true;
  }

  constructor(
    public context: WalletProviderContext,
    private options: DirectSecp256k1HdWalletProviderOptions,
  ) {
    super(context);
    this.tokenRegistry = TokenRegistryService(context);
  }

  async hasConnected(chain: Chain) {
    return false;
  }

  isChainSupported(chain: Chain) {
    return chain.chainConfig.chainType === "ibc";
  }

  canDisconnect(chain: Chain) {
    return false;
  }
  async disconnect(chain: Chain) {
    throw new Error("Cannot disconnect");
  }
  // inconsequential change for git commit
  async getSendingSigner(chain: Chain) {
    const chainConfig = this.getIBCChainConfig(chain);

    // cosmos = m/44'/118'/0'/0
    const parts = [
      `m`,
      `44'`, // bip44,
      `${chainConfig.keplrChainInfo.bip44.coinType}'`, // coinType
      `0'`,
      `0`,
    ];
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      this.options.mnemonic || "",
      // @ts-ignore
      stringToPath(parts.join("/")),
      chainConfig.keplrChainInfo.bech32Config.bech32PrefixAccAddr,
    );
    return wallet;
  }

  async connect(chain: Chain) {
    const wallet = await this.getSendingSigner(chain);

    const [account] = await wallet.getAccounts();
    if (!account?.address) {
      throw new Error("No address to connect to");
    }
    return account.address;
  }

  async sign(chain: Chain, tx: NativeDexTransaction<EncodeObject>) {
    const chainConfig = this.getIBCChainConfig(chain);
    const signer = await this.getSendingSigner(chain);

    const stargate = await SigningStargateClient.connectWithSigner(
      chainConfig.rpcUrl,
      signer,
    );

    const signed = await stargate.sign(
      tx.fromAddress,
      tx.msgs,
      {
        amount: [tx.fee.price],
        gas: tx.fee.gas,
      },
      tx.memo,
    );
    return new NativeDexSignedTransaction(tx, signed);
  }

  async broadcast(chain: Chain, tx: NativeDexSignedTransaction<EncodeObject>) {
    const signed = tx.signed as TxRaw;
    if (signed.bodyBytes == null)
      throw new Error("Invalid signedTx, possibly it was not proto signed.");

    const chainConfig = this.getIBCChainConfig(chain);
    const signer = await this.getSendingSigner(chain);

    const stargate = await SigningStargateClient.connectWithSigner(
      chainConfig.rpcUrl,
      signer,
    );
    const result = await stargate.broadcastTx(
      Uint8Array.from(TxRaw.encode(signed).finish()),
    );
    return result as BroadcastTxResult;
  }
}
