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
exports.getBridgeBankContract = void 0;
const entities_1 = require("../../entities");
let abisPromise;
function fetchBridgebankContractAbis() {
    if (!abisPromise) {
        abisPromise = (() => __awaiter(this, void 0, void 0, function* () {
            const sifchainChain = entities_1.getChainsService().get(entities_1.Network.SIFCHAIN);
            const res = yield fetch(`https://sifchain-changes-server.vercel.app/api/bridgebank-abis/${sifchainChain.chainConfig.chainId}`);
            return res.json();
        }))();
    }
    return abisPromise;
}
function getBridgeBankContract(web3, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const abis = yield fetchBridgebankContractAbis();
        return new web3.eth.Contract(abis, address);
    });
}
exports.getBridgeBankContract = getBridgeBankContract;
// bump
//# sourceMappingURL=bridgebankContract.js.map