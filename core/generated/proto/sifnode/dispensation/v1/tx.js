"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgRunDistribution = exports.MsgCreateUserClaim = exports.MsgRunDistributionResponse = exports.MsgCreateClaimResponse = exports.MsgCreateDistributionResponse = exports.MsgCreateDistribution = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../sifnode/dispensation/v1/types");
exports.protobufPackage = "sifnode.dispensation.v1";
const baseMsgCreateDistribution = {
    distributor: "",
    authorizedRunner: "",
    distributionType: 0,
    output: "",
};
exports.MsgCreateDistribution = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.distributor !== "") {
            writer.uint32(10).string(message.distributor);
        }
        if (message.authorizedRunner !== "") {
            writer.uint32(18).string(message.authorizedRunner);
        }
        if (message.distributionType !== 0) {
            writer.uint32(24).int32(message.distributionType);
        }
        for (const v of message.output) {
            writer.uint32(34).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateDistribution);
        message.output = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distributor = reader.string();
                    break;
                case 2:
                    message.authorizedRunner = reader.string();
                    break;
                case 3:
                    message.distributionType = reader.int32();
                    break;
                case 4:
                    message.output.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgCreateDistribution);
        message.output = [];
        if (object.distributor !== undefined && object.distributor !== null) {
            message.distributor = String(object.distributor);
        }
        else {
            message.distributor = "";
        }
        if (object.authorizedRunner !== undefined &&
            object.authorizedRunner !== null) {
            message.authorizedRunner = String(object.authorizedRunner);
        }
        else {
            message.authorizedRunner = "";
        }
        if (object.distributionType !== undefined &&
            object.distributionType !== null) {
            message.distributionType = types_1.distributionTypeFromJSON(object.distributionType);
        }
        else {
            message.distributionType = 0;
        }
        if (object.output !== undefined && object.output !== null) {
            for (const e of object.output) {
                message.output.push(String(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.distributor !== undefined &&
            (obj.distributor = message.distributor);
        message.authorizedRunner !== undefined &&
            (obj.authorizedRunner = message.authorizedRunner);
        message.distributionType !== undefined &&
            (obj.distributionType = types_1.distributionTypeToJSON(message.distributionType));
        if (message.output) {
            obj.output = message.output.map((e) => e);
        }
        else {
            obj.output = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgCreateDistribution);
        message.output = [];
        if (object.distributor !== undefined && object.distributor !== null) {
            message.distributor = object.distributor;
        }
        else {
            message.distributor = "";
        }
        if (object.authorizedRunner !== undefined &&
            object.authorizedRunner !== null) {
            message.authorizedRunner = object.authorizedRunner;
        }
        else {
            message.authorizedRunner = "";
        }
        if (object.distributionType !== undefined &&
            object.distributionType !== null) {
            message.distributionType = object.distributionType;
        }
        else {
            message.distributionType = 0;
        }
        if (object.output !== undefined && object.output !== null) {
            for (const e of object.output) {
                message.output.push(e);
            }
        }
        return message;
    },
};
const baseMsgCreateDistributionResponse = {};
exports.MsgCreateDistributionResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateDistributionResponse);
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
        const message = Object.assign({}, baseMsgCreateDistributionResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgCreateDistributionResponse);
        return message;
    },
};
const baseMsgCreateClaimResponse = {};
exports.MsgCreateClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateClaimResponse);
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
        const message = Object.assign({}, baseMsgCreateClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgCreateClaimResponse);
        return message;
    },
};
const baseMsgRunDistributionResponse = {};
exports.MsgRunDistributionResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRunDistributionResponse);
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
        const message = Object.assign({}, baseMsgRunDistributionResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgRunDistributionResponse);
        return message;
    },
};
const baseMsgCreateUserClaim = {
    userClaimAddress: "",
    userClaimType: 0,
};
exports.MsgCreateUserClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.userClaimAddress !== "") {
            writer.uint32(10).string(message.userClaimAddress);
        }
        if (message.userClaimType !== 0) {
            writer.uint32(16).int32(message.userClaimType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCreateUserClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.userClaimAddress = reader.string();
                    break;
                case 2:
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
        const message = Object.assign({}, baseMsgCreateUserClaim);
        if (object.userClaimAddress !== undefined &&
            object.userClaimAddress !== null) {
            message.userClaimAddress = String(object.userClaimAddress);
        }
        else {
            message.userClaimAddress = "";
        }
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
        message.userClaimAddress !== undefined &&
            (obj.userClaimAddress = message.userClaimAddress);
        message.userClaimType !== undefined &&
            (obj.userClaimType = types_1.distributionTypeToJSON(message.userClaimType));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgCreateUserClaim);
        if (object.userClaimAddress !== undefined &&
            object.userClaimAddress !== null) {
            message.userClaimAddress = object.userClaimAddress;
        }
        else {
            message.userClaimAddress = "";
        }
        if (object.userClaimType !== undefined && object.userClaimType !== null) {
            message.userClaimType = object.userClaimType;
        }
        else {
            message.userClaimType = 0;
        }
        return message;
    },
};
const baseMsgRunDistribution = {
    authorizedRunner: "",
    distributionName: "",
    distributionType: 0,
};
exports.MsgRunDistribution = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.authorizedRunner !== "") {
            writer.uint32(10).string(message.authorizedRunner);
        }
        if (message.distributionName !== "") {
            writer.uint32(18).string(message.distributionName);
        }
        if (message.distributionType !== 0) {
            writer.uint32(24).int32(message.distributionType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRunDistribution);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authorizedRunner = reader.string();
                    break;
                case 2:
                    message.distributionName = reader.string();
                    break;
                case 3:
                    message.distributionType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgRunDistribution);
        if (object.authorizedRunner !== undefined &&
            object.authorizedRunner !== null) {
            message.authorizedRunner = String(object.authorizedRunner);
        }
        else {
            message.authorizedRunner = "";
        }
        if (object.distributionName !== undefined &&
            object.distributionName !== null) {
            message.distributionName = String(object.distributionName);
        }
        else {
            message.distributionName = "";
        }
        if (object.distributionType !== undefined &&
            object.distributionType !== null) {
            message.distributionType = types_1.distributionTypeFromJSON(object.distributionType);
        }
        else {
            message.distributionType = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.authorizedRunner !== undefined &&
            (obj.authorizedRunner = message.authorizedRunner);
        message.distributionName !== undefined &&
            (obj.distributionName = message.distributionName);
        message.distributionType !== undefined &&
            (obj.distributionType = types_1.distributionTypeToJSON(message.distributionType));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgRunDistribution);
        if (object.authorizedRunner !== undefined &&
            object.authorizedRunner !== null) {
            message.authorizedRunner = object.authorizedRunner;
        }
        else {
            message.authorizedRunner = "";
        }
        if (object.distributionName !== undefined &&
            object.distributionName !== null) {
            message.distributionName = object.distributionName;
        }
        else {
            message.distributionName = "";
        }
        if (object.distributionType !== undefined &&
            object.distributionType !== null) {
            message.distributionType = object.distributionType;
        }
        else {
            message.distributionType = 0;
        }
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.CreateDistribution = this.CreateDistribution.bind(this);
        this.CreateUserClaim = this.CreateUserClaim.bind(this);
        this.RunDistribution = this.RunDistribution.bind(this);
    }
    CreateDistribution(request) {
        const data = exports.MsgCreateDistribution.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Msg", "CreateDistribution", data);
        return promise.then((data) => exports.MsgCreateDistributionResponse.decode(new minimal_1.default.Reader(data)));
    }
    CreateUserClaim(request) {
        const data = exports.MsgCreateUserClaim.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Msg", "CreateUserClaim", data);
        return promise.then((data) => exports.MsgCreateClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    RunDistribution(request) {
        const data = exports.MsgRunDistribution.encode(request).finish();
        const promise = this.rpc.request("sifnode.dispensation.v1.Msg", "RunDistribution", data);
        return promise.then((data) => exports.MsgRunDistributionResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=tx.js.map