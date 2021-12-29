import { UsecaseContext } from "..";
import InterchainUsecase from ".";
export default function BridgeTxManager(context: UsecaseContext, interchain: ReturnType<typeof InterchainUsecase>): {
    listenForSentTransfers: () => () => import("typed-emitter").default<import("../../clients/bridges/BaseBridge").BridgeTxEvents>;
    loadSavedTransferList(userSifAddress: string): void;
};
