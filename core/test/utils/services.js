"use strict";
// Consolodated place where we can setup testing services
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
exports.createTestSifService = void 0;
const SifService_1 = __importDefault(require("../../services/SifService"));
const getTestingToken_1 = require("./getTestingToken");
function createTestSifService(account) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("sifchain chain id may not be correct");
        const sif = SifService_1.default({
            sifApiUrl: "http://localhost:1317",
            sifAddrPrefix: "sif",
            sifWsUrl: "ws://localhost:26657/websocket",
            sifRpcUrl: "http://localhost:26657",
            assets: getTestingToken_1.getTestingTokens(["CATK", "CBTK", "CETH", "ROWAN"]),
            keplrChainConfig: {},
            sifChainId: "sifchain-1",
        });
        if (account) {
            console.log("logging in to account with: " + account.mnemonic);
            yield sif.setPhrase(account.mnemonic);
        }
        return sif;
    });
}
exports.createTestSifService = createTestSifService;
// export async function createTestEthService() {
//   const eth = ethServiceInitializer({
//     assets: getTestingTokens(["ATK", "BTK", "ETH", "EROWAN"]),
//     getWeb3Provider,
//     peggyCompatibleCosmosBaseDenoms: new Set(["uphoton"]),
//   });
//   console.log("Connecting to eth service");
//   await eth.connect();
//   console.log("Finished connecting to eth service");
//   return eth;
// }
//# sourceMappingURL=services.js.map