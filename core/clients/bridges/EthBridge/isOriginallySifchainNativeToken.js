"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOriginallySifchainNativeToken = void 0;
const entities_1 = require("../../../entities");
function isOriginallySifchainNativeToken(asset) {
    return (asset.homeNetwork !== entities_1.Network.ETHEREUM ||
        asset.symbol.toLowerCase() === "erowan");
}
exports.isOriginallySifchainNativeToken = isOriginallySifchainNativeToken;
//# sourceMappingURL=isOriginallySifchainNativeToken.js.map