"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLikeSymbol = void 0;
function isLikeSymbol(symbol1, symbol2) {
    symbol1 = symbol1.toLowerCase();
    symbol2 = symbol2.toLowerCase();
    const withoutPrefix = (s = "") => s.replace(/^(c|e|u)/, "");
    return (symbol1 === symbol2 ||
        withoutPrefix(symbol1) === symbol2 ||
        symbol1 === withoutPrefix(symbol2) ||
        withoutPrefix(symbol1) === withoutPrefix(symbol2));
}
exports.isLikeSymbol = isLikeSymbol;
//# sourceMappingURL=isLikeSymbol.js.map