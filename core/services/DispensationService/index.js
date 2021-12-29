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
const SifClient_1 = require("../utils/SifClient");
function createDispensationService({ sifApiUrl, nativeAsset, sifChainId, sifWsUrl, sifRpcUrl, sifUnsignedClient = new SifClient_1.SifUnSignedClient(sifApiUrl, sifWsUrl, sifRpcUrl), }) {
    const client = sifUnsignedClient;
    const instance = {
        claim(params) {
            return __awaiter(this, void 0, void 0, function* () {
                // return {
                //   typeUrl: `/sifnode.dispensation.v1.MsgCreateUserClaim`,
                //   value: {
                //     userClaimAddress: params?.fromAddress,
                //     userClaimType: params?.claimType,
                //   } as MsgCreateUserClaim,
                // };
                return yield client.claim({
                    base_req: { chain_id: sifChainId, from: params.fromAddress },
                    claim_type: params.claimType,
                    claim_creator: params.fromAddress,
                });
            });
        },
    };
    return instance;
}
exports.default = createDispensationService;
//# sourceMappingURL=index.js.map