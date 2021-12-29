"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SifchainChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
const url_join_ts_1 = require("url-join-ts");
class SifchainChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
    }
    getBlockExplorerUrlForAddress(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
    }
}
exports.SifchainChain = SifchainChain;
//# sourceMappingURL=SifchainChain.js.map