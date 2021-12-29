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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLiquidity = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../utils");
const utils_2 = require("../../utils");
function findPool(pools, nativeSymbol, externalSymbol) {
    var _a;
    return (_a = pools[utils_2.createPoolKey(nativeSymbol, externalSymbol)]) !== null && _a !== void 0 ? _a : null;
}
function AddLiquidity({ bus, clp, sif, ibc, tokenRegistry, wallet, chains }, store) {
    return (nativeAssetAmount, externalAssetAmount) => __awaiter(this, void 0, void 0, function* () {
        const client = yield sif.loadNativeDexClient();
        const address = yield wallet.keplrProvider.connect(chains.nativeChain);
        const externalAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(externalAssetAmount.asset);
        const hasPool = !!findPool(store.pools, nativeAssetAmount.asset.symbol, externalAssetAmount.asset.symbol);
        const reportTransactionError = utils_1.ReportTransactionError(bus);
        const state = sif.getState();
        if (!state.address)
            throw "No from address provided for swap";
        const txDraft = hasPool
            ? client.tx.clp.AddLiquidity({
                externalAsset: {
                    symbol: externalAssetEntry.denom,
                },
                externalAssetAmount: externalAssetAmount.toBigInt().toString(),
                nativeAssetAmount: nativeAssetAmount.toBigInt().toString(),
                signer: address,
            }, address)
            : client.tx.clp.CreatePool({
                externalAsset: {
                    symbol: externalAssetEntry.denom,
                },
                externalAssetAmount: externalAssetAmount.toBigInt().toString(),
                nativeAssetAmount: nativeAssetAmount.toBigInt().toString(),
                signer: address,
            }, address);
        const signedTx = yield wallet.keplrProvider.sign(chains.nativeChain, txDraft);
        const sentTx = yield wallet.keplrProvider.broadcast(chains.nativeChain, signedTx);
        const txStatus = client.parseTxResult(sentTx);
        if (txStatus.state !== "accepted") {
            // Edge case where we have run out of native balance and need to represent that
            if (txStatus.code === entities_1.ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE) {
                return reportTransactionError(Object.assign(Object.assign({}, txStatus), { code: entities_1.ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS, memo: entities_1.getErrorMessage(entities_1.ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS) }));
            }
        }
        return txStatus;
    });
}
exports.AddLiquidity = AddLiquidity;
//# sourceMappingURL=addLiquidity.js.map