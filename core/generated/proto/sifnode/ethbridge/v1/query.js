"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClientImpl = exports.QueryEthProphecyResponse = exports.QueryEthProphecyRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/oracle/v1/types");
const types_2 = require("../../../sifnode/ethbridge/v1/types");
exports.protobufPackage = "sifnode.ethbridge.v1";
const baseQueryEthProphecyRequest = {
    ethereumChainId: long_1.default.ZERO,
    bridgeContractAddress: "",
    nonce: long_1.default.ZERO,
    symbol: "",
    tokenContractAddress: "",
    ethereumSender: "",
};
exports.QueryEthProphecyRequest = {
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
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryEthProphecyRequest);
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
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryEthProphecyRequest);
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
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryEthProphecyRequest);
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
        return message;
    },
};
const baseQueryEthProphecyResponse = { id: "" };
exports.QueryEthProphecyResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.status !== undefined) {
            types_1.Status.encode(message.status, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.claims) {
            types_2.EthBridgeClaim.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryEthProphecyResponse);
        message.claims = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.status = types_1.Status.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.claims.push(types_2.EthBridgeClaim.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryEthProphecyResponse);
        message.claims = [];
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = types_1.Status.fromJSON(object.status);
        }
        else {
            message.status = undefined;
        }
        if (object.claims !== undefined && object.claims !== null) {
            for (const e of object.claims) {
                message.claims.push(types_2.EthBridgeClaim.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.status !== undefined &&
            (obj.status = message.status ? types_1.Status.toJSON(message.status) : undefined);
        if (message.claims) {
            obj.claims = message.claims.map((e) => e ? types_2.EthBridgeClaim.toJSON(e) : undefined);
        }
        else {
            obj.claims = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryEthProphecyResponse);
        message.claims = [];
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = types_1.Status.fromPartial(object.status);
        }
        else {
            message.status = undefined;
        }
        if (object.claims !== undefined && object.claims !== null) {
            for (const e of object.claims) {
                message.claims.push(types_2.EthBridgeClaim.fromPartial(e));
            }
        }
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.EthProphecy = this.EthProphecy.bind(this);
    }
    EthProphecy(request) {
        const data = exports.QueryEthProphecyRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.ethbridge.v1.Query", "EthProphecy", data);
        return promise.then((data) => exports.QueryEthProphecyResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=query.js.map