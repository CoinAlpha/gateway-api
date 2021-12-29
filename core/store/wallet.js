"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet = void 0;
const reactivity_1 = require("@vue/reactivity");
const initWalletStore = () => ({
    isConnected: false,
    address: "",
    balances: [],
});
exports.wallet = reactivity_1.reactive({
    _map: reactivity_1.reactive(new Map()),
    get: (network) => {
        let value = exports.wallet._map.get(network);
        if (!value) {
            value = initWalletStore();
            exports.wallet._map.set(network, value);
            return value;
        }
        return value;
    },
    set: (network, data) => {
        exports.wallet._map.set(network, data);
    },
    reset: (network) => {
        exports.wallet._map.set(network, initWalletStore());
    },
});
//# sourceMappingURL=wallet.js.map