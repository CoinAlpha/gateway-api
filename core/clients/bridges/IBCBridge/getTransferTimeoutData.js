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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransferTimeoutData = void 0;
const long_1 = __importDefault(require("long"));
const ChainIdHelper_1 = require("../../wallets/cosmos/ChainIdHelper");
exports.getTransferTimeoutData = (receivingStargateClient, desiredTimeoutMinutes) => __awaiter(void 0, void 0, void 0, function* () {
    const blockTimeMinutes = 7.25 / 60;
    const timeoutBlockDelta = desiredTimeoutMinutes / blockTimeMinutes;
    return {
        revisionNumber: long_1.default.fromNumber(+ChainIdHelper_1.ChainIdHelper.parse(yield receivingStargateClient.getChainId()).version.toString() || 0),
        // Set the timeout height as the current height + 150.
        revisionHeight: long_1.default.fromNumber((yield receivingStargateClient.getHeight()) + timeoutBlockDelta),
    };
});
//# sourceMappingURL=getTransferTimeoutData.js.map