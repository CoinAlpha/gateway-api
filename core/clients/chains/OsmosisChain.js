"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsmosisChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class OsmosisChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
    }
    getBlockExplorerUrlForAddress(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
    }
}
exports.OsmosisChain = OsmosisChain;
//# sourceMappingURL=OsmosisChain.js.map