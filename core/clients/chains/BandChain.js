"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
const url_join_ts_1 = require("url-join-ts");
class BandChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
    }
}
exports.BandChain = BandChain;
//# sourceMappingURL=BandChain.js.map