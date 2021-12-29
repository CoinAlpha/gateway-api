"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthBridge = exports.ETH_CONFIRMATIONS = exports.ETH_ADDRESS = void 0;
const BaseBridge_1 = require("../BaseBridge");
const entities_1 = require("../../../entities");
const web3_1 = __importDefault(require("web3"));
const PegTxEventEmitter_1 = require("../../../services/EthbridgeService/PegTxEventEmitter");
const confirmTx_1 = require("../../../services/EthbridgeService/utils/confirmTx");
const erc20TokenAbi_1 = require("../../wallets/ethereum/erc20TokenAbi");
const bridgebankContract_1 = require("../../../services/EthbridgeService/bridgebankContract");
const isOriginallySifchainNativeToken_1 = require("./isOriginallySifchainNativeToken");
const NativeDexClient_1 = require("../../../services/utils/SifClient/NativeDexClient");
const CosmosWalletProvider_1 = require("../../wallets/cosmos/CosmosWalletProvider");
const long_1 = __importDefault(require("long"));
const parseTxFailure_1 = require("../../../services/SifService/parseTxFailure");
const launchpad_1 = require("@cosmjs/launchpad");
const TokenRegistryService_1 = __importDefault(require("../../../services/TokenRegistryService"));
const wallets_1 = require("../../wallets");
const NativeDexTransaction_1 = require("../../../services/utils/SifClient/NativeDexTransaction");
exports.ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
exports.ETH_CONFIRMATIONS = 50;
class EthBridge extends BaseBridge_1.BaseBridge {
    constructor(context) {
        super();
        this.context = context;
        this.tokenRegistry = TokenRegistryService_1.default(this.context);
        // Pull this out to a util?
        // How to handle context/dependency injection?
        this.web3 = null;
        this.ensureWeb3 = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                this.web3 = new web3_1.default(yield this.context.getWeb3Provider());
            }
            return this.web3;
        });
    }
    static create(context) {
        return new EthBridge(context);
    }
    assertValidBridgeParams(wallet, params) {
        if (params.toChain.network === entities_1.Network.SIFCHAIN &&
            params.fromChain.network === entities_1.Network.ETHEREUM) {
            if (!(wallet instanceof wallets_1.Web3WalletProvider)) {
                throw new Error("EthBridge must be called with a Web3WalletProvider when transfering from Ethereum to Sifchain");
            }
        }
        else if (params.toChain.network === entities_1.Network.ETHEREUM &&
            params.fromChain.network === entities_1.Network.SIFCHAIN) {
            if (!(wallet instanceof CosmosWalletProvider_1.CosmosWalletProvider)) {
                throw new Error("EthBridge must be called with a CosmosWalletProvider when transfering from Sifchain to Ethereum");
            }
        }
        else {
            throw new Error("EthBridge can only broker transfers between Sifchain and Ethereum");
        }
    }
    estimateFees(provider, params) {
        if (params.toChain.network === entities_1.Network.ETHEREUM) {
            const ceth = entities_1.getChainsService()
                .get(entities_1.Network.SIFCHAIN)
                .lookupAssetOrThrow("ceth");
            const feeNumber = isOriginallySifchainNativeToken_1.isOriginallySifchainNativeToken(params.assetAmount)
                ? "35370000000000000"
                : "35370000000000000";
            return entities_1.AssetAmount(ceth, feeNumber);
        }
    }
    approveTransfer(wallet, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertValidBridgeParams(wallet, params);
            if (wallet instanceof wallets_1.Web3WalletProvider) {
                return wallet.approve(params.fromChain, new NativeDexTransaction_1.NativeDexTransaction(params.fromAddress, [
                    new wallets_1.Web3Transaction(this.context.bridgebankContractAddress),
                ]), params.assetAmount);
            }
        });
    }
    transfer(wallet, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertValidBridgeParams(wallet, params);
            const web3 = new web3_1.default(yield this.context.getWeb3Provider());
            if (wallet instanceof CosmosWalletProvider_1.CosmosWalletProvider) {
                const tx = yield this.exportToEth(wallet, params);
                if (launchpad_1.isBroadcastTxFailure(tx)) {
                    throw new Error(parseTxFailure_1.parseTxFailure(tx).memo);
                }
                const startingHeight = yield web3.eth.getBlockNumber();
                return Object.assign(Object.assign({ type: "eth", startingHeight, confirmCount: 0, completionConfirmCount: 0 }, params), { hash: tx.transactionHash, fromChain: params.fromChain, toChain: params.toChain });
            }
            else {
                const pegTx = yield this.importFromEth(wallet, params);
                const startingHeight = yield web3.eth.getBlockNumber();
                try {
                    const hash = yield new Promise((resolve, reject) => {
                        pegTx.onError((error) => reject(error.payload));
                        pegTx.onTxHash((hash) => resolve(hash.txHash));
                    });
                    return Object.assign(Object.assign({ type: "eth", startingHeight, confirmCount: 0, completionConfirmCount: exports.ETH_CONFIRMATIONS }, params), { fromChain: params.fromChain, toChain: params.toChain, hash: hash });
                }
                catch (transactionStatus) {
                    throw new Error(parseTxFailure_1.parseEthereumTxFailure(transactionStatus).memo);
                }
            }
        });
    }
    exportToEth(provider, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const feeAmount = yield this.estimateFees(provider, params);
            const nativeChain = params.fromChain;
            const client = yield NativeDexClient_1.NativeDexClient.connectByChain(nativeChain);
            const sifAsset = nativeChain.findAssetWithLikeSymbolOrThrow(params.assetAmount.asset.symbol);
            const entry = yield this.tokenRegistry.findAssetEntryOrThrow(sifAsset);
            const tx = isOriginallySifchainNativeToken_1.isOriginallySifchainNativeToken(params.assetAmount.asset)
                ? client.tx.ethbridge.Lock({
                    ethereumReceiver: params.toAddress,
                    amount: params.assetAmount.toBigInt().toString(),
                    symbol: entry.denom,
                    cosmosSender: params.fromAddress,
                    ethereumChainId: long_1.default.fromString(`${parseInt(params.toChain.chainConfig.chainId)}`),
                    // ethereumReceiver: tokenAddress,
                    cethAmount: feeAmount.toBigInt().toString(),
                }, params.fromAddress)
                : client.tx.ethbridge.Burn({
                    ethereumReceiver: params.toAddress,
                    amount: params.assetAmount.toBigInt().toString(),
                    symbol: entry.denom,
                    cosmosSender: params.fromAddress,
                    ethereumChainId: long_1.default.fromString(`${parseInt(params.toChain.chainConfig.chainId)}`),
                    // ethereumReceiver: tokenAddress,
                    cethAmount: feeAmount.toBigInt().toString(),
                }, params.fromAddress);
            const signed = yield provider.sign(nativeChain, tx);
            const sent = yield provider.broadcast(nativeChain, signed);
            return sent;
        });
    }
    importFromEth(provider, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainConfig = params.fromChain.chainConfig;
            const web3 = yield this.ensureWeb3();
            const web3ChainId = yield web3.eth.getChainId();
            if (+chainConfig.chainId !== web3ChainId) {
                throw new Error(`Invalid EVM chain id! Got ${web3ChainId}, expected ${+chainConfig.chainId}.`);
            }
            let lockOrBurnFn;
            if (isOriginallySifchainNativeToken_1.isOriginallySifchainNativeToken(params.assetAmount.asset)) {
                lockOrBurnFn = this.burnToSifchain;
            }
            else {
                lockOrBurnFn = this.lockToSifchain;
            }
            const pegTx = yield lockOrBurnFn.call(this, params.toAddress, params.assetAmount, exports.ETH_CONFIRMATIONS);
            this.subscribeToTx(pegTx, console.log.bind(console, "subscribtion"));
            return pegTx;
        });
    }
    waitForTransferComplete(provider, tx, onUpdateTx) {
        return __awaiter(this, void 0, void 0, function* () {
            const ethTx = tx;
            const web3 = yield provider.getWeb3();
            if (ethTx.toChain.network === entities_1.Network.SIFCHAIN) {
                let done = false;
                return new Promise((resolve, reject) => {
                    const pegTx = this.createPegTx(exports.ETH_CONFIRMATIONS, ethTx.assetAmount.asset.ibcDenom || ethTx.assetAmount.asset.symbol, ethTx.hash);
                    this.subscribeToTx(pegTx, (ethTx) => {
                        if (ethTx.state === "completed") {
                            resolve(true);
                        }
                        else if (ethTx.state === "failed") {
                            reject(new Error("Transaction failed"));
                        }
                    });
                    (() => __awaiter(this, void 0, void 0, function* () {
                        let confirmCount = ethTx.confirmCount;
                        const blockHeight = yield web3.eth.getBlockNumber();
                        while (!done) {
                            const newCount = yield confirmTx_1.getConfirmations(web3, ethTx.hash);
                            if (newCount && newCount !== confirmCount) {
                                onUpdateTx === null || onUpdateTx === void 0 ? void 0 : onUpdateTx({ confirmCount: newCount });
                                confirmCount = newCount;
                            }
                            yield new Promise((resolve) => setTimeout(resolve, 5000));
                            if (blockHeight > ethTx.startingHeight + exports.ETH_CONFIRMATIONS * 1.1) {
                                // In the cases a tx was sped up or canceled in metamask before
                                // it took off, we don't have an API to find out.
                                // https://github.com/ChainSafe/web3.js/issues/3723
                                // In this case, our transaction will timeout. Just quietly cancel
                                // our UI-side listen for the import after a grace period of expected
                                // confirmations + 10%.
                                resolve(false);
                                break;
                            }
                        }
                    }))();
                }).finally(() => (done = true));
            }
            else {
                // For ethereum exports, we can't listen for completion...
                // just assume completion if it's sent.
                if (/eth$/.test(ethTx.assetAmount.symbol.toLowerCase())) {
                    yield new Promise((r) => setTimeout(r, 15000));
                    return true;
                }
                const contract = new web3.eth.Contract(erc20TokenAbi_1.erc20TokenAbi, ethTx.toChain.findAssetWithLikeSymbolOrThrow(ethTx.assetAmount.symbol)
                    .address || exports.ETH_ADDRESS);
                let startingHeight = ethTx.startingHeight;
                const transferOptions = {
                    fromBlock: startingHeight,
                    filter: {
                        _to: ethTx.toAddress,
                        _value: ethTx.assetAmount.amount.toString(),
                    },
                };
                const pastEvents = yield contract.getPastEvents("Transfer", Object.assign(Object.assign({}, transferOptions), { toBlock: "latest" }));
                if (pastEvents.length)
                    return true;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // wait for the money on this token to hit
                    contract.events.Transfer(transferOptions, (error, value) => {
                        if (error)
                            reject(error);
                        else
                            resolve(true);
                    });
                }));
            }
        });
    }
    /**
     * Create an event listener to report status of a peg transaction.
     * Usage:
     * const tx = createPegTx(50)
     * tx.setTxHash('0x52ds.....'); // set the hash to lookup and confirm on the blockchain
     * @param confirmations number of confirmations before pegtx is considered confirmed
     */
    createPegTx(confirmations, symbol, txHash) {
        console.log("createPegTx", {
            confirmations,
            symbol,
            txHash,
        });
        const emitter = PegTxEventEmitter_1.createPegTxEventEmitter(txHash, symbol);
        // decorate pegtx to invert dependency to web3 and confirmations
        emitter.onTxHash(({ payload: txHash }) => __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.ensureWeb3();
            confirmTx_1.confirmTx({
                web3,
                txHash,
                confirmations,
                onSuccess() {
                    emitter.emit({ type: "Complete", payload: null });
                },
                onCheckConfirmation(count) {
                    emitter.emit({ type: "EthConfCountChanged", payload: count });
                },
            });
        }));
        return emitter;
    }
    /**
     * Gets a list of transactionHashes found as _from keys within the given events within a given blockRange from the current block
     * @param {*} address eth address to correlate transactions with
     * @param {*} contract web3 contract
     * @param {*} eventList event name list of events (must have an addresskey)
     * @param {*} blockRange number of blocks from the current block header to search
     */
    getEventTxsInBlockrangeFromAddress(address, contract, eventList, blockRange) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.ensureWeb3();
            const latest = yield web3.eth.getBlockNumber();
            const fromBlock = Math.max(latest - blockRange, 0);
            const allEvents = yield contract.getPastEvents("allEvents", {
                // filter:{_from:address}, // if _from was indexed we could do this
                fromBlock,
                toBlock: "latest",
            });
            // unfortunately because _from is not an indexed key we have to manually filter
            // TODO: ask peggy team to index the _from field which would make this more efficient
            const txs = [];
            for (let event of allEvents) {
                const isEventWeCareAbout = eventList.includes(event.event);
                const matchesInputAddress = address &&
                    ((_b = (_a = event === null || event === void 0 ? void 0 : event.returnValues) === null || _a === void 0 ? void 0 : _a._from) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === address.toLowerCase();
                if (isEventWeCareAbout && matchesInputAddress && event.transactionHash) {
                    txs.push({
                        hash: event.transactionHash,
                        symbol: (_c = event.returnValues) === null || _c === void 0 ? void 0 : _c._symbol,
                    });
                }
            }
            return txs;
        });
    }
    addEthereumAddressToPeggyCompatibleCosmosAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
               Should be called on load. This is a hack to make cosmos assets peggy compatible
               while the SDK bridge abstraction is a WIP.
             */
            const ethChain = entities_1.getChainsService().get(entities_1.Network.ETHEREUM);
            for (let asset of ethChain.assets) {
                try {
                    if (this.context.peggyCompatibleCosmosBaseDenoms.has(asset.symbol)) {
                        asset.address = yield this.fetchTokenAddress(asset);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            for (let asset of this.context.assets) {
                if (this.context.peggyCompatibleCosmosBaseDenoms.has(asset.symbol)) {
                    const ethAsset = ethChain.lookupAsset(asset.symbol);
                    if (ethAsset) {
                        asset.address = ethAsset.address;
                    }
                }
            }
        });
    }
    lockToSifchain(sifRecipient, assetAmount, confirmations) {
        return __awaiter(this, void 0, void 0, function* () {
            const pegTx = this.createPegTx(confirmations, assetAmount.asset.symbol);
            function handleError(err) {
                console.log("lockToSifchain: handleError: ", err);
                pegTx.emit({
                    type: "Error",
                    payload: {
                        hash: "",
                        rawLog: err.message.toString(),
                    },
                });
            }
            try {
                const web3 = yield this.ensureWeb3();
                const cosmosRecipient = web3_1.default.utils.utf8ToHex(sifRecipient);
                const bridgeBankContract = yield bridgebankContract_1.getBridgeBankContract(web3, this.context.bridgebankContractAddress);
                const accounts = yield web3.eth.getAccounts();
                const coinDenom = assetAmount.asset.ibcDenom || assetAmount.asset.address || exports.ETH_ADDRESS; // eth address is ""
                const amount = assetAmount.toBigInt().toString();
                const fromAddress = accounts[0];
                const sendArgs = {
                    from: fromAddress,
                    value: coinDenom === exports.ETH_ADDRESS ? amount : 0,
                    gas: 150000,
                };
                console.log("lockToSifchain: bridgeBankContract.lock", JSON.stringify({ cosmosRecipient, coinDenom, amount, sendArgs }));
                bridgeBankContract.methods
                    .lock(cosmosRecipient, coinDenom, amount)
                    .send(sendArgs)
                    .on("transactionHash", (hash) => {
                    console.log("lockToSifchain: bridgeBankContract.lock TX", hash);
                    pegTx.setTxHash(hash);
                })
                    .on("error", (err) => {
                    console.log("lockToSifchain: bridgeBankContract.lock ERROR", err);
                    handleError(err);
                });
            }
            catch (err) {
                handleError(err);
            }
            return pegTx;
        });
    }
    /**
     * Get a list of unconfirmed transaction hashes associated with
     * a particular address and return pegTxs associated with that hash
     * @param address contract address
     * @param confirmations number of confirmations required
     */
    fetchUnconfirmedLockBurnTxs(address, confirmations) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = yield this.ensureWeb3();
            const bridgeBankContract = yield bridgebankContract_1.getBridgeBankContract(web3, this.context.bridgebankContractAddress);
            const txs = yield this.getEventTxsInBlockrangeFromAddress(address, bridgeBankContract, ["LogBurn", "LogLock"], confirmations);
            return txs.map(({ hash, symbol }) => this.createPegTx(confirmations, symbol, hash));
        });
    }
    burnToSifchain(sifRecipient, assetAmount, confirmations, address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("burnToSifchain", sifRecipient, assetAmount.asset.symbol, assetAmount.amount.toBigInt().toString(), confirmations, address);
            const pegTx = this.createPegTx(confirmations, assetAmount.asset.symbol);
            function handleError(err) {
                console.log("burnToSifchain: handleError ERROR", err);
                pegTx.emit({
                    type: "Error",
                    payload: {
                        hash: "",
                        rawLog: err.message.toString(),
                    },
                });
            }
            try {
                const web3 = yield this.ensureWeb3();
                const cosmosRecipient = web3_1.default.utils.utf8ToHex(sifRecipient);
                const bridgeBankContract = yield bridgebankContract_1.getBridgeBankContract(web3, this.context.bridgebankContractAddress);
                const accounts = yield web3.eth.getAccounts();
                const coinDenom = assetAmount.asset.address;
                const amount = assetAmount.toBigInt().toString();
                const fromAddress = address || accounts[0];
                const sendArgs = {
                    from: fromAddress,
                    value: 0,
                    gas: 150000,
                };
                bridgeBankContract.methods
                    .burn(cosmosRecipient, coinDenom, amount)
                    .send(sendArgs)
                    .on("transactionHash", (hash) => {
                    console.log("burnToSifchain: bridgeBankContract.burn TX", hash);
                    pegTx.setTxHash(hash);
                })
                    .on("error", (err) => {
                    console.log("burnToSifchain: bridgeBankContract.burn ERROR", err);
                    handleError(err);
                });
            }
            catch (err) {
                console.error(err);
                handleError(err);
            }
            return pegTx;
        });
    }
    fetchSymbolAddress(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchTokenAddress(entities_1.getChainsService()
                .get(entities_1.Network.SIFCHAIN)
                .findAssetWithLikeSymbolOrThrow(symbol));
        });
    }
    fetchTokenAddress(
    // asset to fetch token address for
    asset, 
    // optional: pass in HTTP, or other provider (for testing)
    loadWeb3Instance = this.ensureWeb3) {
        return __awaiter(this, void 0, void 0, function* () {
            // const web3 = new Web3(createWeb3WsProvider());
            const web3 = yield loadWeb3Instance();
            const bridgeBankContract = yield bridgebankContract_1.getBridgeBankContract(web3, this.context.bridgebankContractAddress);
            const possibleSymbols = [
                // IBC assets with dedicated decimal-precise contracts are uppercase
                asset.displaySymbol.toUpperCase(),
                // remove c prefix
                asset.symbol.replace(/^c/, ""),
                // remove e prefix
                asset.symbol.replace(/^e/, ""),
                // display symbol goes before ibc denom because the dedicated decimal-precise contracts
                // utilize the display symbol
                asset.displaySymbol,
                asset.ibcDenom,
                asset.symbol,
                "e" + asset.symbol,
            ].filter(Boolean);
            for (let symbol of possibleSymbols) {
                // Fetch the token address from bridgebank
                let tokenAddress = yield bridgeBankContract.methods
                    .getBridgeToken(symbol)
                    .call();
                // Token address is a hex number. If it is non-zero (not ethereum or empty) when parsed, return it.
                if (+tokenAddress) {
                    return tokenAddress;
                }
                // If this is ethereum, and the token address is empty, return the ethereum address
                if (tokenAddress === exports.ETH_ADDRESS && (symbol === null || symbol === void 0 ? void 0 : symbol.endsWith("eth"))) {
                    return tokenAddress;
                }
            }
        });
    }
    subscribeToTx(tx, onUpdated) {
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
                memo: err.payload.memo || "Transaction Failed",
                state: "failed",
            });
        });
        // HACK: Trigger all hashHandlers
        // Maybe make this some kind of ready function?
        if (tx.hash)
            tx.setTxHash(tx.hash);
        return unsubscribe;
    }
}
exports.EthBridge = EthBridge;
//# sourceMappingURL=EthBridge.js.map