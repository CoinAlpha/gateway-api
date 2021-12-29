"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IxoChain = void 0;
const url_join_ts_1 = require("url-join-ts");
const _BaseChain_1 = require("./_BaseChain");
class IxoChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "/cosmos/tx/v1beta1/txs/", hash);
    }
    getBlockExplorerUrlForAddress(address) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "/cosmos/bank/v1beta1/balances/", address);
    }
}
exports.IxoChain = IxoChain;
//# sourceMappingURL=IxoChain.js.map