"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegenChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class RegenChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
    }
}
exports.RegenChain = RegenChain;
//# sourceMappingURL=RegenChain.js.map