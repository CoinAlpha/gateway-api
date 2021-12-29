"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function balancesAreDifferent(b1, b2) {
    const getAssetAmountKey = (balances) => balances
        .map((b) => {
        return `${b.symbol}_${b.amount.toBigInt().toString()}`;
    })
        .join(" ");
    // Extremely naive check just so we don't spam state-setting with the exact same balance list.
    // Yes, if balances change order or are added/removed it will re-set the whole array. Don't care.
    return getAssetAmountKey(b1) !== getAssetAmountKey(b2);
}
exports.default = balancesAreDifferent;
//# sourceMappingURL=balancesAreDifferent.js.map