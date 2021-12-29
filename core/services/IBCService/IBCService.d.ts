import { IBCBridge } from "../../clients/bridges/IBCBridge/IBCBridge";
import type { IBCBridgeContext as IBCServiceContext } from "../../clients/bridges/IBCBridge/IBCBridge";
import { Network, IAssetAmount } from "../../entities";
import { BroadcastTxResult } from "@cosmjs/launchpad";
export declare class IBCService extends IBCBridge {
    static create(context: IBCServiceContext): IBCService;
    transferIBCTokens(params: {
        sourceNetwork: Network;
        destinationNetwork: Network;
        assetAmountToTransfer: IAssetAmount;
    }, { shouldBatchTransfers, maxMsgsPerBatch, maxAmountPerMsg, gasPerBatch, }?: {
        shouldBatchTransfers?: boolean | undefined;
        maxMsgsPerBatch?: number | undefined;
        maxAmountPerMsg?: string | undefined;
        gasPerBatch?: undefined;
    }): Promise<BroadcastTxResult[]>;
    logIBCNetworkMetadata(): Promise<void>;
}
export { IBCServiceContext };
export default function createIBCService(context: IBCServiceContext): IBCService;
