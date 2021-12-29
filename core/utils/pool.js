"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolKey = void 0;
const entities_1 = require("../entities");
exports.createPoolKey = (a, b) => {
    if (typeof a === "string")
        a = entities_1.Asset.get(a);
    if (typeof b === "string")
        b = entities_1.Asset.get(b);
    return [a, b]
        .map((asset) => asset.symbol.toLowerCase())
        .sort()
        .join("_");
};
//# sourceMappingURL=pool.js.map