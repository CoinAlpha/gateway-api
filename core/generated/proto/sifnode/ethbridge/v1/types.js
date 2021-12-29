"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisState = exports.PeggyTokens = exports.EthBridgeClaim = exports.claimTypeToJSON = exports.claimTypeFromJSON = exports.ClaimType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "sifnode.ethbridge.v1";
/** Claim type enum */
var ClaimType;
(function (ClaimType) {
    /** CLAIM_TYPE_UNSPECIFIED - Unspecified claim type */
    ClaimType[ClaimType["CLAIM_TYPE_UNSPECIFIED"] = 0] = "CLAIM_TYPE_UNSPECIFIED";
    /** CLAIM_TYPE_BURN - Burn claim type */
    ClaimType[ClaimType["CLAIM_TYPE_BURN"] = 1] = "CLAIM_TYPE_BURN";
    /** CLAIM_TYPE_LOCK - Lock claim type */
    ClaimType[ClaimType["CLAIM_TYPE_LOCK"] = 2] = "CLAIM_TYPE_LOCK";
    ClaimType[ClaimType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ClaimType = exports.ClaimType || (exports.ClaimType = {}));
function claimTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "CLAIM_TYPE_UNSPECIFIED":
            return ClaimType.CLAIM_TYPE_UNSPECIFIED;
        case 1:
        case "CLAIM_TYPE_BURN":
            return ClaimType.CLAIM_TYPE_BURN;
        case 2:
        case "CLAIM_TYPE_LOCK":
            return ClaimType.CLAIM_TYPE_LOCK;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ClaimType.UNRECOGNIZED;
    }
}
exports.claimTypeFromJSON = claimTypeFromJSON;
function claimTypeToJSON(object) {
    switch (object) {
        case ClaimType.CLAIM_TYPE_UNSPECIFIED:
            return "CLAIM_TYPE_UNSPECIFIED";
        case ClaimType.CLAIM_TYPE_BURN:
            return "CLAIM_TYPE_BURN";
        case ClaimType.CLAIM_TYPE_LOCK:
            return "CLAIM_TYPE_LOCK";
        default:
            return "UNKNOWN";
    }
}
exports.claimTypeToJSON = claimTypeToJSON;
const baseEthBridgeClaim = {
    ethereumChainId: long_1.default.ZERO,
    bridgeContractAddress: "",
    nonce: long_1.default.ZERO,
    symbol: "",
    tokenContractAddress: "",
    ethereumSender: "",
    cosmosReceiver: "",
    validatorAddress: "",
    amount: "",
    claimType: 0,
};
exports.EthBridgeClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.ethereumChainId.isZero()) {
            writer.uint32(8).int64(message.ethereumChainId);
        }
        if (message.bridgeContractAddress !== "") {
            writer.uint32(18).string(message.bridgeContractAddress);
        }
        if (!message.nonce.isZero()) {
            writer.uint32(24).int64(message.nonce);
        }
        if (message.symbol !== "") {
            writer.uint32(34).string(message.symbol);
        }
        if (message.tokenContractAddress !== "") {
            writer.uint32(42).string(message.tokenContractAddress);
        }
        if (message.ethereumSender !== "") {
            writer.uint32(50).string(message.ethereumSender);
        }
        if (message.cosmosReceiver !== "") {
            writer.uint32(58).string(message.cosmosReceiver);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(66).string(message.validatorAddress);
        }
        if (message.amount !== "") {
            writer.uint32(74).string(message.amount);
        }
        if (message.claimType !== 0) {
            writer.uint32(80).int32(message.claimType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseEthBridgeClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ethereumChainId = reader.int64();
                    break;
                case 2:
                    message.bridgeContractAddress = reader.string();
                    break;
                case 3:
                    message.nonce = reader.int64();
                    break;
                case 4:
                    message.symbol = reader.string();
                    break;
                case 5:
                    message.tokenContractAddress = reader.string();
                    break;
                case 6:
                    message.ethereumSender = reader.string();
                    break;
                case 7:
                    message.cosmosReceiver = reader.string();
                    break;
                case 8:
                    message.validatorAddress = reader.string();
                    break;
                case 9:
                    message.amount = reader.string();
                    break;
                case 10:
                    message.claimType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseEthBridgeClaim);
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = long_1.default.fromString(object.ethereumChainId);
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.bridgeContractAddress !== undefined &&
            object.bridgeContractAddress !== null) {
            message.bridgeContractAddress = String(object.bridgeContractAddress);
        }
        else {
            message.bridgeContractAddress = "";
        }
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = long_1.default.fromString(object.nonce);
        }
        else {
            message.nonce = long_1.default.ZERO;
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.tokenContractAddress !== undefined &&
            object.tokenContractAddress !== null) {
            message.tokenContractAddress = String(object.tokenContractAddress);
        }
        else {
            message.tokenContractAddress = "";
        }
        if (object.ethereumSender !== undefined && object.ethereumSender !== null) {
            message.ethereumSender = String(object.ethereumSender);
        }
        else {
            message.ethereumSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = String(object.cosmosReceiver);
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.validatorAddress !== undefined &&
            object.validatorAddress !== null) {
            message.validatorAddress = String(object.validatorAddress);
        }
        else {
            message.validatorAddress = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = String(object.amount);
        }
        else {
            message.amount = "";
        }
        if (object.claimType !== undefined && object.claimType !== null) {
            message.claimType = claimTypeFromJSON(object.claimType);
        }
        else {
            message.claimType = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.ethereumChainId !== undefined &&
            (obj.ethereumChainId = (message.ethereumChainId || long_1.default.ZERO).toString());
        message.bridgeContractAddress !== undefined &&
            (obj.bridgeContractAddress = message.bridgeContractAddress);
        message.nonce !== undefined &&
            (obj.nonce = (message.nonce || long_1.default.ZERO).toString());
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.tokenContractAddress !== undefined &&
            (obj.tokenContractAddress = message.tokenContractAddress);
        message.ethereumSender !== undefined &&
            (obj.ethereumSender = message.ethereumSender);
        message.cosmosReceiver !== undefined &&
            (obj.cosmosReceiver = message.cosmosReceiver);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.amount !== undefined && (obj.amount = message.amount);
        message.claimType !== undefined &&
            (obj.claimType = claimTypeToJSON(message.claimType));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseEthBridgeClaim);
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = object.ethereumChainId;
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.bridgeContractAddress !== undefined &&
            object.bridgeContractAddress !== null) {
            message.bridgeContractAddress = object.bridgeContractAddress;
        }
        else {
            message.bridgeContractAddress = "";
        }
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = object.nonce;
        }
        else {
            message.nonce = long_1.default.ZERO;
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.tokenContractAddress !== undefined &&
            object.tokenContractAddress !== null) {
            message.tokenContractAddress = object.tokenContractAddress;
        }
        else {
            message.tokenContractAddress = "";
        }
        if (object.ethereumSender !== undefined && object.ethereumSender !== null) {
            message.ethereumSender = object.ethereumSender;
        }
        else {
            message.ethereumSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = object.cosmosReceiver;
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.validatorAddress !== undefined &&
            object.validatorAddress !== null) {
            message.validatorAddress = object.validatorAddress;
        }
        else {
            message.validatorAddress = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        else {
            message.amount = "";
        }
        if (object.claimType !== undefined && object.claimType !== null) {
            message.claimType = object.claimType;
        }
        else {
            message.claimType = 0;
        }
        return message;
    },
};
const basePeggyTokens = { tokens: "" };
exports.PeggyTokens = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.tokens) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePeggyTokens);
        message.tokens = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.tokens.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePeggyTokens);
        message.tokens = [];
        if (object.tokens !== undefined && object.tokens !== null) {
            for (const e of object.tokens) {
                message.tokens.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.tokens) {
            obj.tokens = message.tokens.map((e) => e);
        }
        else {
            obj.tokens = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePeggyTokens);
        message.tokens = [];
        if (object.tokens !== undefined && object.tokens !== null) {
            for (const e of object.tokens) {
                message.tokens.push(e);
            }
        }
        return message;
    },
};
const baseGenesisState = { cethReceiveAccount: "", peggyTokens: "" };
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cethReceiveAccount !== "") {
            writer.uint32(10).string(message.cethReceiveAccount);
        }
        for (const v of message.peggyTokens) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        message.peggyTokens = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cethReceiveAccount = reader.string();
                    break;
                case 2:
                    message.peggyTokens.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseGenesisState);
        message.peggyTokens = [];
        if (object.cethReceiveAccount !== undefined &&
            object.cethReceiveAccount !== null) {
            message.cethReceiveAccount = String(object.cethReceiveAccount);
        }
        else {
            message.cethReceiveAccount = "";
        }
        if (object.peggyTokens !== undefined && object.peggyTokens !== null) {
            for (const e of object.peggyTokens) {
                message.peggyTokens.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cethReceiveAccount !== undefined &&
            (obj.cethReceiveAccount = message.cethReceiveAccount);
        if (message.peggyTokens) {
            obj.peggyTokens = message.peggyTokens.map((e) => e);
        }
        else {
            obj.peggyTokens = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        message.peggyTokens = [];
        if (object.cethReceiveAccount !== undefined &&
            object.cethReceiveAccount !== null) {
            message.cethReceiveAccount = object.cethReceiveAccount;
        }
        else {
            message.cethReceiveAccount = "";
        }
        if (object.peggyTokens !== undefined && object.peggyTokens !== null) {
            for (const e of object.peggyTokens) {
                message.peggyTokens.push(e);
            }
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=types.js.map