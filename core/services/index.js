"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServices = void 0;
const IBCService_1 = __importDefault(require("./IBCService/IBCService"));
const EthbridgeService_1 = __importDefault(require("./EthbridgeService"));
const SifService_1 = __importDefault(require("./SifService"));
const ClpService_1 = __importDefault(require("./ClpService"));
const EventBusService_1 = __importDefault(require("./EventBusService"));
const ChainsService_1 = __importDefault(require("./ChainsService/ChainsService"));
const DispensationService_1 = __importDefault(require("./DispensationService"));
const CryptoeconomicsService_1 = __importDefault(require("./CryptoeconomicsService"));
const StorageService_1 = __importDefault(require("./StorageService"));
const WalletService_1 = __importDefault(require("./WalletService"));
const TokenRegistryService_1 = __importDefault(require("./TokenRegistryService"));
const web3_1 = __importDefault(require("web3"));
function createServices(context) {
    const ChainsService = ChainsService_1.default(context);
    const IBCService = IBCService_1.default(context);
    const EthbridgeService = EthbridgeService_1.default(context);
    const SifService = SifService_1.default(context);
    const ClpService = ClpService_1.default(context);
    const EventBusService = EventBusService_1.default(context);
    const DispensationService = DispensationService_1.default(context);
    const CryptoeconomicsService = CryptoeconomicsService_1.default(context);
    const StorageService = StorageService_1.default(context);
    const WalletService = WalletService_1.default(Object.assign(Object.assign({}, context), { chains: ChainsService.list() }));
    const TokenRegistryService = TokenRegistryService_1.default(context);
    /*
  
      Let's leave the metadata logging in place at least until IBC is off the ground.
      I have to look this up for someone several times a day.
      
      - McCall
      
    */
    try {
        if (!globalThis.window)
            throw "";
        if (localStorage.DO_NOT_SPAM)
            throw "";
        if (location.hostname !== "dex.sifchain.finance") {
            setTimeout(() => {
                IBCService.logIBCNetworkMetadata();
            }, 8 * 1000);
        }
    }
    catch (e) { }
    return {
        Web3: web3_1.default,
        chains: ChainsService,
        ibc: IBCService,
        clp: ClpService,
        sif: SifService,
        ethbridge: EthbridgeService,
        bus: EventBusService,
        dispensation: DispensationService,
        cryptoeconomics: CryptoeconomicsService,
        storage: StorageService,
        wallet: WalletService,
        tokenRegistry: TokenRegistryService,
    };
}
exports.createServices = createServices;
//# sourceMappingURL=index.js.map