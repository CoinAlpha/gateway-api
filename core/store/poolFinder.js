"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountPoolFinder = exports.createPoolFinder = void 0;
const reactivity_1 = require("@vue/reactivity");
const entities_1 = require("../entities");
const pool_1 = require("../utils/pool");
exports.createPoolFinder = (s) => (a, b) => {
    if (typeof a === "string")
        a = entities_1.Asset.get(a);
    if (typeof b === "string")
        b = entities_1.Asset.get(b);
    const pools = reactivity_1.toRefs(s.pools);
    const key = pool_1.createPoolKey(a, b);
    const poolRef = pools[key];
    return poolRef !== null && poolRef !== void 0 ? poolRef : null;
};
exports.createAccountPoolFinder = (s) => (a, b) => {
    if (typeof a === "string")
        a = entities_1.Asset.get(a);
    if (typeof b === "string")
        b = entities_1.Asset.get(b);
    const accountpools = reactivity_1.toRefs(s.accountpools[s.wallet.get(entities_1.Network.SIFCHAIN).address] || {});
    const key = pool_1.createPoolKey(a, b);
    const accountPoolRef = accountpools[key];
    return accountPoolRef !== null && accountPoolRef !== void 0 ? accountPoolRef : null;
};
//# sourceMappingURL=poolFinder.js.map