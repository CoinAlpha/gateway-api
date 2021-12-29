"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "sifnode.clp.v1";
const baseParams = { minCreatePoolThreshold: long_1.default.UZERO };
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.minCreatePoolThreshold.isZero()) {
            writer.uint32(8).uint64(message.minCreatePoolThreshold);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParams);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.minCreatePoolThreshold = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParams);
        if (object.minCreatePoolThreshold !== undefined &&
            object.minCreatePoolThreshold !== null) {
            message.minCreatePoolThreshold = long_1.default.fromString(object.minCreatePoolThreshold);
        }
        else {
            message.minCreatePoolThreshold = long_1.default.UZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.minCreatePoolThreshold !== undefined &&
            (obj.minCreatePoolThreshold = (message.minCreatePoolThreshold || long_1.default.UZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParams);
        if (object.minCreatePoolThreshold !== undefined &&
            object.minCreatePoolThreshold !== null) {
            message.minCreatePoolThreshold = object.minCreatePoolThreshold;
        }
        else {
            message.minCreatePoolThreshold = long_1.default.UZERO;
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=params.js.map