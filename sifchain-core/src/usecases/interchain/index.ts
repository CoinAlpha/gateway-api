import { UsecaseContext } from "..";
import {
  IAssetAmount,
  Chain,
  Network,
  TransactionStatus,
} from "../../entities";
import {
  EthereumChain,
  SifchainChain,
  CosmoshubChain,
  IrisChain,
  AkashChain,
  SentinelChain,
} from "../../clients/chains";
import InterchainTxManager from "./txManager";
import {
  BridgeTx,
  BridgeParams,
  bridgeTxEmitter,
} from "../../clients/bridges/BaseBridge";

export default function InterchainUsecase(context: UsecaseContext) {
  const getIbcWallet = (fromChain: Chain) => {
    if (fromChain.network === Network.TERRA) {
      return context.services.wallet.terraProvider;
    }
    return context.services.wallet.keplrProvider;
  };
  const ibcBridge = {
    estimateFees(params: BridgeParams) {
      return context.services.ibc.estimateFees(
        getIbcWallet(params.fromChain),
        params,
      );
    },
    async approveTransfer(params: BridgeParams) {},
    async transfer(params: BridgeParams) {
      const result = await context.services.ibc.transfer(
        getIbcWallet(params.fromChain),
        params,
      );
      bridgeTxEmitter.emit("tx_sent", result);
      return result;
    },
    async waitForTransferComplete(
      tx: BridgeTx,
      onUpdate?: (update: Partial<BridgeTx>) => void,
    ) {
      return context.services.ibc.waitForTransferComplete(
        getIbcWallet(tx.fromChain),
        tx,
        onUpdate,
      );
    },
  };

  const ethBridge = {
    estimateFees(params: BridgeParams) {
      return context.services.ethbridge.estimateFees(
        context.services.wallet.metamaskProvider,
        params,
      );
    },
    async approveTransfer(params: BridgeParams) {
      if (params.fromChain.network === Network.ETHEREUM) {
        await context.services.ethbridge.approveTransfer(
          context.services.wallet.metamaskProvider,
          params,
        );
      }
    },
    async transfer(params: BridgeParams) {
      const result = await context.services.ethbridge.transfer(
        params.fromChain.network === Network.SIFCHAIN
          ? context.services.wallet.keplrProvider
          : context.services.wallet.metamaskProvider,
        params,
      );
      bridgeTxEmitter.emit("tx_sent", result);
      return result;
    },
    async waitForTransferComplete(
      tx: BridgeTx,
      onUpdate?: (update: Partial<BridgeTx>) => void,
    ) {
      return context.services.ethbridge.waitForTransferComplete(
        context.services.wallet.metamaskProvider,
        tx,
        onUpdate,
      );
    },
  };

  const interchain = (from: Chain, to: Chain) => {
    if (from instanceof SifchainChain) {
      if (to.chainConfig.chainType === "ibc") {
        return ibcBridge;
      } else if (to.chainConfig.chainType === "eth") {
        return ethBridge;
      }
    } else if (to instanceof SifchainChain) {
      if (from.chainConfig.chainType === "ibc") {
        return ibcBridge;
      } else if (from.chainConfig.chainType === "eth") {
        return ethBridge;
      }
    }
    throw new Error(
      `Token transfer from chain ${from.network} to chain ${to.network} not supported!`,
    );
  };

  const txManager = InterchainTxManager(context, interchain);

  // @mccallofthewild - wait for assets to be loaded & cached before running
  setTimeout(() => {
    txManager.listenForSentTransfers();
  }, 500);

  interchain.txManager = txManager;

  return interchain;
}
