import { reactive } from "@vue/reactivity";
import { UsecaseContext } from "../../../usecases";
import { PegTxEventEmitter } from "../../../services/EthbridgeService/PegTxEventEmitter";
import { TransactionStatus, Network } from "../../../entities";
import { Services } from "../../../services";
import { Store } from "../../../store";
import { Transaction } from "web3-core";

// Using PascalCase to signify this is a factory
export function SubscribeToTx({
  services,
  store,
}: {
  services: { bus: Pick<Services["bus"], "dispatch"> };
  store: Pick<Store, "tx" | "wallet">;
}) {
  // Helper to set store tx status
  // Should this live behind a store service API?
  function storeSetTxStatus(tx: TransactionStatus) {
    if (!tx.hash || !store.wallet.get(Network.ETHEREUM).address) return;

    store.tx.eth[store.wallet.get(Network.ETHEREUM).address] =
      store.tx.eth[store.wallet.get(Network.ETHEREUM).address] || reactive({});

    store.tx.eth[store.wallet.get(Network.ETHEREUM).address][tx.hash] = tx;

    // if (tx.state === "accepted") {
    //   services.bus.dispatch({
    //     type: "PegTransactionPendingEvent",
    //     payload: {
    //       hash: tx.hash,
    //     },
    //   });
    // } else if (tx.state === "completed") {
    //   services.bus.dispatch({
    //     type: "PegTransactionCompletedEvent",
    //     payload: {
    //       hash: tx.hash,
    //     },
    //   });
    // } else if (tx.state === "failed") {
    //   services.bus.dispatch({
    //     type: "PegTransactionErrorEvent",
    //     payload: {
    //       txStatus: {
    //         hash: tx.hash || "",
    //         memo: "Transaction Error",
    //         state: "failed",
    //       },
    //       message: "Transaction Error",
    //     },
    //   });
    // }
  }

  /**
   * Track changes to a tx emitter send notifications
   * and update a key in the store
   * @param tx with hash set
   */
  return function subscribeToTx(
    tx: PegTxEventEmitter,
    onUpdated: (tx: TransactionStatus) => void = storeSetTxStatus,
  ) {
    function unsubscribe() {
      tx.removeListeners();
    }

    tx.onTxHash(({ txHash }) => {
      console.log("onTxHash", txHash);
      onUpdated({
        hash: txHash,
        memo: "Transaction Accepted",
        state: "accepted",
        symbol: tx.symbol,
      });
    });

    tx.onComplete(({ txHash }) => {
      onUpdated({
        hash: txHash,
        memo: "Transaction Complete",
        state: "completed",
      });

      // tx is complete so we can unsubscribe
      unsubscribe();
    });

    tx.onError((err) => {
      onUpdated({
        hash: tx.hash || "",
        memo: "Transaction Failed",
        state: "failed",
      });
    });

    // HACK: Trigger all hashHandlers
    // Maybe make this some kind of ready function?
    if (tx.hash) tx.setTxHash(tx.hash);

    return unsubscribe;
  };
}
