"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgRescueCethResponse = exports.MsgRescueCeth = exports.MsgUpdateCethReceiverAccountResponse = exports.MsgUpdateCethReceiverAccount = exports.MsgUpdateWhiteListValidatorResponse = exports.MsgUpdateWhiteListValidator = exports.MsgCreateEthBridgeClaimResponse = exports.MsgCreateEthBridgeClaim = exports.MsgBurnResponse = exports.MsgBurn = exports.MsgLockResponse = exports.MsgLock = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/ethbridge/v1/types");
exports.protobufPackage = "sifnode.ethbridge.v1";
const baseMsgLock = {
    cosmosSender: "",
    amount: "",
    symbol: "",
    ethereumChainId: long_1.default.ZERO,
    ethereumReceiver: "",
    cethAmount: "",
};
exports.MsgLock = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cosmosSender !== "") {
            writer.uint32(10).string(message.cosmosSender);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        if (message.symbol !== "") {
            writer.uint32(26).string(message.symbol);
        }
        if (!message.ethereumChainId.isZero()) {
            writer.uint32(32).int64(message.ethereumChainId);
        }
        if (message.ethereumReceiver !== "") {
            writer.uint32(42).string(message.ethereumReceiver);
        }
        if (message.cethAmount !== "") {
            writer.uint32(50).string(message.cethAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgLock);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cosmosSender = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                case 3:
                    message.symbol = reader.string();
                    break;
                case 4:
                    message.ethereumChainId = reader.int64();
                    break;
                case 5:
                    message.ethereumReceiver = reader.string();
                    break;
                case 6:
                    message.cethAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgLock);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = String(object.cosmosSender);
        }
        else {
            message.cosmosSender = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = String(object.amount);
        }
        else {
            message.amount = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = long_1.default.fromString(object.ethereumChainId);
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.ethereumReceiver !== undefined &&
            object.ethereumReceiver !== null) {
            message.ethereumReceiver = String(object.ethereumReceiver);
        }
        else {
            message.ethereumReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = String(object.cethAmount);
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cosmosSender !== undefined &&
            (obj.cosmosSender = message.cosmosSender);
        message.amount !== undefined && (obj.amount = message.amount);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.ethereumChainId !== undefined &&
            (obj.ethereumChainId = (message.ethereumChainId || long_1.default.ZERO).toString());
        message.ethereumReceiver !== undefined &&
            (obj.ethereumReceiver = message.ethereumReceiver);
        message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgLock);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = object.cosmosSender;
        }
        else {
            message.cosmosSender = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        else {
            message.amount = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = object.ethereumChainId;
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.ethereumReceiver !== undefined &&
            object.ethereumReceiver !== null) {
            message.ethereumReceiver = object.ethereumReceiver;
        }
        else {
            message.ethereumReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = object.cethAmount;
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
};
const baseMsgLockResponse = {};
exports.MsgLockResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgLockResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgLockResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgLockResponse);
        return message;
    },
};
const baseMsgBurn = {
    cosmosSender: "",
    amount: "",
    symbol: "",
    ethereumChainId: long_1.default.ZERO,
    ethereumReceiver: "",
    cethAmount: "",
};
exports.MsgBurn = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cosmosSender !== "") {
            writer.uint32(10).string(message.cosmosSender);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        if (message.symbol !== "") {
            writer.uint32(26).string(message.symbol);
        }
        if (!message.ethereumChainId.isZero()) {
            writer.uint32(32).int64(message.ethereumChainId);
        }
        if (message.ethereumReceiver !== "") {
            writer.uint32(42).string(message.ethereumReceiver);
        }
        if (message.cethAmount !== "") {
            writer.uint32(50).string(message.cethAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgBurn);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cosmosSender = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                case 3:
                    message.symbol = reader.string();
                    break;
                case 4:
                    message.ethereumChainId = reader.int64();
                    break;
                case 5:
                    message.ethereumReceiver = reader.string();
                    break;
                case 6:
                    message.cethAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgBurn);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = String(object.cosmosSender);
        }
        else {
            message.cosmosSender = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = String(object.amount);
        }
        else {
            message.amount = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = long_1.default.fromString(object.ethereumChainId);
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.ethereumReceiver !== undefined &&
            object.ethereumReceiver !== null) {
            message.ethereumReceiver = String(object.ethereumReceiver);
        }
        else {
            message.ethereumReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = String(object.cethAmount);
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cosmosSender !== undefined &&
            (obj.cosmosSender = message.cosmosSender);
        message.amount !== undefined && (obj.amount = message.amount);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.ethereumChainId !== undefined &&
            (obj.ethereumChainId = (message.ethereumChainId || long_1.default.ZERO).toString());
        message.ethereumReceiver !== undefined &&
            (obj.ethereumReceiver = message.ethereumReceiver);
        message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgBurn);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = object.cosmosSender;
        }
        else {
            message.cosmosSender = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        else {
            message.amount = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.ethereumChainId !== undefined &&
            object.ethereumChainId !== null) {
            message.ethereumChainId = object.ethereumChainId;
        }
        else {
            message.ethereumChainId = long_1.default.ZERO;
        }
        if (object.ethereumReceiver !== undefined &&
            object.ethereumReceiver !== null) {
            message.ethereumReceiver = object.ethereumReceiver;
        }
        else {
            message.ethereumReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = object.cethAmount;
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
};
const baseMsgBurnResponse = {};
exports.MsgBurnResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgBurnResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgBurnResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgBurnResponse);
        return message;
    },
};
const baseMsgCreateEthBridgeClaim = {};
exports.MsgCreateEthBridgeClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ethBridgeClaim !== undefined) {
            types_1.EthBridgeClaim.encode(message.ethBridgeClaim, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateEthBridgeClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ethBridgeClaim = types_1.EthBridgeClaim.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgCreateEthBridgeClaim);
        if (object.ethBridgeClaim !== undefined && object.ethBridgeClaim !== null) {
            message.ethBridgeClaim = types_1.EthBridgeClaim.fromJSON(object.ethBridgeClaim);
        }
        else {
            message.ethBridgeClaim = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.ethBridgeClaim !== undefined &&
            (obj.ethBridgeClaim = message.ethBridgeClaim
                ? types_1.EthBridgeClaim.toJSON(message.ethBridgeClaim)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgCreateEthBridgeClaim);
        if (object.ethBridgeClaim !== undefined && object.ethBridgeClaim !== null) {
            message.ethBridgeClaim = types_1.EthBridgeClaim.fromPartial(object.ethBridgeClaim);
        }
        else {
            message.ethBridgeClaim = undefined;
        }
        return message;
    },
};
const baseMsgCreateEthBridgeClaimResponse = {};
exports.MsgCreateEthBridgeClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateEthBridgeClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgCreateEthBridgeClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgCreateEthBridgeClaimResponse);
        return message;
    },
};
const baseMsgUpdateWhiteListValidator = {
    cosmosSender: "",
    validator: "",
    operationType: "",
};
exports.MsgUpdateWhiteListValidator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cosmosSender !== "") {
            writer.uint32(10).string(message.cosmosSender);
        }
        if (message.validator !== "") {
            writer.uint32(18).string(message.validator);
        }
        if (message.operationType !== "") {
            writer.uint32(26).string(message.operationType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgUpdateWhiteListValidator);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cosmosSender = reader.string();
                    break;
                case 2:
                    message.validator = reader.string();
                    break;
                case 3:
                    message.operationType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgUpdateWhiteListValidator);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = String(object.cosmosSender);
        }
        else {
            message.cosmosSender = "";
        }
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = String(object.validator);
        }
        else {
            message.validator = "";
        }
        if (object.operationType !== undefined && object.operationType !== null) {
            message.operationType = String(object.operationType);
        }
        else {
            message.operationType = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cosmosSender !== undefined &&
            (obj.cosmosSender = message.cosmosSender);
        message.validator !== undefined && (obj.validator = message.validator);
        message.operationType !== undefined &&
            (obj.operationType = message.operationType);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgUpdateWhiteListValidator);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = object.cosmosSender;
        }
        else {
            message.cosmosSender = "";
        }
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = object.validator;
        }
        else {
            message.validator = "";
        }
        if (object.operationType !== undefined && object.operationType !== null) {
            message.operationType = object.operationType;
        }
        else {
            message.operationType = "";
        }
        return message;
    },
};
const baseMsgUpdateWhiteListValidatorResponse = {};
exports.MsgUpdateWhiteListValidatorResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgUpdateWhiteListValidatorResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgUpdateWhiteListValidatorResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgUpdateWhiteListValidatorResponse);
        return message;
    },
};
const baseMsgUpdateCethReceiverAccount = {
    cosmosSender: "",
    cethReceiverAccount: "",
};
exports.MsgUpdateCethReceiverAccount = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cosmosSender !== "") {
            writer.uint32(10).string(message.cosmosSender);
        }
        if (message.cethReceiverAccount !== "") {
            writer.uint32(18).string(message.cethReceiverAccount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccount);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cosmosSender = reader.string();
                    break;
                case 2:
                    message.cethReceiverAccount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccount);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = String(object.cosmosSender);
        }
        else {
            message.cosmosSender = "";
        }
        if (object.cethReceiverAccount !== undefined &&
            object.cethReceiverAccount !== null) {
            message.cethReceiverAccount = String(object.cethReceiverAccount);
        }
        else {
            message.cethReceiverAccount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cosmosSender !== undefined &&
            (obj.cosmosSender = message.cosmosSender);
        message.cethReceiverAccount !== undefined &&
            (obj.cethReceiverAccount = message.cethReceiverAccount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccount);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = object.cosmosSender;
        }
        else {
            message.cosmosSender = "";
        }
        if (object.cethReceiverAccount !== undefined &&
            object.cethReceiverAccount !== null) {
            message.cethReceiverAccount = object.cethReceiverAccount;
        }
        else {
            message.cethReceiverAccount = "";
        }
        return message;
    },
};
const baseMsgUpdateCethReceiverAccountResponse = {};
exports.MsgUpdateCethReceiverAccountResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccountResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccountResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgUpdateCethReceiverAccountResponse);
        return message;
    },
};
const baseMsgRescueCeth = {
    cosmosSender: "",
    cosmosReceiver: "",
    cethAmount: "",
};
exports.MsgRescueCeth = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cosmosSender !== "") {
            writer.uint32(10).string(message.cosmosSender);
        }
        if (message.cosmosReceiver !== "") {
            writer.uint32(18).string(message.cosmosReceiver);
        }
        if (message.cethAmount !== "") {
            writer.uint32(26).string(message.cethAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRescueCeth);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cosmosSender = reader.string();
                    break;
                case 2:
                    message.cosmosReceiver = reader.string();
                    break;
                case 3:
                    message.cethAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgRescueCeth);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = String(object.cosmosSender);
        }
        else {
            message.cosmosSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = String(object.cosmosReceiver);
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = String(object.cethAmount);
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cosmosSender !== undefined &&
            (obj.cosmosSender = message.cosmosSender);
        message.cosmosReceiver !== undefined &&
            (obj.cosmosReceiver = message.cosmosReceiver);
        message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgRescueCeth);
        if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
            message.cosmosSender = object.cosmosSender;
        }
        else {
            message.cosmosSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = object.cosmosReceiver;
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.cethAmount !== undefined && object.cethAmount !== null) {
            message.cethAmount = object.cethAmount;
        }
        else {
            message.cethAmount = "";
        }
        return message;
    },
};
const baseMsgRescueCethResponse = {};
exports.MsgRescueCethResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRescueCethResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgRescueCethResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgRescueCethResponse);
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.Lock = this.Lock.bind(this);
        this.Burn = this.Burn.bind(this);
        this.CreateEthBridgeClaim = this.CreateEthBridgeClaim.bind(this);
        this.UpdateWhiteListValidator = this.UpdateWhiteListValidator.bind(this);
        this.UpdateCethReceiverAccount = this.UpdateCethReceiverAccount.bind(this);
        this.RescueCeth = this.RescueCeth.bind(this);
    }
    Lock(request) {
        const data = exports.MsgLock.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "Lock", data);
        return promise.then((data) => exports.MsgLockResponse.decode(new minimal_1.default.Reader(data)));
    }
    Burn(request) {
        const data = exports.MsgBurn.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "Burn", data);
        return promise.then((data) => exports.MsgBurnResponse.decode(new minimal_1.default.Reader(data)));
    }
    CreateEthBridgeClaim(request) {
        const data = exports.MsgCreateEthBridgeClaim.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "CreateEthBridgeClaim", data);
        return promise.then((data) => exports.MsgCreateEthBridgeClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    UpdateWhiteListValidator(request) {
        const data = exports.MsgUpdateWhiteListValidator.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "UpdateWhiteListValidator", data);
        return promise.then((data) => exports.MsgUpdateWhiteListValidatorResponse.decode(new minimal_1.default.Reader(data)));
    }
    UpdateCethReceiverAccount(request) {
        const data = exports.MsgUpdateCethReceiverAccount.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "UpdateCethReceiverAccount", data);
        return promise.then((data) => exports.MsgUpdateCethReceiverAccountResponse.decode(new minimal_1.default.Reader(data)));
    }
    RescueCeth(request) {
        const data = exports.MsgRescueCeth.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "RescueCeth", data);
        return promise.then((data) => exports.MsgRescueCethResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=tx.js.map