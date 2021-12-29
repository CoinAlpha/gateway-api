"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTxFailure = exports.parseEthereumTxFailure = void 0;
const Errors_1 = require("../../entities/Errors");
// returns contextual inflrmation based on ethereum tx failure
function parseEthereumTxFailure(txFailure) {
    var _a, _b;
    if ((_a = txFailure.rawLog) === null || _a === void 0 ? void 0 : _a.includes("LEDGER_")) {
        return {
            code: Errors_1.ErrorCode.UNKNOWN_FAILURE,
            hash: txFailure.transactionHash,
            memo: txFailure.rawLog,
            state: "failed",
        };
    }
    if ((_b = txFailure.rawLog) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("error: [object object]")) {
        return {
            code: Errors_1.ErrorCode.UNKNOWN_FAILURE,
            hash: txFailure.transactionHash,
            state: "failed",
            memo: "ledger_smart_contracts_not_approved",
        };
    }
    return parseTxFailure(txFailure);
}
exports.parseEthereumTxFailure = parseEthereumTxFailure;
function parseTxFailure(txFailure) {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log({ "txFailure.rawLog": txFailure.rawLog });
    // TODO: synchronise with backend and use error codes at the service level
    // and provide a localized error lookup on frontend for messages
    if ((_a = txFailure.rawLog) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("below expected")) {
        return {
            code: Errors_1.ErrorCode.TX_FAILED_SLIPPAGE,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.TX_FAILED_SLIPPAGE),
            state: "failed",
        };
    }
    if ((_b = txFailure.rawLog) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("swap_failed")) {
        return {
            code: Errors_1.ErrorCode.TX_FAILED,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.TX_FAILED),
            state: "failed",
        };
    }
    if ((_c = txFailure.rawLog) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes("request rejected")) {
        return {
            code: Errors_1.ErrorCode.USER_REJECTED,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.USER_REJECTED),
            state: "rejected",
        };
    }
    if ((_d = txFailure.rawLog) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes("out of gas")) {
        return {
            code: Errors_1.ErrorCode.TX_FAILED_OUT_OF_GAS,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.TX_FAILED_OUT_OF_GAS),
            state: "out_of_gas",
        };
    }
    if ((_e = txFailure.rawLog) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes("insufficient funds")) {
        return {
            code: Errors_1.ErrorCode.INSUFFICIENT_FUNDS,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.INSUFFICIENT_FUNDS),
            state: "failed",
        };
    }
    if ((_f = txFailure.rawLog) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes("user does not have enough balance")) {
        return {
            code: Errors_1.ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE,
            hash: txFailure.transactionHash,
            memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE),
            state: "failed",
        };
    }
    if ((_g = txFailure.rawLog) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes("data is invalid : unexpected characters")) {
        return {
            code: Errors_1.ErrorCode.UNKNOWN_FAILURE,
            hash: txFailure.transactionHash,
            memo: "Error processing transaction with Ledger. A fix is in progress for this. Until then, please use Sifchain without a Ledger wallet.",
            state: "failed",
        };
    }
    // if (
    //   txFailure.rawLog?.toLowerCase().includes("status code 500") ||
    //   txFailure.rawLog?.toLowerCase().includes("network error")
    // ) {
    //   return {
    //     code: ErrorCode.UNKNOWN_FAILURE,
    //     hash: txFailure.transactionHash,
    //     memo:
    //       "There was a network error when signing the transaction in your wallet. Please try again.",
    //     state: "failed",
    //   };
    // }
    return {
        code: Errors_1.ErrorCode.UNKNOWN_FAILURE,
        hash: txFailure.transactionHash,
        memo: Errors_1.getErrorMessage(Errors_1.ErrorCode.UNKNOWN_FAILURE),
        state: "failed",
    };
}
exports.parseTxFailure = parseTxFailure;
//# sourceMappingURL=parseTxFailure.js.map