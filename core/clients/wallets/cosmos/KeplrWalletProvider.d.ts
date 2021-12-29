import { Chain } from "../../../entities";
import { WalletProviderContext } from "../WalletProvider";
import { OfflineSigner, OfflineDirectSigner, EncodeObject } from "@cosmjs/proto-signing";
import { CosmosWalletProvider } from "./CosmosWalletProvider";
import { NativeDexTransaction, NativeDexSignedTransaction } from "../../../services/utils/SifClient/NativeDexTransaction";
export declare class KeplrWalletProvider extends CosmosWalletProvider {
    context: WalletProviderContext;
    static create(context: WalletProviderContext): KeplrWalletProvider;
    constructor(context: WalletProviderContext);
    onAccountChanged(callback: () => void): (() => void) | undefined;
    isInstalled(chain: Chain): Promise<boolean>;
    hasConnected(chain: Chain): Promise<boolean>;
    isChainSupported(chain: Chain): boolean;
    canDisconnect(chain: Chain): boolean;
    disconnect(chain: Chain): Promise<void>;
    getSendingSigner(chain: Chain): Promise<OfflineSigner & OfflineDirectSigner>;
    tryConnectAll(...chains: Chain[]): Promise<void | undefined>;
    connect(chain: Chain): Promise<string>;
    sign(chain: Chain, tx: NativeDexTransaction<EncodeObject>): Promise<NativeDexSignedTransaction<EncodeObject>>;
    broadcast(chain: Chain, tx: NativeDexSignedTransaction<EncodeObject>): Promise<{
        height: number;
        transactionHash: string;
        code: number;
        rawLog: string;
        logs?: undefined;
        data?: undefined;
    } | {
        logs: readonly import("@cosmjs/stargate/build/logs").Log[];
        rawLog: string;
        transactionHash: string;
        data: Uint8Array | undefined;
        height?: undefined;
        code?: undefined;
    }>;
}
