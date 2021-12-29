"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSdk = exports.getSdkConfig = void 0;
const getConfig_1 = require("./config/getConfig");
const getEnv_1 = require("./config/getEnv");
const IBCBridge_1 = require("./clients/bridges/IBCBridge/IBCBridge");
const ChainsService_1 = require("./services/ChainsService");
exports.getSdkConfig = (params) => {
    const { tag, ethAssetTag, sifAssetTag } = getEnv_1.profileLookup[params.environment];
    if (typeof tag == "undefined")
        throw new Error("environment " + params.environment + " not found");
    return getConfig_1.getConfig(tag, sifAssetTag, ethAssetTag, params.wallets.cosmos);
};
function createSdk(options) {
    const config = exports.getSdkConfig(options);
    return {
        wallets: {
            cosmos: config.cosmosWalletProvider,
        },
        chains: Object.fromEntries(Object.keys(ChainsService_1.networkChainCtorLookup).map((network) => {
            return [
                network,
                new ChainsService_1.networkChainCtorLookup[network]({
                    assets: config.assets,
                    chainConfig: config.chainConfigsByNetwork[network],
                }),
            ];
        })),
        bridges: {
            ibc: new IBCBridge_1.IBCBridge(config),
        },
    };
}
exports.createSdk = createSdk;
//# sourceMappingURL=setup.js.map