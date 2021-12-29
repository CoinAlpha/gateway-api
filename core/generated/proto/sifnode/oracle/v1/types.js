"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.DBProphecy = exports.Claim = exports.GenesisState = exports.statusTextToJSON = exports.statusTextFromJSON = exports.StatusText = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "sifnode.oracle.v1";
/** StatusText is an enum used to represent the status of the prophecy */
var StatusText;
(function (StatusText) {
    /** STATUS_TEXT_UNSPECIFIED - Default value */
    StatusText[StatusText["STATUS_TEXT_UNSPECIFIED"] = 0] = "STATUS_TEXT_UNSPECIFIED";
    /** STATUS_TEXT_PENDING - Pending status */
    StatusText[StatusText["STATUS_TEXT_PENDING"] = 1] = "STATUS_TEXT_PENDING";
    /** STATUS_TEXT_SUCCESS - Success status */
    StatusText[StatusText["STATUS_TEXT_SUCCESS"] = 2] = "STATUS_TEXT_SUCCESS";
    /** STATUS_TEXT_FAILED - Failed status */
    StatusText[StatusText["STATUS_TEXT_FAILED"] = 3] = "STATUS_TEXT_FAILED";
    StatusText[StatusText["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StatusText = exports.StatusText || (exports.StatusText = {}));
function statusTextFromJSON(object) {
    switch (object) {
        case 0:
        case "STATUS_TEXT_UNSPECIFIED":
            return StatusText.STATUS_TEXT_UNSPECIFIED;
        case 1:
        case "STATUS_TEXT_PENDING":
            return StatusText.STATUS_TEXT_PENDING;
        case 2:
        case "STATUS_TEXT_SUCCESS":
            return StatusText.STATUS_TEXT_SUCCESS;
        case 3:
        case "STATUS_TEXT_FAILED":
            return StatusText.STATUS_TEXT_FAILED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return StatusText.UNRECOGNIZED;
    }
}
exports.statusTextFromJSON = statusTextFromJSON;
function statusTextToJSON(object) {
    switch (object) {
        case StatusText.STATUS_TEXT_UNSPECIFIED:
            return "STATUS_TEXT_UNSPECIFIED";
        case StatusText.STATUS_TEXT_PENDING:
            return "STATUS_TEXT_PENDING";
        case StatusText.STATUS_TEXT_SUCCESS:
            return "STATUS_TEXT_SUCCESS";
        case StatusText.STATUS_TEXT_FAILED:
            return "STATUS_TEXT_FAILED";
        default:
            return "UNKNOWN";
    }
}
exports.statusTextToJSON = statusTextToJSON;
const baseGenesisState = { addressWhitelist: "", adminAddress: "" };
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.addressWhitelist) {
            writer.uint32(10).string(v);
        }
        if (message.adminAddress !== "") {
            writer.uint32(18).string(message.adminAddress);
        }
        for (const v of message.prophecies) {
            exports.DBProphecy.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        message.addressWhitelist = [];
        message.prophecies = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.addressWhitelist.push(reader.string());
                    break;
                case 2:
                    message.adminAddress = reader.string();
                    break;
                case 3:
                    message.prophecies.push(exports.DBProphecy.decode(reader, reader.uint32()));
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
        message.prophecies = [];
        if (object.addressWhitelist !== undefined &&
            object.addressWhitelist !== null) {
            for (const e of object.addressWhitelist) {
                message.addressWhitelist.push(String(e));
            }
        }
        if (object.adminAddress !== undefined && object.adminAddress !== null) {
            message.adminAddress = String(object.adminAddress);
        }
        else {
            message.adminAddress = "";
        }
        if (object.prophecies !== undefined && object.prophecies !== null) {
            for (const e of object.prophecies) {
                message.prophecies.push(exports.DBProphecy.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.addressWhitelist) {
            obj.addressWhitelist = message.addressWhitelist.map((e) => e);
        }
        else {
            obj.addressWhitelist = [];
        }
        message.adminAddress !== undefined &&
            (obj.adminAddress = message.adminAddress);
        if (message.prophecies) {
            obj.prophecies = message.prophecies.map((e) => e ? exports.DBProphecy.toJSON(e) : undefined);
        }
        else {
            obj.prophecies = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        message.addressWhitelist = [];
        message.prophecies = [];
        if (object.addressWhitelist !== undefined &&
            object.addressWhitelist !== null) {
            for (const e of object.addressWhitelist) {
                message.addressWhitelist.push(e);
            }
        }
        if (object.adminAddress !== undefined && object.adminAddress !== null) {
            message.adminAddress = object.adminAddress;
        }
        else {
            message.adminAddress = "";
        }
        if (object.prophecies !== undefined && object.prophecies !== null) {
            for (const e of object.prophecies) {
                message.prophecies.push(exports.DBProphecy.fromPartial(e));
            }
        }
        return message;
    },
};
const baseClaim = { id: "", validatorAddress: "", content: "" };
exports.Claim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        if (message.content !== "") {
            writer.uint32(26).string(message.content);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.content = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseClaim);
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.validatorAddress !== undefined &&
            object.validatorAddress !== null) {
            message.validatorAddress = String(object.validatorAddress);
        }
        else {
            message.validatorAddress = "";
        }
        if (object.content !== undefined && object.content !== null) {
            message.content = String(object.content);
        }
        else {
            message.content = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.content !== undefined && (obj.content = message.content);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseClaim);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.validatorAddress !== undefined &&
            object.validatorAddress !== null) {
            message.validatorAddress = object.validatorAddress;
        }
        else {
            message.validatorAddress = "";
        }
        if (object.content !== undefined && object.content !== null) {
            message.content = object.content;
        }
        else {
            message.content = "";
        }
        return message;
    },
};
const baseDBProphecy = { id: "" };
exports.DBProphecy = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.status !== undefined) {
            exports.Status.encode(message.status, writer.uint32(18).fork()).ldelim();
        }
        if (message.claimValidators.length !== 0) {
            writer.uint32(26).bytes(message.claimValidators);
        }
        if (message.validatorClaims.length !== 0) {
            writer.uint32(34).bytes(message.validatorClaims);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDBProphecy);
        message.claimValidators = new Uint8Array();
        message.validatorClaims = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.status = exports.Status.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.claimValidators = reader.bytes();
                    break;
                case 4:
                    message.validatorClaims = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDBProphecy);
        message.claimValidators = new Uint8Array();
        message.validatorClaims = new Uint8Array();
        if (object.id !== undefined && object.id !== null) {
            message.id = String(object.id);
        }
        else {
            message.id = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = exports.Status.fromJSON(object.status);
        }
        else {
            message.status = undefined;
        }
        if (object.claimValidators !== undefined &&
            object.claimValidators !== null) {
            message.claimValidators = bytesFromBase64(object.claimValidators);
        }
        if (object.validatorClaims !== undefined &&
            object.validatorClaims !== null) {
            message.validatorClaims = bytesFromBase64(object.validatorClaims);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.status !== undefined &&
            (obj.status = message.status ? exports.Status.toJSON(message.status) : undefined);
        message.claimValidators !== undefined &&
            (obj.claimValidators = base64FromBytes(message.claimValidators !== undefined
                ? message.claimValidators
                : new Uint8Array()));
        message.validatorClaims !== undefined &&
            (obj.validatorClaims = base64FromBytes(message.validatorClaims !== undefined
                ? message.validatorClaims
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseDBProphecy);
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = "";
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = exports.Status.fromPartial(object.status);
        }
        else {
            message.status = undefined;
        }
        if (object.claimValidators !== undefined &&
            object.claimValidators !== null) {
            message.claimValidators = object.claimValidators;
        }
        else {
            message.claimValidators = new Uint8Array();
        }
        if (object.validatorClaims !== undefined &&
            object.validatorClaims !== null) {
            message.validatorClaims = object.validatorClaims;
        }
        else {
            message.validatorClaims = new Uint8Array();
        }
        return message;
    },
};
const baseStatus = { text: 0, finalClaim: "" };
exports.Status = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.text !== 0) {
            writer.uint32(8).int32(message.text);
        }
        if (message.finalClaim !== "") {
            writer.uint32(18).string(message.finalClaim);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseStatus);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.text = reader.int32();
                    break;
                case 2:
                    message.finalClaim = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseStatus);
        if (object.text !== undefined && object.text !== null) {
            message.text = statusTextFromJSON(object.text);
        }
        else {
            message.text = 0;
        }
        if (object.finalClaim !== undefined && object.finalClaim !== null) {
            message.finalClaim = String(object.finalClaim);
        }
        else {
            message.finalClaim = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.text !== undefined && (obj.text = statusTextToJSON(message.text));
        message.finalClaim !== undefined && (obj.finalClaim = message.finalClaim);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseStatus);
        if (object.text !== undefined && object.text !== null) {
            message.text = object.text;
        }
        else {
            message.text = 0;
        }
        if (object.finalClaim !== undefined && object.finalClaim !== null) {
            message.finalClaim = object.finalClaim;
        }
        else {
            message.finalClaim = "";
        }
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=types.js.map