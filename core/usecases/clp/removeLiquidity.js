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
exports.RemoveLiquidity = void 0;
function RemoveLiquidity({ bus, sif, clp, tokenRegistry, wallet, chains, }) {
    return (asset, wBasisPoints, asymmetry) => __awaiter(this, void 0, void 0, function* () {
        const client = yield sif.loadNativeDexClient();
        const externalAssetEntry = yield tokenRegistry.findAssetEntryOrThrow(asset);
        const txDraft = client.tx.clp.RemoveLiquidity({
            asymmetry,
            wBasisPoints,
            externalAsset: {
                symbol: externalAssetEntry.denom,
            },
            /*
             @mccallofthewild - This usecase (if we don't kill it altogether in lieu
             of an all-powerful `NativeDexClient`) should really take in an address argument instead
             of reading state here. Leaving it now to speed up ledger implementation
            */
            signer: sif.getState().address,
        }, sif.getState().address);
        const signedTx = yield wallet.keplrProvider.sign(chains.nativeChain, txDraft);
        const sentTx = yield wallet.keplrProvider.broadcast(chains.nativeChain, signedTx);
        const txStatus = client.parseTxResult(sentTx);
        if (txStatus.state !== "accepted") {
            bus.dispatch({
                type: "TransactionErrorEvent",
                payload: {
                    txStatus,
                    message: txStatus.memo || "There was an error removing liquidity",
                },
            });
        }
        return txStatus;
    });
}
exports.RemoveLiquidity = RemoveLiquidity;
//# sourceMappingURL=removeLiquidity.js.map