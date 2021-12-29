"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgDeregisterResponse = exports.MsgDeregister = exports.MsgSetRegistryResponse = exports.MsgSetRegistry = exports.MsgRegisterResponse = exports.MsgRegister = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/tokenregistry/v1/types");
exports.protobufPackage = "sifnode.tokenregistry.v1";
const baseMsgRegister = { from: "" };
exports.MsgRegister = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.from !== "") {
            writer.uint32(10).string(message.from);
        }
        if (message.entry !== undefined) {
            types_1.RegistryEntry.encode(message.entry, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRegister);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.from = reader.string();
                    break;
                case 2:
                    message.entry = types_1.RegistryEntry.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgRegister);
        if (object.from !== undefined && object.from !== null) {
            message.from = String(object.from);
        }
        else {
            message.from = "";
        }
        if (object.entry !== undefined && object.entry !== null) {
            message.entry = types_1.RegistryEntry.fromJSON(object.entry);
        }
        else {
            message.entry = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.from !== undefined && (obj.from = message.from);
        message.entry !== undefined &&
            (obj.entry = message.entry
                ? types_1.RegistryEntry.toJSON(message.entry)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgRegister);
        if (object.from !== undefined && object.from !== null) {
            message.from = object.from;
        }
        else {
            message.from = "";
        }
        if (object.entry !== undefined && object.entry !== null) {
            message.entry = types_1.RegistryEntry.fromPartial(object.entry);
        }
        else {
            message.entry = undefined;
        }
        return message;
    },
};
const baseMsgRegisterResponse = {};
exports.MsgRegisterResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRegisterResponse);
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
        const message = Object.assign({}, baseMsgRegisterResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgRegisterResponse);
        return message;
    },
};
const baseMsgSetRegistry = { from: "" };
exports.MsgSetRegistry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.from !== "") {
            writer.uint32(10).string(message.from);
        }
        if (message.registry !== undefined) {
            types_1.Registry.encode(message.registry, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSetRegistry);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.from = reader.string();
                    break;
                case 2:
                    message.registry = types_1.Registry.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSetRegistry);
        if (object.from !== undefined && object.from !== null) {
            message.from = String(object.from);
        }
        else {
            message.from = "";
        }
        if (object.registry !== undefined && object.registry !== null) {
            message.registry = types_1.Registry.fromJSON(object.registry);
        }
        else {
            message.registry = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.from !== undefined && (obj.from = message.from);
        message.registry !== undefined &&
            (obj.registry = message.registry
                ? types_1.Registry.toJSON(message.registry)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSetRegistry);
        if (object.from !== undefined && object.from !== null) {
            message.from = object.from;
        }
        else {
            message.from = "";
        }
        if (object.registry !== undefined && object.registry !== null) {
            message.registry = types_1.Registry.fromPartial(object.registry);
        }
        else {
            message.registry = undefined;
        }
        return message;
    },
};
const baseMsgSetRegistryResponse = {};
exports.MsgSetRegistryResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSetRegistryResponse);
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
        const message = Object.assign({}, baseMsgSetRegistryResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSetRegistryResponse);
        return message;
    },
};
const baseMsgDeregister = { from: "", denom: "" };
exports.MsgDeregister = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.from !== "") {
            writer.uint32(10).string(message.from);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgDeregister);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.from = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgDeregister);
        if (object.from !== undefined && object.from !== null) {
            message.from = String(object.from);
        }
        else {
            message.from = "";
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = String(object.denom);
        }
        else {
            message.denom = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.from !== undefined && (obj.from = message.from);
        message.denom !== undefined && (obj.denom = message.denom);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgDeregister);
        if (object.from !== undefined && object.from !== null) {
            message.from = object.from;
        }
        else {
            message.from = "";
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        else {
            message.denom = "";
        }
        return message;
    },
};
const baseMsgDeregisterResponse = {};
exports.MsgDeregisterResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgDeregisterResponse);
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
        const message = Object.assign({}, baseMsgDeregisterResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgDeregisterResponse);
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.Register = this.Register.bind(this);
        this.Deregister = this.Deregister.bind(this);
        this.SetRegistry = this.SetRegistry.bind(this);
    }
    Register(request) {
        const data = exports.MsgRegister.encode(request).finish();
        const promise = this.rpc.request("sifnode.tokenregistry.v1.Msg", "Register", data);
        return promise.then((data) => exports.MsgRegisterResponse.decode(new minimal_1.default.Reader(data)));
    }
    Deregister(request) {
        const data = exports.MsgDeregister.encode(request).finish();
        const promise = this.rpc.request("sifnode.tokenregistry.v1.Msg", "Deregister", data);
        return promise.then((data) => exports.MsgDeregisterResponse.decode(new minimal_1.default.Reader(data)));
    }
    SetRegistry(request) {
        const data = exports.MsgSetRegistry.encode(request).finish();
        const promise = this.rpc.request("sifnode.tokenregistry.v1.Msg", "SetRegistry", data);
        return promise.then((data) => exports.MsgSetRegistryResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=tx.js.map