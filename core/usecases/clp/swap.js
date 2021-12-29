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
exports.Swap = void 0;
const entities_1 = require("../../entities");
const utils_1 = require("../utils");
function Swap({ bus, sif, clp, ibc, tokenRegistry, wallet, chains, }) {
    return (sentAmount, receivedAsset, minimumReceived) => __awaiter(this, void 0, void 0, function* () {
        const reportTransactionError = utils_1.ReportTransactionError(bus);
        const client = yield sif.loadNativeDexClient();
        const address = yield wallet.keplrProvider.connect(chains.nativeChain);
        if (!address)
            throw new Error("No from address provided for swap");
        const tx = client.tx.clp.Swap({
            sentAsset: {
                symbol: (yield tokenRegistry.findAssetEntryOrThrow(sentAmount.asset))
                    .denom,
            },
            receivedAsset: {
                symbol: (yield tokenRegistry.findAssetEntryOrThrow(receivedAsset))
                    .denom,
            },
            signer: address,
            sentAmount: sentAmount.toBigInt().toString(),
            minReceivingAmount: minimumReceived.toBigInt().toString(),
        }, address);
        const signed = yield wallet.keplrProvider.sign(chains.nativeChain, tx);
        const sent = yield wallet.keplrProvider.broadcast(chains.nativeChain, signed);
        const txStatus = wallet.keplrProvider.parseTxResultToStatus(sent);
        if (txStatus.state !== "accepted") {
            // Edge case where we have run out of native balance and need to represent that
            if (txStatus.code === entities_1.ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE &&
                sentAmount.symbol === "rowan") {
                return reportTransactionError(Object.assign(Object.assign({}, txStatus), { code: entities_1.ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS, memo: entities_1.getErrorMessage(entities_1.ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS) }));
            }
            return reportTransactionError(txStatus);
        }
        return txStatus;
    });
}
exports.Swap = Swap;
//# sourceMappingURL=swap.js.map