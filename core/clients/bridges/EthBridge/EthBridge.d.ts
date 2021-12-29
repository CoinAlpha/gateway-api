import { BaseBridge, BridgeTx, EthBridgeTx, BridgeParams } from "../BaseBridge";
import { IAsset, IAssetAmount, Network, TransactionStatus } from "../../../entities";
import { provider } from "web3-core";
import Web3 from "web3";
import { PegTxEventEmitter } from "../../../services/EthbridgeService/PegTxEventEmitter";
import { Contract } from "web3-eth-contract";
import { CosmosWalletProvider } from "../../wallets/cosmos/CosmosWalletProvider";
import { Web3WalletProvider } from "../../wallets";
import { TxEventEthConfCountChanged } from "services/EthbridgeService/types";
export declare type EthBridgeContext = {
    sifApiUrl: string;
    sifWsUrl: string;
    sifRpcUrl: string;
    sifChainId: string;
    bridgebankContractAddress: string;
    bridgetokenContractAddress: string;
    getWeb3Provider: () => Promise<provider>;
    assets: IAsset[];
    peggyCompatibleCosmosBaseDenoms: Set<string>;
    cosmosWalletProvider: CosmosWalletProvider;
};
export declare const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const ETH_CONFIRMATIONS = 50;
export declare class EthBridge extends BaseBridge<CosmosWalletProvider | Web3WalletProvider> {
    context: EthBridgeContext;
    constructor(context: EthBridgeContext);
    static create(context: EthBridgeContext): EthBridge;
    assertValidBridgeParams(wallet: CosmosWalletProvider | Web3WalletProvider, params: BridgeParams): void;
    tokenRegistry: {
        load: () => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry[]>;
        findAssetEntry: (asset: IAsset) => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        findAssetEntryOrThrow: (asset: IAsset) => Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>;
        loadCounterpartyEntry(nativeAsset: IAsset): Promise<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry | undefined>;
        loadCounterpartyAsset(nativeAsset: IAsset): Promise<IAsset>;
        loadNativeAsset(counterpartyAsset: IAsset): Promise<IAsset>;
        loadCounterpartyAssetAmount: (nativeAssetAmount: IAssetAmount) => Promise<IAssetAmount>;
        loadNativeAssetAmount: (assetAmount: IAssetAmount) => Promise<IAssetAmount>;
        loadConnectionByNetworks(params: {
            sourceNetwork: Network;
            destinationNetwork: Network;
        }): Promise<{
            channelId: string | undefined;
        }>;
        loadConnection(params: {
            fromChain: import("../../../entities").Chain;
            toChain: import("../../../entities").Chain;
        }): Promise<{
            channelId: string | undefined;
        }>;
    };
    private web3;
    ensureWeb3: () => Promise<Web3>;
    estimateFees(provider: CosmosWalletProvider | Web3WalletProvider, params: BridgeParams): IAssetAmount | undefined;
    approveTransfer(wallet: Web3WalletProvider | CosmosWalletProvider, params: BridgeParams): Promise<void>;
    transfer(wallet: CosmosWalletProvider | Web3WalletProvider, params: BridgeParams): Promise<EthBridgeTx>;
    private exportToEth;
    private importFromEth;
    waitForTransferComplete(provider: Web3WalletProvider, tx: BridgeTx, onUpdateTx?: (update: Partial<BridgeTx>) => void): Promise<boolean>;
    /**
     * Create an event listener to report status of a peg transaction.
     * Usage:
     * const tx = createPegTx(50)
     * tx.setTxHash('0x52ds.....'); // set the hash to lookup and confirm on the blockchain
     * @param confirmations number of confirmations before pegtx is considered confirmed
     */
    createPegTx(confirmations: number, symbol?: string, txHash?: string): PegTxEventEmitter;
    /**
     * Gets a list of transactionHashes found as _from keys within the given events within a given blockRange from the current block
     * @param {*} address eth address to correlate transactions with
     * @param {*} contract web3 contract
     * @param {*} eventList event name list of events (must have an addresskey)
     * @param {*} blockRange number of blocks from the current block header to search
     */
    getEventTxsInBlockrangeFromAddress(address: string, contract: Contract, eventList: string[], blockRange: number): Promise<{
        symbol: string;
        hash: string;
    }[]>;
    addEthereumAddressToPeggyCompatibleCosmosAssets(): Promise<void>;
    lockToSifchain(sifRecipient: string, assetAmount: IAssetAmount, confirmations: number): Promise<{
        readonly hash: string | undefined;
        readonly symbol: string | undefined;
        setTxHash(hash: string): void;
        emit(e: import("../../../services/EthbridgeService/types").TxEventPrepopulated<import("../../../services/EthbridgeService/types").TxEvent>): void;
        onTxEvent(handler: (e: import("../../../services/EthbridgeService/types").TxEvent) => void): any;
        onTxHash(handler: (e: import("../../../services/EthbridgeService/types").TxEventHashReceived) => void): any;
        onEthConfCountChanged(handler: (e: TxEventEthConfCountChanged) => void): any;
        onEthTxConfirmed(handler: (e: import("../../../services/EthbridgeService/types").TxEventEthTxConfirmed) => void): any;
        onSifTxConfirmed(handler: (e: import("../../../services/EthbridgeService/types").TxEventSifTxConfirmed) => void): any;
        onEthTxInitiated(handler: (e: import("../../../services/EthbridgeService/types").TxEventEthTxInitiated) => void): any;
        onSifTxInitiated(handler: (e: import("../../../services/EthbridgeService/types").TxEventSifTxInitiated) => void): any;
        onComplete(handler: (e: import("../../../services/EthbridgeService/types").TxEventComplete) => void): any;
        removeListeners(): any;
        onError(handler: (e: import("../../../services/EthbridgeService/types").TxEventError) => void): any;
    }>;
    /**
     * Get a list of unconfirmed transaction hashes associated with
     * a particular address and return pegTxs associated with that hash
     * @param address contract address
     * @param confirmations number of confirmations required
     */
    fetchUnconfirmedLockBurnTxs(address: string, confirmations: number): Promise<PegTxEventEmitter[]>;
    burnToSifchain(sifRecipient: string, assetAmount: IAssetAmount, confirmations: number, address?: string): Promise<{
        readonly hash: string | undefined;
        readonly symbol: string | undefined;
        setTxHash(hash: string): void;
        emit(e: import("../../../services/EthbridgeService/types").TxEventPrepopulated<import("../../../services/EthbridgeService/types").TxEvent>): void;
        onTxEvent(handler: (e: import("../../../services/EthbridgeService/types").TxEvent) => void): any;
        onTxHash(handler: (e: import("../../../services/EthbridgeService/types").TxEventHashReceived) => void): any;
        onEthConfCountChanged(handler: (e: TxEventEthConfCountChanged) => void): any;
        onEthTxConfirmed(handler: (e: import("../../../services/EthbridgeService/types").TxEventEthTxConfirmed) => void): any;
        onSifTxConfirmed(handler: (e: import("../../../services/EthbridgeService/types").TxEventSifTxConfirmed) => void): any;
        onEthTxInitiated(handler: (e: import("../../../services/EthbridgeService/types").TxEventEthTxInitiated) => void): any;
        onSifTxInitiated(handler: (e: import("../../../services/EthbridgeService/types").TxEventSifTxInitiated) => void): any;
        onComplete(handler: (e: import("../../../services/EthbridgeService/types").TxEventComplete) => void): any;
        removeListeners(): any;
        onError(handler: (e: import("../../../services/EthbridgeService/types").TxEventError) => void): any;
    }>;
    fetchSymbolAddress(symbol: string): Promise<string | undefined>;
    fetchTokenAddress(asset: IAsset, loadWeb3Instance?: () => Promise<Web3> | Web3): Promise<string | undefined>;
    subscribeToTx(tx: PegTxEventEmitter, onUpdated: (tx: TransactionStatus) => void): () => void;
}
