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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claim = void 0;
function Claim({ dispensation, wallet, sif, chains }) {
    return (_a) => __awaiter(this, void 0, void 0, function* () {
        var { rewardProgramName } = _a, params = __rest(_a, ["rewardProgramName"]);
        if (!params)
            throw "You forgot claimType and fromAddress";
        const memo = `program=${rewardProgramName}`;
        const address = yield wallet.keplrProvider.connect(chains.nativeChain);
        if (!address)
            throw new Error("Not connected to Sifchain wallet");
        const client = yield sif.loadNativeDexClient();
        const tx = client.tx.dispensation.CreateUserClaim({
            userClaimAddress: params.fromAddress,
            userClaimType: params.claimType,
        }, address, undefined, memo);
        const signed = yield wallet.keplrProvider.sign(chains.nativeChain, tx);
        const sent = yield wallet.keplrProvider.broadcast(chains.nativeChain, signed);
        return client.parseTxResult(sent);
    });
}
exports.Claim = Claim;
//# sourceMappingURL=claim.js.map