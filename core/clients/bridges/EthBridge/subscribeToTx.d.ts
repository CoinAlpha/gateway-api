import { PegTxEventEmitter } from "../../../services/EthbridgeService/PegTxEventEmitter";
import { TransactionStatus } from "../../../entities";
import { Services } from "../../../services";
import { Store } from "../../../store";
export declare function SubscribeToTx({ services, store, }: {
    services: {
        bus: Pick<Services["bus"], "dispatch">;
    };
    store: Pick<Store, "tx" | "wallet">;
}): (tx: PegTxEventEmitter, onUpdated?: (tx: TransactionStatus) => void) => () => void;
