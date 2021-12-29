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
const reactivity_1 = require("@vue/reactivity");
exports.default = ({ services, store, }) => {
    const actions = {
        initSifWallet() {
            const effects = [];
            const state = services.sif.getState();
            effects.push(reactivity_1.effect(() => {
                console.log("state.connected:", state.connected);
                if (store.wallet.get(entities_1.Network.SIFCHAIN).isConnected !== state.connected) {
                    store.wallet.get(entities_1.Network.SIFCHAIN).isConnected = state.connected;
                    if (store.wallet.get(entities_1.Network.SIFCHAIN).isConnected) {
                        services.bus.dispatch({
                            type: "WalletConnectedEvent",
                            payload: {
                                walletType: "sif",
                                address: store.wallet.get(entities_1.Network.SIFCHAIN).address,
                            },
                        });
                    }
                }
            }));
            effects.push(reactivity_1.effect(() => {
                store.wallet.get(entities_1.Network.SIFCHAIN).address = state.address;
            }));
            effects.push(reactivity_1.effect(() => {
                store.wallet.get(entities_1.Network.SIFCHAIN).balances = state.balances;
            }));
            return () => {
                for (let ef of effects) {
                    reactivity_1.stop(ef);
                }
            };
        },
        getCosmosBalances(address) {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO: validate sif prefix
                return yield services.sif.getBalance(address);
            });
        },
        sendCosmosTransaction(params) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield services.sif.transfer(params);
            });
        },
        connectToSifWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // TODO type
                    yield services.sif.connect();
                    store.wallet.get(entities_1.Network.SIFCHAIN).isConnected = true;
                }
                catch (error) {
                    console.error(error);
                    services.bus.dispatch({
                        type: "WalletConnectionErrorEvent",
                        payload: {
                            walletType: "sif",
                            message: "Failed to connect to Keplr.",
                        },
                    });
                }
            });
        },
    };
    return actions;
};
//# sourceMappingURL=sif.js.map