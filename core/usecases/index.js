"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsecases = void 0;
const clp_1 = __importDefault(require("./clp"));
const sif_1 = __importDefault(require("./wallet/sif"));
const interchain_1 = __importDefault(require("./interchain"));
const reward_1 = __importDefault(require("./reward"));
const keplr_1 = __importDefault(require("./walletNew/keplr"));
const metamask_1 = __importDefault(require("./walletNew/metamask"));
function createUsecases(context) {
    return {
        interchain: interchain_1.default(context),
        clp: clp_1.default(context),
        wallet: {
            sif: sif_1.default(context),
        },
        walletNew: {
            keplr: keplr_1.default(context),
            metamask: metamask_1.default(context),
        },
        reward: reward_1.default(context),
    };
}
exports.createUsecases = createUsecases;
//# sourceMappingURL=index.js.map