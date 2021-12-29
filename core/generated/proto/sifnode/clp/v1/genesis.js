"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisState = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const params_1 = require("../../../sifnode/clp/v1/params");
const types_1 = require("../../../sifnode/clp/v1/types");
exports.protobufPackage = "sifnode.clp.v1";
const baseGenesisState = { addressWhitelist: "" };
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.params !== undefined) {
            params_1.Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.addressWhitelist) {
            writer.uint32(18).string(v);
        }
        for (const v of message.poolList) {
            types_1.Pool.encode(v, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.liquidityProviders) {
            types_1.LiquidityProvider.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        message.addressWhitelist = [];
        message.poolList = [];
        message.liquidityProviders = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = params_1.Params.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.addressWhitelist.push(reader.string());
                    break;
                case 3:
                    message.poolList.push(types_1.Pool.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.liquidityProviders.push(types_1.LiquidityProvider.decode(reader, reader.uint32()));
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
        message.addressWhitelist = [];
        message.poolList = [];
        message.liquidityProviders = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = params_1.Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.addressWhitelist !== undefined &&
            object.addressWhitelist !== null) {
            for (const e of object.addressWhitelist) {
                message.addressWhitelist.push(String(e));
            }
        }
        if (object.poolList !== undefined && object.poolList !== null) {
            for (const e of object.poolList) {
                message.poolList.push(types_1.Pool.fromJSON(e));
            }
        }
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined &&
            (obj.params = message.params ? params_1.Params.toJSON(message.params) : undefined);
        if (message.addressWhitelist) {
            obj.addressWhitelist = message.addressWhitelist.map((e) => e);
        }
        else {
            obj.addressWhitelist = [];
        }
        if (message.poolList) {
            obj.poolList = message.poolList.map((e) => e ? types_1.Pool.toJSON(e) : undefined);
        }
        else {
            obj.poolList = [];
        }
        if (message.liquidityProviders) {
            obj.liquidityProviders = message.liquidityProviders.map((e) => e ? types_1.LiquidityProvider.toJSON(e) : undefined);
        }
        else {
            obj.liquidityProviders = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        message.addressWhitelist = [];
        message.poolList = [];
        message.liquidityProviders = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = params_1.Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.addressWhitelist !== undefined &&
            object.addressWhitelist !== null) {
            for (const e of object.addressWhitelist) {
                message.addressWhitelist.push(e);
            }
        }
        if (object.poolList !== undefined && object.poolList !== null) {
            for (const e of object.poolList) {
                message.poolList.push(types_1.Pool.fromPartial(e));
            }
        }
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromPartial(e));
            }
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=genesis.js.map