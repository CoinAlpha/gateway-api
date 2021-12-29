"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClientImpl = exports.LiquidityProvidersRes = exports.LiquidityProvidersReq = exports.LiquidityProviderListRes = exports.LiquidityProviderListReq = exports.LiquidityProviderDataRes = exports.LiquidityProviderDataReq = exports.AssetListRes = exports.AssetListReq = exports.LiquidityProviderRes = exports.LiquidityProviderReq = exports.PoolsRes = exports.PoolsReq = exports.PoolRes = exports.PoolReq = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/clp/v1/types");
const pagination_1 = require("../../../cosmos/base/query/v1beta1/pagination");
exports.protobufPackage = "sifnode.clp.v1";
const basePoolReq = { symbol: "" };
exports.PoolReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePoolReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.symbol = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePoolReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePoolReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        return message;
    },
};
const basePoolRes = { clpModuleAddress: "", height: long_1.default.ZERO };
exports.PoolRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pool !== undefined) {
            types_1.Pool.encode(message.pool, writer.uint32(10).fork()).ldelim();
        }
        if (message.clpModuleAddress !== "") {
            writer.uint32(18).string(message.clpModuleAddress);
        }
        if (!message.height.isZero()) {
            writer.uint32(24).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePoolRes);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pool = types_1.Pool.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.clpModuleAddress = reader.string();
                    break;
                case 3:
                    message.height = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePoolRes);
        if (object.pool !== undefined && object.pool !== null) {
            message.pool = types_1.Pool.fromJSON(object.pool);
        }
        else {
            message.pool = undefined;
        }
        if (object.clpModuleAddress !== undefined &&
            object.clpModuleAddress !== null) {
            message.clpModuleAddress = String(object.clpModuleAddress);
        }
        else {
            message.clpModuleAddress = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.pool !== undefined &&
            (obj.pool = message.pool ? types_1.Pool.toJSON(message.pool) : undefined);
        message.clpModuleAddress !== undefined &&
            (obj.clpModuleAddress = message.clpModuleAddress);
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePoolRes);
        if (object.pool !== undefined && object.pool !== null) {
            message.pool = types_1.Pool.fromPartial(object.pool);
        }
        else {
            message.pool = undefined;
        }
        if (object.clpModuleAddress !== undefined &&
            object.clpModuleAddress !== null) {
            message.clpModuleAddress = object.clpModuleAddress;
        }
        else {
            message.clpModuleAddress = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
};
const basePoolsReq = {};
exports.PoolsReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePoolsReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePoolsReq);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePoolsReq);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const basePoolsRes = { clpModuleAddress: "", height: long_1.default.ZERO };
exports.PoolsRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.pools) {
            types_1.Pool.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.clpModuleAddress !== "") {
            writer.uint32(18).string(message.clpModuleAddress);
        }
        if (!message.height.isZero()) {
            writer.uint32(24).int64(message.height);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePoolsRes);
        message.pools = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pools.push(types_1.Pool.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.clpModuleAddress = reader.string();
                    break;
                case 3:
                    message.height = reader.int64();
                    break;
                case 4:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePoolsRes);
        message.pools = [];
        if (object.pools !== undefined && object.pools !== null) {
            for (const e of object.pools) {
                message.pools.push(types_1.Pool.fromJSON(e));
            }
        }
        if (object.clpModuleAddress !== undefined &&
            object.clpModuleAddress !== null) {
            message.clpModuleAddress = String(object.clpModuleAddress);
        }
        else {
            message.clpModuleAddress = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.pools) {
            obj.pools = message.pools.map((e) => (e ? types_1.Pool.toJSON(e) : undefined));
        }
        else {
            obj.pools = [];
        }
        message.clpModuleAddress !== undefined &&
            (obj.clpModuleAddress = message.clpModuleAddress);
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageResponse.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePoolsRes);
        message.pools = [];
        if (object.pools !== undefined && object.pools !== null) {
            for (const e of object.pools) {
                message.pools.push(types_1.Pool.fromPartial(e));
            }
        }
        if (object.clpModuleAddress !== undefined &&
            object.clpModuleAddress !== null) {
            message.clpModuleAddress = object.clpModuleAddress;
        }
        else {
            message.clpModuleAddress = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProviderReq = { symbol: "", lpAddress: "" };
exports.LiquidityProviderReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        if (message.lpAddress !== "") {
            writer.uint32(18).string(message.lpAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.symbol = reader.string();
                    break;
                case 2:
                    message.lpAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = String(object.lpAddress);
        }
        else {
            message.lpAddress = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = object.lpAddress;
        }
        else {
            message.lpAddress = "";
        }
        return message;
    },
};
const baseLiquidityProviderRes = {
    nativeAssetBalance: "",
    externalAssetBalance: "",
    height: long_1.default.ZERO,
};
exports.LiquidityProviderRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.liquidityProvider !== undefined) {
            types_1.LiquidityProvider.encode(message.liquidityProvider, writer.uint32(10).fork()).ldelim();
        }
        if (message.nativeAssetBalance !== "") {
            writer.uint32(18).string(message.nativeAssetBalance);
        }
        if (message.externalAssetBalance !== "") {
            writer.uint32(26).string(message.externalAssetBalance);
        }
        if (!message.height.isZero()) {
            writer.uint32(32).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderRes);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.liquidityProvider = types_1.LiquidityProvider.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.nativeAssetBalance = reader.string();
                    break;
                case 3:
                    message.externalAssetBalance = reader.string();
                    break;
                case 4:
                    message.height = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderRes);
        if (object.liquidityProvider !== undefined &&
            object.liquidityProvider !== null) {
            message.liquidityProvider = types_1.LiquidityProvider.fromJSON(object.liquidityProvider);
        }
        else {
            message.liquidityProvider = undefined;
        }
        if (object.nativeAssetBalance !== undefined &&
            object.nativeAssetBalance !== null) {
            message.nativeAssetBalance = String(object.nativeAssetBalance);
        }
        else {
            message.nativeAssetBalance = "";
        }
        if (object.externalAssetBalance !== undefined &&
            object.externalAssetBalance !== null) {
            message.externalAssetBalance = String(object.externalAssetBalance);
        }
        else {
            message.externalAssetBalance = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.liquidityProvider !== undefined &&
            (obj.liquidityProvider = message.liquidityProvider
                ? types_1.LiquidityProvider.toJSON(message.liquidityProvider)
                : undefined);
        message.nativeAssetBalance !== undefined &&
            (obj.nativeAssetBalance = message.nativeAssetBalance);
        message.externalAssetBalance !== undefined &&
            (obj.externalAssetBalance = message.externalAssetBalance);
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderRes);
        if (object.liquidityProvider !== undefined &&
            object.liquidityProvider !== null) {
            message.liquidityProvider = types_1.LiquidityProvider.fromPartial(object.liquidityProvider);
        }
        else {
            message.liquidityProvider = undefined;
        }
        if (object.nativeAssetBalance !== undefined &&
            object.nativeAssetBalance !== null) {
            message.nativeAssetBalance = object.nativeAssetBalance;
        }
        else {
            message.nativeAssetBalance = "";
        }
        if (object.externalAssetBalance !== undefined &&
            object.externalAssetBalance !== null) {
            message.externalAssetBalance = object.externalAssetBalance;
        }
        else {
            message.externalAssetBalance = "";
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        return message;
    },
};
const baseAssetListReq = { lpAddress: "" };
exports.AssetListReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.lpAddress !== "") {
            writer.uint32(10).string(message.lpAddress);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAssetListReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lpAddress = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAssetListReq);
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = String(object.lpAddress);
        }
        else {
            message.lpAddress = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAssetListReq);
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = object.lpAddress;
        }
        else {
            message.lpAddress = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseAssetListRes = { height: long_1.default.ZERO };
exports.AssetListRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.assets) {
            types_1.Asset.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAssetListRes);
        message.assets = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.assets.push(types_1.Asset.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAssetListRes);
        message.assets = [];
        if (object.assets !== undefined && object.assets !== null) {
            for (const e of object.assets) {
                message.assets.push(types_1.Asset.fromJSON(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.assets) {
            obj.assets = message.assets.map((e) => (e ? types_1.Asset.toJSON(e) : undefined));
        }
        else {
            obj.assets = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageResponse.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAssetListRes);
        message.assets = [];
        if (object.assets !== undefined && object.assets !== null) {
            for (const e of object.assets) {
                message.assets.push(types_1.Asset.fromPartial(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProviderDataReq = { lpAddress: "" };
exports.LiquidityProviderDataReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.lpAddress !== "") {
            writer.uint32(10).string(message.lpAddress);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderDataReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lpAddress = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderDataReq);
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = String(object.lpAddress);
        }
        else {
            message.lpAddress = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderDataReq);
        if (object.lpAddress !== undefined && object.lpAddress !== null) {
            message.lpAddress = object.lpAddress;
        }
        else {
            message.lpAddress = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProviderDataRes = { height: long_1.default.ZERO };
exports.LiquidityProviderDataRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.liquidityProviderData) {
            types_1.LiquidityProviderData.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderDataRes);
        message.liquidityProviderData = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.liquidityProviderData.push(types_1.LiquidityProviderData.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderDataRes);
        message.liquidityProviderData = [];
        if (object.liquidityProviderData !== undefined &&
            object.liquidityProviderData !== null) {
            for (const e of object.liquidityProviderData) {
                message.liquidityProviderData.push(types_1.LiquidityProviderData.fromJSON(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.liquidityProviderData) {
            obj.liquidityProviderData = message.liquidityProviderData.map((e) => e ? types_1.LiquidityProviderData.toJSON(e) : undefined);
        }
        else {
            obj.liquidityProviderData = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderDataRes);
        message.liquidityProviderData = [];
        if (object.liquidityProviderData !== undefined &&
            object.liquidityProviderData !== null) {
            for (const e of object.liquidityProviderData) {
                message.liquidityProviderData.push(types_1.LiquidityProviderData.fromPartial(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProviderListReq = { symbol: "" };
exports.LiquidityProviderListReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.symbol !== "") {
            writer.uint32(10).string(message.symbol);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderListReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.symbol = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderListReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderListReq);
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProviderListRes = { height: long_1.default.ZERO };
exports.LiquidityProviderListRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.liquidityProviders) {
            types_1.LiquidityProvider.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProviderListRes);
        message.liquidityProviders = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.liquidityProviders.push(types_1.LiquidityProvider.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProviderListRes);
        message.liquidityProviders = [];
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromJSON(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.liquidityProviders) {
            obj.liquidityProviders = message.liquidityProviders.map((e) => e ? types_1.LiquidityProvider.toJSON(e) : undefined);
        }
        else {
            obj.liquidityProviders = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageResponse.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProviderListRes);
        message.liquidityProviders = [];
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromPartial(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProvidersReq = {};
exports.LiquidityProvidersReq = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProvidersReq);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProvidersReq);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProvidersReq);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseLiquidityProvidersRes = { height: long_1.default.ZERO };
exports.LiquidityProvidersRes = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.liquidityProviders) {
            types_1.LiquidityProvider.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLiquidityProvidersRes);
        message.liquidityProviders = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.liquidityProviders.push(types_1.LiquidityProvider.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseLiquidityProvidersRes);
        message.liquidityProviders = [];
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromJSON(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = long_1.default.fromString(object.height);
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.liquidityProviders) {
            obj.liquidityProviders = message.liquidityProviders.map((e) => e ? types_1.LiquidityProvider.toJSON(e) : undefined);
        }
        else {
            obj.liquidityProviders = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageResponse.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseLiquidityProvidersRes);
        message.liquidityProviders = [];
        if (object.liquidityProviders !== undefined &&
            object.liquidityProviders !== null) {
            for (const e of object.liquidityProviders) {
                message.liquidityProviders.push(types_1.LiquidityProvider.fromPartial(e));
            }
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = long_1.default.ZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.GetPool = this.GetPool.bind(this);
        this.GetPools = this.GetPools.bind(this);
        this.GetLiquidityProvider = this.GetLiquidityProvider.bind(this);
        this.GetLiquidityProviderData = this.GetLiquidityProviderData.bind(this);
        this.GetAssetList = this.GetAssetList.bind(this);
        this.GetLiquidityProviders = this.GetLiquidityProviders.bind(this);
        this.GetLiquidityProviderList = this.GetLiquidityProviderList.bind(this);
    }
    GetPool(request) {
        const data = exports.PoolReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetPool", data);
        return promise.then((data) => exports.PoolRes.decode(new minimal_1.default.Reader(data)));
    }
    GetPools(request) {
        const data = exports.PoolsReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetPools", data);
        return promise.then((data) => exports.PoolsRes.decode(new minimal_1.default.Reader(data)));
    }
    GetLiquidityProvider(request) {
        const data = exports.LiquidityProviderReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetLiquidityProvider", data);
        return promise.then((data) => exports.LiquidityProviderRes.decode(new minimal_1.default.Reader(data)));
    }
    GetLiquidityProviderData(request) {
        const data = exports.LiquidityProviderDataReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetLiquidityProviderData", data);
        return promise.then((data) => exports.LiquidityProviderDataRes.decode(new minimal_1.default.Reader(data)));
    }
    GetAssetList(request) {
        const data = exports.AssetListReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetAssetList", data);
        return promise.then((data) => exports.AssetListRes.decode(new minimal_1.default.Reader(data)));
    }
    GetLiquidityProviders(request) {
        const data = exports.LiquidityProvidersReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetLiquidityProviders", data);
        return promise.then((data) => exports.LiquidityProvidersRes.decode(new minimal_1.default.Reader(data)));
    }
    GetLiquidityProviderList(request) {
        const data = exports.LiquidityProviderListReq.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Query", "GetLiquidityProviderList", data);
        return promise.then((data) => exports.LiquidityProviderListRes.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=querier.js.map