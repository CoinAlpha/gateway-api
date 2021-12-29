import { UsecaseContext } from "..";
import { IAssetAmount, Chain } from "../../entities";
import { BridgeTx, BridgeParams } from "../../clients/bridges/BaseBridge";
export default function InterchainUsecase(context: UsecaseContext): {
    (from: Chain, to: Chain): {
        estimateFees(params: BridgeParams): IAssetAmount | undefined;
        approveTransfer(params: BridgeParams): Promise<void>;
        transfer(params: BridgeParams): Promise<import("../../clients/bridges/BaseBridge").IBCBridgeTx>;
        waitForTransferComplete(tx: BridgeTx, onUpdate?: ((update: Partial<BridgeTx>) => void) | undefined): Promise<boolean>;
    } | {
        estimateFees(params: BridgeParams): IAssetAmount | undefined;
        approveTransfer(params: BridgeParams): Promise<void>;
        transfer(params: BridgeParams): Promise<import("../../clients/bridges/BaseBridge").EthBridgeTx>;
        waitForTransferComplete(tx: BridgeTx, onUpdate?: ((update: Partial<BridgeTx>) => void) | undefined): Promise<boolean>;
    };
    txManager: {
        listenForSentTransfers: () => () => import("typed-emitter").default<import("../../clients/bridges/BaseBridge").BridgeTxEvents>;
        loadSavedTransferList(userSifAddress: string): void;
    };
};
