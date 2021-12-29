"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeDexSignedTransaction = exports.NativeDexTransaction = void 0;
class NativeDexTransaction {
    constructor(fromAddress, msgs, fee = {
        gas: "",
        price: {
            denom: "",
            amount: "",
        },
    }, memo = "") {
        this.fromAddress = fromAddress;
        this.msgs = msgs;
        this.fee = fee;
        this.memo = memo;
    }
}
exports.NativeDexTransaction = NativeDexTransaction;
class NativeDexSignedTransaction {
    constructor(raw, signed) {
        this.raw = raw;
        this.signed = signed;
    }
}
exports.NativeDexSignedTransaction = NativeDexSignedTransaction;
//# sourceMappingURL=NativeDexTransaction.js.map