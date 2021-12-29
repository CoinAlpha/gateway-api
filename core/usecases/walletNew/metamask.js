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
// const chainIdName = new Map([
//   ["0x1", "Ethereum Mainnet"],
//   ["0x3", "Ropsten Test Network"],
// ]);
function MetamaskActions(context) {
    const { services } = context;
    const { wallet, chains } = services;
    return {
        loadIfConnected(network) {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise((r) => setTimeout(r, 500));
                if (yield wallet.metamaskProvider.hasConnected(chains.get(network))) {
                    return this.load(network);
                }
                return {
                    connected: false,
                };
            });
        },
        load(network) {
            return __awaiter(this, void 0, void 0, function* () {
                const address = yield wallet.metamaskProvider.connect(chains.get(network));
                return {
                    address,
                    balances: [],
                    connected: true,
                };
            });
        },
        getBalances(network, address) {
            return __awaiter(this, void 0, void 0, function* () {
                const bal = yield wallet.metamaskProvider.fetchBalances(chains.get(network), address);
                return bal;
            });
        },
        disconnect(network) {
            return __awaiter(this, void 0, void 0, function* () {
                yield wallet.metamaskProvider.disconnect(chains.get(network));
            });
        },
    };
}
exports.default = MetamaskActions;
//# sourceMappingURL=metamask.js.map