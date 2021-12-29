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
const entities_1 = require("../../entities");
function KeplrActions(context) {
    const { keplrProvider } = context.services.wallet;
    const { chains } = context.services;
    return {
        loadIfConnected(network) {
            return __awaiter(this, void 0, void 0, function* () {
                const chain = chains.get(network);
                const hasConnected = yield keplrProvider.hasConnected(chain);
                if (hasConnected) {
                    const address = yield keplrProvider.connect(chain);
                    return {
                        address,
                        balances: [],
                        connected: true,
                    };
                }
                return {
                    connected: false,
                };
            });
        },
        load(network) {
            return __awaiter(this, void 0, void 0, function* () {
                const address = yield keplrProvider.connect(chains.get(network));
                if (network === entities_1.Network.SIFCHAIN) {
                    // For legacy code to work
                    context.services.sif.connect();
                }
                return {
                    address,
                    balances: [],
                    connected: true,
                };
            });
        },
        getBalances(network, address) {
            return __awaiter(this, void 0, void 0, function* () {
                const chain = chains.get(network);
                try {
                    return keplrProvider.fetchBalances(chain, address);
                }
                catch (error) {
                    console.log("Retrying. Errored checking balances for " + network);
                    // Give it ONE retry, sometimes the chain rpc apis fail once...
                    return keplrProvider.fetchBalances(chain, address);
                }
            });
        },
        disconnect(network) {
            return __awaiter(this, void 0, void 0, function* () {
                return keplrProvider.disconnect(chains.get(network));
            });
        },
    };
}
exports.default = KeplrActions;
//# sourceMappingURL=keplr.js.map