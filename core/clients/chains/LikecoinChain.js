"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikecoinChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
const url_join_ts_1 = require("url-join-ts");
class LikecoinChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "transactions", hash);
    }
    getBlockExplorerUrlForAddress(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "accounts", hash);
    }
}
exports.LikecoinChain = LikecoinChain;
//# sourceMappingURL=LikecoinChain.js.map