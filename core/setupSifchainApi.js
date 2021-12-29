"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSifchainApi = void 0;
const _1 = require(".");
const getConfig_1 = require("./config/getConfig");
const getEnv_1 = require("./config/getEnv");
const services_1 = require("./services");
const store_1 = require("./store");
// export type SifchainEnv =
//   | "mainnet"
//   | "testnet"
//   | "devnet"
//   | "localnet"
//   | "devnet_042";
function setupSifchainApi(environment = getEnv_1.NetworkEnv.LOCALNET) {
    // Following should happen with an underlying shared API
    const { tag, ethAssetTag, sifAssetTag } = getEnv_1.profileLookup[environment];
    if (typeof tag == "undefined")
        throw new Error("environment " + environment + " not found");
    const config = getConfig_1.getConfig(tag, sifAssetTag, ethAssetTag);
    const services = services_1.createServices(config);
    const store = store_1.createStore();
    const usecases = _1.createUsecases({ store, services });
    const unsubscribers = [];
    unsubscribers.push(usecases.wallet.sif.initSifWallet());
    function cleanup() {
        for (let unsubscriber of unsubscribers) {
            unsubscriber();
        }
    }
    return { services, store, cleanup, config };
}
exports.setupSifchainApi = setupSifchainApi;
//# sourceMappingURL=setupSifchainApi.js.map