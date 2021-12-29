"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClientImpl = exports.QueryEntriesRequest = exports.QueryEntriesResponse = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/tokenregistry/v1/types");
exports.protobufPackage = "sifnode.tokenregistry.v1";
const baseQueryEntriesResponse = {};
exports.QueryEntriesResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.registry !== undefined) {
            types_1.Registry.encode(message.registry, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryEntriesResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
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
        const message = Object.assign({}, baseQueryEntriesResponse);
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
        message.registry !== undefined &&
            (obj.registry = message.registry
                ? types_1.Registry.toJSON(message.registry)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryEntriesResponse);
        if (object.registry !== undefined && object.registry !== null) {
            message.registry = types_1.Registry.fromPartial(object.registry);
        }
        else {
            message.registry = undefined;
        }
        return message;
    },
};
const baseQueryEntriesRequest = {};
exports.QueryEntriesRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryEntriesRequest);
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
        const message = Object.assign({}, baseQueryEntriesRequest);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseQueryEntriesRequest);
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.Entries = this.Entries.bind(this);
    }
    Entries(request) {
        const data = exports.QueryEntriesRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.tokenregistry.v1.Query", "Entries", data);
        return promise.then((data) => exports.QueryEntriesResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=query.js.map