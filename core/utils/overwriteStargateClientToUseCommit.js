"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overwriteStargateClientToUseCommit = void 0;
const stargate_1 = require("@cosmjs/stargate");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
// Determined unneccessary as of 2021-08-11. Remove if date is past 2021-09-11.
exports.overwriteStargateClientToUseCommit = () => {
    const originalBroadcast = stargate_1.StargateClient.prototype.broadcastTx;
    stargate_1.StargateClient.prototype.broadcastTx = function (params) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalBrdcstSync = tendermint_rpc_1.Tendermint34Client.prototype.broadcastTxSync;
            tendermint_rpc_1.Tendermint34Client.prototype.broadcastTxSync = function (params) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const commitRes = yield this.broadcastTxCommit(params);
                    return Object.assign(Object.assign(Object.assign({}, ((_a = commitRes.deliverTx) !== null && _a !== void 0 ? _a : {})), commitRes.checkTx), commitRes);
                });
            };
            const rtn = originalBroadcast.bind(this)(params);
            tendermint_rpc_1.Tendermint34Client.prototype.broadcastTxSync = originalBrdcstSync;
            return rtn;
        });
    };
};
//# sourceMappingURL=overwriteStargateClientToUseCommit.js.map