"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoOrgChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class CryptoOrgChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
    }
    getBlockExplorerUrlForAddress(address) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "account", address);
    }
}
exports.CryptoOrgChain = CryptoOrgChain;
//# sourceMappingURL=CryptoOrgChain.js.map