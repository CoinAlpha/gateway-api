"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JunoChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class JunoChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
    }
    getBlockExplorerUrlForAddress(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
    }
}
exports.JunoChain = JunoChain;
//# sourceMappingURL=JunoChain.js.map