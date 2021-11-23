import { UsecaseContext } from "..";
import { AssetAmount, Network, TransactionStatus } from "../../entities";
import InterchainUsecase from ".";
import { BridgeTx, bridgeTxEmitter } from "../../clients/bridges/BaseBridge";

type SerializedTx = BridgeTx & {
  $fromChainNetwork: Network;
  $toChainNetwork: Network;
  $symbol: string;
  $amount: string;
};

const PersistentTxList = (context: UsecaseContext) => {
  const key = "transfer_txs";

  const serialize = (tx: BridgeTx) => {
    const { assetAmount, fromChain, toChain, ...rest } = tx;
    return {
      $symbol: assetAmount.symbol,
      $amount: assetAmount.amount.toBigInt().toString(),
      $fromChainNetwork: fromChain.network,
      $toChainNetwork: toChain.network,
      ...rest,
    } as SerializedTx;
  };
  const deserialize = (serializedTx: SerializedTx): BridgeTx => {
    const {
      $amount,
      $symbol,
      $fromChainNetwork,
      $toChainNetwork,
      ...rest
    } = serializedTx;
    return {
      ...rest,
      assetAmount: AssetAmount($symbol, $amount),
      fromChain: context.services.chains.get($fromChainNetwork),
      toChain: context.services.chains.get($toChainNetwork),
    };
  };

  const getRawList = (): SerializedTx[] => {
    try {
      const raw = context.services.storage.getItem(key);
      const array = JSON.parse(raw || "[]") || [];
      return array;
    } catch (error) {
      context.services.storage.setItem(key, "[]");
      return [];
    }
  };
  const setRawList = (list: SerializedTx[]) => {
    context.services.storage.setItem(key, JSON.stringify(list));
  };

  const bridgeTxs: BridgeTx[] = getRawList().map((item) => deserialize(item));

  return {
    add: (tx: BridgeTx) => {
      bridgeTxs.push(tx);
      setRawList(bridgeTxs.map((tx) => serialize(tx)));
    },
    remove: (tx: BridgeTx) => {
      bridgeTxs.splice(bridgeTxs.indexOf(tx), 1);
      setRawList(bridgeTxs.map((tx) => serialize(tx)));
    },
    get: () => bridgeTxs,
    save: () => setRawList(bridgeTxs.map((tx) => serialize(tx))),
  };
};

export default function BridgeTxManager(
  context: UsecaseContext,
  interchain: ReturnType<typeof InterchainUsecase>,
) {
  const { services, store } = context;
  const txList = PersistentTxList(context);

  const subscribeToBridgeTx = async (bridgeTx: BridgeTx) => {
    const bridge = interchain(bridgeTx.fromChain, bridgeTx.toChain);

    const isImport = bridgeTx.toChain.network === Network.SIFCHAIN;

    const payload = {
      bridgeTx: bridgeTx,
      transactionStatus: {
        state: "accepted",
        hash: bridgeTx.hash,
      } as TransactionStatus,
    };
    store.tx.pendingTransfers[bridgeTx.hash] = payload;

    services.bus.dispatch({
      type: isImport
        ? "PegTransactionPendingEvent"
        : "UnpegTransactionPendingEvent",
      payload,
    });

    try {
      const didComplete = await bridge.waitForTransferComplete(
        bridgeTx,
        function onUpdateBridgeTx(update: Partial<BridgeTx>) {
          console.log("onUpdateBridgeTx", update);
          Object.assign(bridgeTx, update);
          store.tx.pendingTransfers[bridgeTx.hash] = {
            ...payload,
            bridgeTx: { ...bridgeTx },
          };
          txList.save();
        },
      );
      if (!didComplete) {
        // Silent failure... for one reason or another, we're just done.
      } else {
        // First emit the event so UI can update balances...
        bridgeTxEmitter.emit("tx_complete", bridgeTx);

        // Then wait a sec so the balance request finishes before notif appears...
        setTimeout(() => {
          services.bus.dispatch({
            type: isImport
              ? "PegTransactionCompletedEvent"
              : "UnpegTransactionCompletedEvent",
            payload: {
              bridgeTx: bridgeTx,
              transactionStatus: {
                state: "completed",
                hash: bridgeTx.hash,
              },
            },
          });
        }, 750);
      }
    } catch (error) {
      services.bus.dispatch({
        type: isImport
          ? "PegTransactionErrorEvent"
          : "UnpegTransactionErrorEvent",
        payload: {
          bridgeTx: bridgeTx,
          transactionStatus: {
            state: "failed",
            hash: bridgeTx.hash,
            memo: error.message,
          },
        },
      });
    }
    delete store.tx.pendingTransfers[bridgeTx.hash];
    txList.remove(bridgeTx);
  };

  const onTxSent = (tx: BridgeTx) => {
    txList.add(tx);
    subscribeToBridgeTx(tx);
  };

  return {
    listenForSentTransfers: () => {
      bridgeTxEmitter.on("tx_sent", onTxSent);
      return () => bridgeTxEmitter.off("tx_sent", onTxSent);
    },
    loadSavedTransferList(userSifAddress: string) {
      // Load from storage and subscribe on bootup
      txList.get().forEach((tx) => {
        // When user switches accounts in keplr, only track saved
        // transfers matching current address.
        if (
          tx.fromAddress === userSifAddress ||
          tx.toAddress === userSifAddress
        ) {
          subscribeToBridgeTx(tx);
        }
      });
    },
  };
}
