"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkashChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class AkashChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
    }
}
exports.AkashChain = AkashChain;
//# sourceMappingURL=AkashChain.js.map