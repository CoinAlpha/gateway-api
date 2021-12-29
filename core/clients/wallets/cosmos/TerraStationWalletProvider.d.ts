import { CosmosWalletProvider } from "./CosmosWalletProvider";
import { WalletProviderContext } from "../WalletProvider";
import { Chain } from "../../../entities";
import { OfflineSigner, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { NativeDexTransaction, NativeDexSignedTransaction } from "../../../services/utils/SifClient/NativeDexTransaction";
import { EncodeObject } from "@cosmjs/proto-signing";
import { BroadcastTxResult } from "@cosmjs/launchpad";
export declare class TerraStationWalletProvider extends CosmosWalletProvider {
    context: WalletProviderContext;
    isInstalled(chain: Chain): Promise<boolean>;
    private extensionControllerChainIdLookup;
    private getExtensionController;
    connect(chain: Chain): Promise<string>;
    hasConnected(chain: Chain): Promise<boolean>;
    canDisconnect(chain: Chain): boolean;
    disconnect(chain: Chain): Promise<void>;
    sign(chain: Chain, tx: NativeDexTransaction<EncodeObject>): Promise<NativeDexSignedTransaction<EncodeObject>>;
    broadcast(chain: Chain, signedTx: NativeDexSignedTransaction<EncodeObject>): Promise<BroadcastTxResult>;
    static create(context: WalletProviderContext): void;
    constructor(context: WalletProviderContext);
    getSendingSigner(chain: Chain): Promise<OfflineSigner & OfflineDirectSigner>;
}
