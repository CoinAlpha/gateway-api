"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IrisChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
class IrisChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForAddress(address) {
        return this.chainConfig.blockExplorerUrl + `#/address/${address}`;
    }
    getBlockExplorerUrlForTxHash(hash) {
        return this.chainConfig.blockExplorerUrl + `#/tx?txHash=${hash}`;
    }
}
exports.IrisChain = IrisChain;
//# sourceMappingURL=IrisChain.js.map