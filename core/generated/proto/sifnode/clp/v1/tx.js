"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgDecommissionPoolResponse = exports.MsgDecommissionPool = exports.MsgSwapResponse = exports.MsgSwap = exports.MsgAddLiquidityResponse = exports.MsgAddLiquidity = exports.MsgCreatePoolResponse = exports.MsgCreatePool = exports.MsgRemoveLiquidityResponse = exports.MsgRemoveLiquidity = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/clp/v1/types");
exports.protobufPackage = "sifnode.clp.v1";
const baseMsgRemoveLiquidity = {
    signer: "",
    wBasisPoints: "",
    asymmetry: "",
};
exports.MsgRemoveLiquidity = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signer !== "") {
            writer.uint32(10).string(message.signer);
        }
        if (message.externalAsset !== undefined) {
            types_1.Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
        }
        if (message.wBasisPoints !== "") {
            writer.uint32(26).string(message.wBasisPoints);
        }
        if (message.asymmetry !== "") {
            writer.uint32(34).string(message.asymmetry);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRemoveLiquidity);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signer = reader.string();
                    break;
                case 2:
                    message.externalAsset = types_1.Asset.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.wBasisPoints = reader.string();
                    break;
                case 4:
                    message.asymmetry = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgRemoveLiquidity);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = String(object.signer);
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromJSON(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.wBasisPoints !== undefined && object.wBasisPoints !== null) {
            message.wBasisPoints = String(object.wBasisPoints);
        }
        else {
            message.wBasisPoints = "";
        }
        if (object.asymmetry !== undefined && object.asymmetry !== null) {
            message.asymmetry = String(object.asymmetry);
        }
        else {
            message.asymmetry = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.signer !== undefined && (obj.signer = message.signer);
        message.externalAsset !== undefined &&
            (obj.externalAsset = message.externalAsset
                ? types_1.Asset.toJSON(message.externalAsset)
                : undefined);
        message.wBasisPoints !== undefined &&
            (obj.wBasisPoints = message.wBasisPoints);
        message.asymmetry !== undefined && (obj.asymmetry = message.asymmetry);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgRemoveLiquidity);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = object.signer;
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromPartial(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.wBasisPoints !== undefined && object.wBasisPoints !== null) {
            message.wBasisPoints = object.wBasisPoints;
        }
        else {
            message.wBasisPoints = "";
        }
        if (object.asymmetry !== undefined && object.asymmetry !== null) {
            message.asymmetry = object.asymmetry;
        }
        else {
            message.asymmetry = "";
        }
        return message;
    },
};
const baseMsgRemoveLiquidityResponse = {};
exports.MsgRemoveLiquidityResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRemoveLiquidityResponse);
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
        const message = Object.assign({}, baseMsgRemoveLiquidityResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgRemoveLiquidityResponse);
        return message;
    },
};
const baseMsgCreatePool = {
    signer: "",
    nativeAssetAmount: "",
    externalAssetAmount: "",
};
exports.MsgCreatePool = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signer !== "") {
            writer.uint32(10).string(message.signer);
        }
        if (message.externalAsset !== undefined) {
            types_1.Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
        }
        if (message.nativeAssetAmount !== "") {
            writer.uint32(26).string(message.nativeAssetAmount);
        }
        if (message.externalAssetAmount !== "") {
            writer.uint32(34).string(message.externalAssetAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreatePool);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signer = reader.string();
                    break;
                case 2:
                    message.externalAsset = types_1.Asset.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.nativeAssetAmount = reader.string();
                    break;
                case 4:
                    message.externalAssetAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgCreatePool);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = String(object.signer);
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromJSON(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.nativeAssetAmount !== undefined &&
            object.nativeAssetAmount !== null) {
            message.nativeAssetAmount = String(object.nativeAssetAmount);
        }
        else {
            message.nativeAssetAmount = "";
        }
        if (object.externalAssetAmount !== undefined &&
            object.externalAssetAmount !== null) {
            message.externalAssetAmount = String(object.externalAssetAmount);
        }
        else {
            message.externalAssetAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.signer !== undefined && (obj.signer = message.signer);
        message.externalAsset !== undefined &&
            (obj.externalAsset = message.externalAsset
                ? types_1.Asset.toJSON(message.externalAsset)
                : undefined);
        message.nativeAssetAmount !== undefined &&
            (obj.nativeAssetAmount = message.nativeAssetAmount);
        message.externalAssetAmount !== undefined &&
            (obj.externalAssetAmount = message.externalAssetAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgCreatePool);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = object.signer;
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromPartial(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.nativeAssetAmount !== undefined &&
            object.nativeAssetAmount !== null) {
            message.nativeAssetAmount = object.nativeAssetAmount;
        }
        else {
            message.nativeAssetAmount = "";
        }
        if (object.externalAssetAmount !== undefined &&
            object.externalAssetAmount !== null) {
            message.externalAssetAmount = object.externalAssetAmount;
        }
        else {
            message.externalAssetAmount = "";
        }
        return message;
    },
};
const baseMsgCreatePoolResponse = {};
exports.MsgCreatePoolResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreatePoolResponse);
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
        const message = Object.assign({}, baseMsgCreatePoolResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgCreatePoolResponse);
        return message;
    },
};
const baseMsgAddLiquidity = {
    signer: "",
    nativeAssetAmount: "",
    externalAssetAmount: "",
};
exports.MsgAddLiquidity = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signer !== "") {
            writer.uint32(10).string(message.signer);
        }
        if (message.externalAsset !== undefined) {
            types_1.Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
        }
        if (message.nativeAssetAmount !== "") {
            writer.uint32(26).string(message.nativeAssetAmount);
        }
        if (message.externalAssetAmount !== "") {
            writer.uint32(34).string(message.externalAssetAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgAddLiquidity);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signer = reader.string();
                    break;
                case 2:
                    message.externalAsset = types_1.Asset.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.nativeAssetAmount = reader.string();
                    break;
                case 4:
                    message.externalAssetAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgAddLiquidity);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = String(object.signer);
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromJSON(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.nativeAssetAmount !== undefined &&
            object.nativeAssetAmount !== null) {
            message.nativeAssetAmount = String(object.nativeAssetAmount);
        }
        else {
            message.nativeAssetAmount = "";
        }
        if (object.externalAssetAmount !== undefined &&
            object.externalAssetAmount !== null) {
            message.externalAssetAmount = String(object.externalAssetAmount);
        }
        else {
            message.externalAssetAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.signer !== undefined && (obj.signer = message.signer);
        message.externalAsset !== undefined &&
            (obj.externalAsset = message.externalAsset
                ? types_1.Asset.toJSON(message.externalAsset)
                : undefined);
        message.nativeAssetAmount !== undefined &&
            (obj.nativeAssetAmount = message.nativeAssetAmount);
        message.externalAssetAmount !== undefined &&
            (obj.externalAssetAmount = message.externalAssetAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgAddLiquidity);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = object.signer;
        }
        else {
            message.signer = "";
        }
        if (object.externalAsset !== undefined && object.externalAsset !== null) {
            message.externalAsset = types_1.Asset.fromPartial(object.externalAsset);
        }
        else {
            message.externalAsset = undefined;
        }
        if (object.nativeAssetAmount !== undefined &&
            object.nativeAssetAmount !== null) {
            message.nativeAssetAmount = object.nativeAssetAmount;
        }
        else {
            message.nativeAssetAmount = "";
        }
        if (object.externalAssetAmount !== undefined &&
            object.externalAssetAmount !== null) {
            message.externalAssetAmount = object.externalAssetAmount;
        }
        else {
            message.externalAssetAmount = "";
        }
        return message;
    },
};
const baseMsgAddLiquidityResponse = {};
exports.MsgAddLiquidityResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgAddLiquidityResponse);
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
        const message = Object.assign({}, baseMsgAddLiquidityResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgAddLiquidityResponse);
        return message;
    },
};
const baseMsgSwap = {
    signer: "",
    sentAmount: "",
    minReceivingAmount: "",
};
exports.MsgSwap = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signer !== "") {
            writer.uint32(10).string(message.signer);
        }
        if (message.sentAsset !== undefined) {
            types_1.Asset.encode(message.sentAsset, writer.uint32(18).fork()).ldelim();
        }
        if (message.receivedAsset !== undefined) {
            types_1.Asset.encode(message.receivedAsset, writer.uint32(26).fork()).ldelim();
        }
        if (message.sentAmount !== "") {
            writer.uint32(34).string(message.sentAmount);
        }
        if (message.minReceivingAmount !== "") {
            writer.uint32(42).string(message.minReceivingAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSwap);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signer = reader.string();
                    break;
                case 2:
                    message.sentAsset = types_1.Asset.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.receivedAsset = types_1.Asset.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.sentAmount = reader.string();
                    break;
                case 5:
                    message.minReceivingAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSwap);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = String(object.signer);
        }
        else {
            message.signer = "";
        }
        if (object.sentAsset !== undefined && object.sentAsset !== null) {
            message.sentAsset = types_1.Asset.fromJSON(object.sentAsset);
        }
        else {
            message.sentAsset = undefined;
        }
        if (object.receivedAsset !== undefined && object.receivedAsset !== null) {
            message.receivedAsset = types_1.Asset.fromJSON(object.receivedAsset);
        }
        else {
            message.receivedAsset = undefined;
        }
        if (object.sentAmount !== undefined && object.sentAmount !== null) {
            message.sentAmount = String(object.sentAmount);
        }
        else {
            message.sentAmount = "";
        }
        if (object.minReceivingAmount !== undefined &&
            object.minReceivingAmount !== null) {
            message.minReceivingAmount = String(object.minReceivingAmount);
        }
        else {
            message.minReceivingAmount = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.signer !== undefined && (obj.signer = message.signer);
        message.sentAsset !== undefined &&
            (obj.sentAsset = message.sentAsset
                ? types_1.Asset.toJSON(message.sentAsset)
                : undefined);
        message.receivedAsset !== undefined &&
            (obj.receivedAsset = message.receivedAsset
                ? types_1.Asset.toJSON(message.receivedAsset)
                : undefined);
        message.sentAmount !== undefined && (obj.sentAmount = message.sentAmount);
        message.minReceivingAmount !== undefined &&
            (obj.minReceivingAmount = message.minReceivingAmount);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSwap);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = object.signer;
        }
        else {
            message.signer = "";
        }
        if (object.sentAsset !== undefined && object.sentAsset !== null) {
            message.sentAsset = types_1.Asset.fromPartial(object.sentAsset);
        }
        else {
            message.sentAsset = undefined;
        }
        if (object.receivedAsset !== undefined && object.receivedAsset !== null) {
            message.receivedAsset = types_1.Asset.fromPartial(object.receivedAsset);
        }
        else {
            message.receivedAsset = undefined;
        }
        if (object.sentAmount !== undefined && object.sentAmount !== null) {
            message.sentAmount = object.sentAmount;
        }
        else {
            message.sentAmount = "";
        }
        if (object.minReceivingAmount !== undefined &&
            object.minReceivingAmount !== null) {
            message.minReceivingAmount = object.minReceivingAmount;
        }
        else {
            message.minReceivingAmount = "";
        }
        return message;
    },
};
const baseMsgSwapResponse = {};
exports.MsgSwapResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSwapResponse);
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
        const message = Object.assign({}, baseMsgSwapResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSwapResponse);
        return message;
    },
};
const baseMsgDecommissionPool = { signer: "", symbol: "" };
exports.MsgDecommissionPool = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signer !== "") {
            writer.uint32(10).string(message.signer);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgDecommissionPool);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signer = reader.string();
                    break;
                case 2:
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
        const message = Object.assign({}, baseMsgDecommissionPool);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = String(object.signer);
        }
        else {
            message.signer = "";
        }
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
        message.signer !== undefined && (obj.signer = message.signer);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgDecommissionPool);
        if (object.signer !== undefined && object.signer !== null) {
            message.signer = object.signer;
        }
        else {
            message.signer = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        return message;
    },
};
const baseMsgDecommissionPoolResponse = {};
exports.MsgDecommissionPoolResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgDecommissionPoolResponse);
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
        const message = Object.assign({}, baseMsgDecommissionPoolResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgDecommissionPoolResponse);
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.RemoveLiquidity = this.RemoveLiquidity.bind(this);
        this.CreatePool = this.CreatePool.bind(this);
        this.AddLiquidity = this.AddLiquidity.bind(this);
        this.Swap = this.Swap.bind(this);
        this.DecommissionPool = this.DecommissionPool.bind(this);
    }
    RemoveLiquidity(request) {
        const data = exports.MsgRemoveLiquidity.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Msg", "RemoveLiquidity", data);
        return promise.then((data) => exports.MsgRemoveLiquidityResponse.decode(new minimal_1.default.Reader(data)));
    }
    CreatePool(request) {
        const data = exports.MsgCreatePool.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Msg", "CreatePool", data);
        return promise.then((data) => exports.MsgCreatePoolResponse.decode(new minimal_1.default.Reader(data)));
    }
    AddLiquidity(request) {
        const data = exports.MsgAddLiquidity.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Msg", "AddLiquidity", data);
        return promise.then((data) => exports.MsgAddLiquidityResponse.decode(new minimal_1.default.Reader(data)));
    }
    Swap(request) {
        const data = exports.MsgSwap.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Msg", "Swap", data);
        return promise.then((data) => exports.MsgSwapResponse.decode(new minimal_1.default.Reader(data)));
    }
    DecommissionPool(request) {
        const data = exports.MsgDecommissionPool.encode(request).finish();
        const promise = this.rpc.request("sifnode.clp.v1.Msg", "DecommissionPool", data);
        return promise.then((data) => exports.MsgDecommissionPoolResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=tx.js.map