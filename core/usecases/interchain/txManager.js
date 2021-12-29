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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../entities");
const BaseBridge_1 = require("../../clients/bridges/BaseBridge");
const PersistentTxList = (context) => {
    const key = "transfer_txs";
    const serialize = (tx) => {
        const { assetAmount, fromChain, toChain } = tx, rest = __rest(tx, ["assetAmount", "fromChain", "toChain"]);
        return Object.assign({ $symbol: assetAmount.symbol, $amount: assetAmount.amount.toBigInt().toString(), $fromChainNetwork: fromChain.network, $toChainNetwork: toChain.network }, rest);
    };
    const deserialize = (serializedTx) => {
        const { $amount, $symbol, $fromChainNetwork, $toChainNetwork } = serializedTx, rest = __rest(serializedTx, ["$amount", "$symbol", "$fromChainNetwork", "$toChainNetwork"]);
        return Object.assign(Object.assign({}, rest), { assetAmount: entities_1.AssetAmount($symbol, $amount), fromChain: context.services.chains.get($fromChainNetwork), toChain: context.services.chains.get($toChainNetwork) });
    };
    const getRawList = () => {
        try {
            const raw = context.services.storage.getItem(key);
            const array = JSON.parse(raw || "[]") || [];
            return array;
        }
        catch (error) {
            context.services.storage.setItem(key, "[]");
            return [];
        }
    };
    const setRawList = (list) => {
        context.services.storage.setItem(key, JSON.stringify(list));
    };
    const bridgeTxs = getRawList().map((item) => deserialize(item));
    return {
        add: (tx) => {
            bridgeTxs.push(tx);
            setRawList(bridgeTxs.map((tx) => serialize(tx)));
        },
        remove: (tx) => {
            bridgeTxs.splice(bridgeTxs.indexOf(tx), 1);
            setRawList(bridgeTxs.map((tx) => serialize(tx)));
        },
        get: () => bridgeTxs,
        save: () => setRawList(bridgeTxs.map((tx) => serialize(tx))),
    };
};
function BridgeTxManager(context, interchain) {
    const { services, store } = context;
    const txList = PersistentTxList(context);
    const subscribeToBridgeTx = (bridgeTx) => __awaiter(this, void 0, void 0, function* () {
        const bridge = interchain(bridgeTx.fromChain, bridgeTx.toChain);
        const isImport = bridgeTx.toChain.network === entities_1.Network.SIFCHAIN;
        const payload = {
            bridgeTx: bridgeTx,
            transactionStatus: {
                state: "accepted",
                hash: bridgeTx.hash,
            },
        };
        store.tx.pendingTransfers[bridgeTx.hash] = payload;
        services.bus.dispatch({
            type: isImport
                ? "PegTransactionPendingEvent"
                : "UnpegTransactionPendingEvent",
            payload,
        });
        try {
            const didComplete = yield bridge.waitForTransferComplete(bridgeTx, function onUpdateBridgeTx(update) {
                console.log("onUpdateBridgeTx", update);
                Object.assign(bridgeTx, update);
                store.tx.pendingTransfers[bridgeTx.hash] = Object.assign(Object.assign({}, payload), { bridgeTx: Object.assign({}, bridgeTx) });
                txList.save();
            });
            if (!didComplete) {
                // Silent failure... for one reason or another, we're just done.
            }
            else {
                // First emit the event so UI can update balances...
                BaseBridge_1.bridgeTxEmitter.emit("tx_complete", bridgeTx);
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
        }
        catch (error) {
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
    });
    const onTxSent = (tx) => {
        txList.add(tx);
        subscribeToBridgeTx(tx);
    };
    return {
        listenForSentTransfers: () => {
            BaseBridge_1.bridgeTxEmitter.on("tx_sent", onTxSent);
            return () => BaseBridge_1.bridgeTxEmitter.off("tx_sent", onTxSent);
        },
        loadSavedTransferList(userSifAddress) {
            // Load from storage and subscribe on bootup
            txList.get().forEach((tx) => {
                // When user switches accounts in keplr, only track saved
                // transfers matching current address.
                if (tx.fromAddress === userSifAddress ||
                    tx.toAddress === userSifAddress) {
                    subscribeToBridgeTx(tx);
                }
            });
        },
    };
}
exports.default = BridgeTxManager;
//# sourceMappingURL=txManager.js.map