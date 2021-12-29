"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
class TerraChain extends _BaseChain_1.BaseChain {
    getBlockExplorerUrlForAddress(address) {
        return this.chainConfig.blockExplorerUrl + `#/address/${address}`;
    }
    getBlockExplorerUrlForTxHash(hash) {
        return this.chainConfig.blockExplorerUrl + `#/tx/${hash}`;
    }
}
exports.TerraChain = TerraChain;
//# sourceMappingURL=TerraChain.js.map