"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBC_EXPORT_FEE_ADDRESS = exports.calculateIBCExportFee = void 0;
const entities_1 = require("../entities");
function calculateIBCExportFee(transferAmount) {
    const rowan = entities_1.getChainsService()
        .get(entities_1.Network.SIFCHAIN)
        .findAssetWithLikeSymbolOrThrow("rowan");
    // ibc exports have .99 rowan fee
    return entities_1.AssetAmount(rowan, "990000000000000000");
}
exports.calculateIBCExportFee = calculateIBCExportFee;
exports.IBC_EXPORT_FEE_ADDRESS = "sif1e8vmeyg4j5uftkhnvlz7493usjs7k6h3src0ph";
//# sourceMappingURL=ibcExportFees.js.map