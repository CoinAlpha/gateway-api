"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClientImpl = exports.QueryClaimsResponse = exports.QueryClaimsByTypeRequest = exports.QueryRecordsByRecipientAddrResponse = exports.QueryRecordsByRecipientAddrRequest = exports.QueryRecordsByDistributionNameResponse = exports.QueryRecordsByDistributionNameRequest = exports.QueryAllDistributionsResponse = exports.QueryAllDistributionsRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/dispensation/v1/types");
exports.protobufPackage = "sifnode.dispensation.v1";
const baseQueryAllDistributionsRequest = {};
exports.QueryAllDistributionsRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAllDistributionsRequest);
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
        const message = Object.assign({}, baseQueryAllDistributionsRequest);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseQueryAllDistributionsRequest);
        return message;
    },
};
const baseQueryAllDistributionsResponse = { height: long_1.default.ZERO };
exports.QueryAllDistributionsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.distributions) {
            types_1.Distribution.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAllDistributionsResponse);
        message.distributions = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distributions.push(types_1.Distribution.decode(reader, reader.uint32()));
                    break;
                case 2:
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
        const message = Object.assign({}, baseQueryAllDistributionsResponse);
        message.distributions = [];
        if (object.distributions !== undefined && object.distributions !== null) {
            for (const e of object.distributions) {
                message.distributions.push(types_1.Distribution.fromJSON(e));
            }
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
        if (message.distributions) {
            obj.distributions = message.distributions.map((e) => e ? types_1.Distribution.toJSON(e) : undefined);
        }
        else {
            obj.distributions = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryAllDistributionsResponse);
        message.distributions = [];
        if (object.distributions !== undefined && object.distributions !== null) {
            for (const e of object.distributions) {
                message.distributions.push(types_1.Distribution.fromPartial(e));
            }
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
const baseQueryRecordsByDistributionNameRequest = {
    distributionName: "",
    status: 0,
};
exports.QueryRecordsByDistributionNameRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.distributionName !== "") {
            writer.uint32(10).string(message.distributionName);
        }
        if (message.status !== 0) {
            writer.uint32(16).int32(message.status);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRecordsByDistributionNameRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distributionName = reader.string();
                    break;
                case 2:
                    message.status = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryRecordsByDistributionNameRequest);
        if (object.distributionName !== undefined &&
            object.distributionName !== null) {
            message.distributionName = String(object.distributionName);
        }
        else {
            message.distributionName = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = types_1.distributionStatusFromJSON(object.status);
        }
        else {
            message.status = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.distributionName !== undefined &&
            (obj.distributionName = message.distributionName);
        message.status !== undefined &&
            (obj.status = types_1.distributionStatusToJSON(message.status));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRecordsByDistributionNameRequest);
        if (object.distributionName !== undefined &&
            object.distributionName !== null) {
            message.distributionName = object.distributionName;
        }
        else {
            message.distributionName = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = object.status;
        }
        else {
            message.status = 0;
        }
        return message;
    },
};
const baseQueryRecordsByDistributionNameResponse = {
    height: long_1.default.ZERO,
};
exports.QueryRecordsByDistributionNameResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.distributionRecords !== undefined) {
            types_1.DistributionRecords.encode(message.distributionRecords, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRecordsByDistributionNameResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distributionRecords = types_1.DistributionRecords.decode(reader, reader.uint32());
                    break;
                case 2:
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
        const message = Object.assign({}, baseQueryRecordsByDistributionNameResponse);
        if (object.distributionRecords !== undefined &&
            object.distributionRecords !== null) {
            message.distributionRecords = types_1.DistributionRecords.fromJSON(object.distributionRecords);
        }
        else {
            message.distributionRecords = undefined;
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
        message.distributionRecords !== undefined &&
            (obj.distributionRecords = message.distributionRecords
                ? types_1.DistributionRecords.toJSON(message.distributionRecords)
                : undefined);
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRecordsByDistributionNameResponse);
        if (object.distributionRecords !== undefined &&
            object.distributionRecords !== null) {
            message.distributionRecords = types_1.DistributionRecords.fromPartial(object.distributionRecords);
        }
        else {
            message.distributionRecords = undefined;
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
const baseQueryRecordsByRecipientAddrRequest = { address: "" };
exports.QueryRecordsByRecipientAddrRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        return message;
    },
};
const baseQueryRecordsByRecipientAddrResponse = { height: long_1.default.ZERO };
exports.QueryRecordsByRecipientAddrResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.distributionRecords !== undefined) {
            types_1.DistributionRecords.encode(message.distributionRecords, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distributionRecords = types_1.DistributionRecords.decode(reader, reader.uint32());
                    break;
                case 2:
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
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrResponse);
        if (object.distributionRecords !== undefined &&
            object.distributionRecords !== null) {
            message.distributionRecords = types_1.DistributionRecords.fromJSON(object.distributionRecords);
        }
        else {
            message.distributionRecords = undefined;
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
        message.distributionRecords !== undefined &&
            (obj.distributionRecords = message.distributionRecords
                ? types_1.DistributionRecords.toJSON(message.distributionRecords)
                : undefined);
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRecordsByRecipientAddrResponse);
        if (object.distributionRecords !== undefined &&
            object.distributionRecords !== null) {
            message.distributionRecords = types_1.DistributionRecords.fromPartial(object.distributionRecords);
        }
        else {
            message.distributionRecords = undefined;
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
const baseQueryClaimsByTypeRequest = { userClaimType: 0 };
exports.QueryClaimsByTypeRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.userClaimType !== 0) {
            writer.uint32(8).int32(message.userClaimType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryClaimsByTypeRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.userClaimType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryClaimsByTypeRequest);
        if (object.userClaimType !== undefined && object.userClaimType !== null) {
            message.userClaimType = types_1.distributionTypeFromJSON(object.userClaimType);
        }
        else {
            message.userClaimType = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.userClaimType !== undefined &&
            (obj.userClaimType = types_1.distributionTypeToJSON(message.userClaimType));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryClaimsByTypeRequest);
        if (object.userClaimType !== undefined && object.userClaimType !== null) {
            message.userClaimType = object.userClaimType;
        }
        else {
            message.userClaimType = 0;
        }
        return message;
    },
};
const baseQueryClaimsResponse = { height: long_1.default.ZERO };
exports.QueryClaimsResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.claims) {
            types_1.UserClaim.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (!message.height.isZero()) {
            writer.uint32(16).int64(message.height);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryClaimsResponse);
        message.claims = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claims.push(types_1.UserClaim.decode(reader, reader.uint32()));
                    break;
                case 2:
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
        const message = Object.assign({}, baseQueryClaimsResponse);
        message.claims = [];
        if (object.claims !== undefined && object.claims !== null) {
            for (const e of object.claims) {
                message.claims.push(types_1.UserClaim.fromJSON(e));
            }
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
        if (message.claims) {
            obj.claims = message.claims.map((e) => e ? types_1.UserClaim.toJSON(e) : undefined);
        }
        else {
            obj.claims = [];
        }
        message.height !== undefined &&
            (obj.height = (message.height || long_1.default.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryClaimsResponse);
        message.claims = [];
        if (object.claims !== undefined && object.claims !== null) {
            for (const e of object.claims) {
                message.claims.push(types_1.UserClaim.fromPartial(e));
            }
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
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.AllDistributions = this.AllDistributions.bind(this);
        this.RecordsByDistributionName = this.RecordsByDistributionName.bind(this);
        this.RecordsByRecipient = this.RecordsByRecipient.bind(this);
        this.ClaimsByType = this.ClaimsByType.bind(this);
    }
    AllDistributions(request) {
        const data = exports.QueryAllDistributionsRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Query", "AllDistributions", data);
        return promise.then((data) => exports.QueryAllDistributionsResponse.decode(new minimal_1.default.Reader(data)));
    }
    RecordsByDistributionName(request) {
        const data = exports.QueryRecordsByDistributionNameRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Query", "RecordsByDistributionName", data);
        return promise.then((data) => exports.QueryRecordsByDistributionNameResponse.decode(new minimal_1.default.Reader(data)));
    }
    RecordsByRecipient(request) {
        const data = exports.QueryRecordsByRecipientAddrRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Query", "RecordsByRecipient", data);
        return promise.then((data) => exports.QueryRecordsByRecipientAddrResponse.decode(new minimal_1.default.Reader(data)));
    }
    ClaimsByType(request) {
        const data = exports.QueryClaimsByTypeRequest.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Query", "ClaimsByType", data);
        return promise.then((data) => exports.QueryClaimsResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=query.js.map