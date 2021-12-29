"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
const url_join_ts_1 = require("url-join-ts");
class EthereumChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForTxHash(hash) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
    }
    getBlockExplorerUrlForAddress(address) {
        return url_join_ts_1.urlJoin(this.chainConfig.blockExplorerUrl, "address", address);
    }
}
exports.EthereumChain = EthereumChain;
//# sourceMappingURL=EthereumChain.js.map