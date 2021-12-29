"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = void 0;
const NativeDexClient_1 = require("../../services/utils/SifClient/NativeDexClient");
class WalletProvider {
    // Parse to dex-v1 compatible output
    parseTxResultToStatus(result) {
        return NativeDexClient_1.NativeDexClient.parseTxResult(result);
    }
}
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=WalletProvider.js.map