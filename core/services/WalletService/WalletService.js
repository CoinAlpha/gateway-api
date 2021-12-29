"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const entities_1 = require("../../entities");
const wallets_1 = require("../../clients/wallets");
class WalletService {
    constructor(context) {
        this.context = context;
        this.keplrProvider = new wallets_1.KeplrWalletProvider(this.context);
        this.metamaskProvider = new wallets_1.MetamaskWalletProvider(this.context);
        this.terraProvider = new wallets_1.TerraStationWalletProvider(this.context);
    }
    static create(context) {
        return new this(context);
    }
    getPreferredProvider(chain) {
        switch (chain.network) {
            case entities_1.Network.ETHEREUM:
                return this.metamaskProvider;
            case entities_1.Network.TERRA:
                return this.terraProvider;
            default:
                return this.keplrProvider;
        }
    }
    tryConnectAllWallets() {
        return this.keplrProvider.tryConnectAll(...this.context.chains.filter((chain) => !chain.chainConfig.hidden &&
            this.getPreferredProvider(chain) === this.keplrProvider));
    }
}
exports.WalletService = WalletService;
exports.default = WalletService.create.bind(WalletService);
//# sourceMappingURL=WalletService.js.map