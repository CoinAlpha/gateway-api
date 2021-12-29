"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainConfigByNetworkEnv = void 0;
const getEnv_1 = require("../getEnv");
const entities_1 = require("../../entities");
const ethereum_1 = __importDefault(require("./ethereum"));
const sifchain_1 = __importDefault(require("./sifchain"));
const cosmoshub_1 = __importDefault(require("./cosmoshub"));
const iris_1 = __importDefault(require("./iris"));
const akash_1 = __importDefault(require("./akash"));
const sentinel_1 = __importDefault(require("./sentinel"));
const crypto_org_1 = __importDefault(require("./crypto-org"));
const persistence_1 = __importDefault(require("./persistence"));
const regen_1 = __importDefault(require("./regen"));
const osmosis_1 = __importDefault(require("./osmosis"));
const terra_1 = __importDefault(require("./terra"));
const juno_1 = __importDefault(require("./juno"));
const ixo_1 = __importDefault(require("./ixo"));
const band_1 = __importDefault(require("./band"));
const likecoin_1 = __importDefault(require("./likecoin"));
const emoney_1 = __importDefault(require("./emoney"));
exports.chainConfigByNetworkEnv = Object.fromEntries(Object.values(getEnv_1.NetworkEnv).map((env) => {
    return [
        env,
        {
            [entities_1.Network.SIFCHAIN]: sifchain_1.default[env],
            [entities_1.Network.COSMOSHUB]: cosmoshub_1.default[env],
            [entities_1.Network.IRIS]: iris_1.default[env],
            [entities_1.Network.AKASH]: akash_1.default[env],
            [entities_1.Network.SENTINEL]: sentinel_1.default[env],
            [entities_1.Network.ETHEREUM]: ethereum_1.default[env],
            [entities_1.Network.CRYPTO_ORG]: crypto_org_1.default[env],
            [entities_1.Network.OSMOSIS]: osmosis_1.default[env],
            [entities_1.Network.PERSISTENCE]: persistence_1.default[env],
            [entities_1.Network.REGEN]: regen_1.default[env],
            [entities_1.Network.TERRA]: terra_1.default[env],
            [entities_1.Network.JUNO]: juno_1.default[env],
            [entities_1.Network.IXO]: ixo_1.default[env],
            [entities_1.Network.BAND]: band_1.default[env],
            // [Network.BITSONG]: bitsong[env],
            [entities_1.Network.LIKECOIN]: likecoin_1.default[env],
            [entities_1.Network.EMONEY]: emoney_1.default[env],
        },
    ];
}));
//# sourceMappingURL=index.js.map