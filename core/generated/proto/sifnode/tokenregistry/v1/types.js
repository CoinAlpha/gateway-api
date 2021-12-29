"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryEntry = exports.Registry = exports.GenesisState = exports.permissionToJSON = exports.permissionFromJSON = exports.Permission = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "sifnode.tokenregistry.v1";
var Permission;
(function (Permission) {
    Permission[Permission["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    Permission[Permission["CLP"] = 1] = "CLP";
    Permission[Permission["IBCEXPORT"] = 2] = "IBCEXPORT";
    Permission[Permission["IBCIMPORT"] = 3] = "IBCIMPORT";
    Permission[Permission["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Permission = exports.Permission || (exports.Permission = {}));
function permissionFromJSON(object) {
    switch (object) {
        case 0:
        case "UNSPECIFIED":
            return Permission.UNSPECIFIED;
        case 1:
        case "CLP":
            return Permission.CLP;
        case 2:
        case "IBCEXPORT":
            return Permission.IBCEXPORT;
        case 3:
        case "IBCIMPORT":
            return Permission.IBCIMPORT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return Permission.UNRECOGNIZED;
    }
}
exports.permissionFromJSON = permissionFromJSON;
function permissionToJSON(object) {
    switch (object) {
        case Permission.UNSPECIFIED:
            return "UNSPECIFIED";
        case Permission.CLP:
            return "CLP";
        case Permission.IBCEXPORT:
            return "IBCEXPORT";
        case Permission.IBCIMPORT:
            return "IBCIMPORT";
        default:
            return "UNKNOWN";
    }
}
exports.permissionToJSON = permissionToJSON;
const baseGenesisState = { adminAccount: "" };
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.adminAccount !== "") {
            writer.uint32(10).string(message.adminAccount);
        }
        if (message.registry !== undefined) {
            exports.Registry.encode(message.registry, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.adminAccount = reader.string();
                    break;
                case 2:
                    message.registry = exports.Registry.decode(reader, reader.uint32());
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
        if (object.adminAccount !== undefined && object.adminAccount !== null) {
            message.adminAccount = String(object.adminAccount);
        }
        else {
            message.adminAccount = "";
        }
        if (object.registry !== undefined && object.registry !== null) {
            message.registry = exports.Registry.fromJSON(object.registry);
        }
        else {
            message.registry = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.adminAccount !== undefined &&
            (obj.adminAccount = message.adminAccount);
        message.registry !== undefined &&
            (obj.registry = message.registry
                ? exports.Registry.toJSON(message.registry)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        if (object.adminAccount !== undefined && object.adminAccount !== null) {
            message.adminAccount = object.adminAccount;
        }
        else {
            message.adminAccount = "";
        }
        if (object.registry !== undefined && object.registry !== null) {
            message.registry = exports.Registry.fromPartial(object.registry);
        }
        else {
            message.registry = undefined;
        }
        return message;
    },
};
const baseRegistry = {};
exports.Registry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.entries) {
            exports.RegistryEntry.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRegistry);
        message.entries = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.entries.push(exports.RegistryEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRegistry);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            for (const e of object.entries) {
                message.entries.push(exports.RegistryEntry.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.entries) {
            obj.entries = message.entries.map((e) => e ? exports.RegistryEntry.toJSON(e) : undefined);
        }
        else {
            obj.entries = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseRegistry);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            for (const e of object.entries) {
                message.entries.push(exports.RegistryEntry.fromPartial(e));
            }
        }
        return message;
    },
};
const baseRegistryEntry = {
    decimals: long_1.default.ZERO,
    denom: "",
    baseDenom: "",
    path: "",
    ibcChannelId: "",
    ibcCounterpartyChannelId: "",
    displayName: "",
    displaySymbol: "",
    network: "",
    address: "",
    externalSymbol: "",
    transferLimit: "",
    permissions: 0,
    unitDenom: "",
    ibcCounterpartyDenom: "",
    ibcCounterpartyChainId: "",
};
exports.RegistryEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.decimals.isZero()) {
            writer.uint32(16).int64(message.decimals);
        }
        if (message.denom !== "") {
            writer.uint32(26).string(message.denom);
        }
        if (message.baseDenom !== "") {
            writer.uint32(34).string(message.baseDenom);
        }
        if (message.path !== "") {
            writer.uint32(42).string(message.path);
        }
        if (message.ibcChannelId !== "") {
            writer.uint32(50).string(message.ibcChannelId);
        }
        if (message.ibcCounterpartyChannelId !== "") {
            writer.uint32(58).string(message.ibcCounterpartyChannelId);
        }
        if (message.displayName !== "") {
            writer.uint32(66).string(message.displayName);
        }
        if (message.displaySymbol !== "") {
            writer.uint32(74).string(message.displaySymbol);
        }
        if (message.network !== "") {
            writer.uint32(82).string(message.network);
        }
        if (message.address !== "") {
            writer.uint32(90).string(message.address);
        }
        if (message.externalSymbol !== "") {
            writer.uint32(98).string(message.externalSymbol);
        }
        if (message.transferLimit !== "") {
            writer.uint32(106).string(message.transferLimit);
        }
        writer.uint32(122).fork();
        for (const v of message.permissions) {
            writer.int32(v);
        }
        writer.ldelim();
        if (message.unitDenom !== "") {
            writer.uint32(130).string(message.unitDenom);
        }
        if (message.ibcCounterpartyDenom !== "") {
            writer.uint32(138).string(message.ibcCounterpartyDenom);
        }
        if (message.ibcCounterpartyChainId !== "") {
            writer.uint32(146).string(message.ibcCounterpartyChainId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRegistryEntry);
        message.permissions = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.decimals = reader.int64();
                    break;
                case 3:
                    message.denom = reader.string();
                    break;
                case 4:
                    message.baseDenom = reader.string();
                    break;
                case 5:
                    message.path = reader.string();
                    break;
                case 6:
                    message.ibcChannelId = reader.string();
                    break;
                case 7:
                    message.ibcCounterpartyChannelId = reader.string();
                    break;
                case 8:
                    message.displayName = reader.string();
                    break;
                case 9:
                    message.displaySymbol = reader.string();
                    break;
                case 10:
                    message.network = reader.string();
                    break;
                case 11:
                    message.address = reader.string();
                    break;
                case 12:
                    message.externalSymbol = reader.string();
                    break;
                case 13:
                    message.transferLimit = reader.string();
                    break;
                case 15:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.permissions.push(reader.int32());
                        }
                    }
                    else {
                        message.permissions.push(reader.int32());
                    }
                    break;
                case 16:
                    message.unitDenom = reader.string();
                    break;
                case 17:
                    message.ibcCounterpartyDenom = reader.string();
                    break;
                case 18:
                    message.ibcCounterpartyChainId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRegistryEntry);
        message.permissions = [];
        if (object.decimals !== undefined && object.decimals !== null) {
            message.decimals = long_1.default.fromString(object.decimals);
        }
        else {
            message.decimals = long_1.default.ZERO;
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = String(object.denom);
        }
        else {
            message.denom = "";
        }
        if (object.baseDenom !== undefined && object.baseDenom !== null) {
            message.baseDenom = String(object.baseDenom);
        }
        else {
            message.baseDenom = "";
        }
        if (object.path !== undefined && object.path !== null) {
            message.path = String(object.path);
        }
        else {
            message.path = "";
        }
        if (object.ibcChannelId !== undefined && object.ibcChannelId !== null) {
            message.ibcChannelId = String(object.ibcChannelId);
        }
        else {
            message.ibcChannelId = "";
        }
        if (object.ibcCounterpartyChannelId !== undefined &&
            object.ibcCounterpartyChannelId !== null) {
            message.ibcCounterpartyChannelId = String(object.ibcCounterpartyChannelId);
        }
        else {
            message.ibcCounterpartyChannelId = "";
        }
        if (object.displayName !== undefined && object.displayName !== null) {
            message.displayName = String(object.displayName);
        }
        else {
            message.displayName = "";
        }
        if (object.displaySymbol !== undefined && object.displaySymbol !== null) {
            message.displaySymbol = String(object.displaySymbol);
        }
        else {
            message.displaySymbol = "";
        }
        if (object.network !== undefined && object.network !== null) {
            message.network = String(object.network);
        }
        else {
            message.network = "";
        }
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.externalSymbol !== undefined && object.externalSymbol !== null) {
            message.externalSymbol = String(object.externalSymbol);
        }
        else {
            message.externalSymbol = "";
        }
        if (object.transferLimit !== undefined && object.transferLimit !== null) {
            message.transferLimit = String(object.transferLimit);
        }
        else {
            message.transferLimit = "";
        }
        if (object.permissions !== undefined && object.permissions !== null) {
            for (const e of object.permissions) {
                message.permissions.push(permissionFromJSON(e));
            }
        }
        if (object.unitDenom !== undefined && object.unitDenom !== null) {
            message.unitDenom = String(object.unitDenom);
        }
        else {
            message.unitDenom = "";
        }
        if (object.ibcCounterpartyDenom !== undefined &&
            object.ibcCounterpartyDenom !== null) {
            message.ibcCounterpartyDenom = String(object.ibcCounterpartyDenom);
        }
        else {
            message.ibcCounterpartyDenom = "";
        }
        if (object.ibcCounterpartyChainId !== undefined &&
            object.ibcCounterpartyChainId !== null) {
            message.ibcCounterpartyChainId = String(object.ibcCounterpartyChainId);
        }
        else {
            message.ibcCounterpartyChainId = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.decimals !== undefined &&
            (obj.decimals = (message.decimals || long_1.default.ZERO).toString());
        message.denom !== undefined && (obj.denom = message.denom);
        message.baseDenom !== undefined && (obj.baseDenom = message.baseDenom);
        message.path !== undefined && (obj.path = message.path);
        message.ibcChannelId !== undefined &&
            (obj.ibcChannelId = message.ibcChannelId);
        message.ibcCounterpartyChannelId !== undefined &&
            (obj.ibcCounterpartyChannelId = message.ibcCounterpartyChannelId);
        message.displayName !== undefined &&
            (obj.displayName = message.displayName);
        message.displaySymbol !== undefined &&
            (obj.displaySymbol = message.displaySymbol);
        message.network !== undefined && (obj.network = message.network);
        message.address !== undefined && (obj.address = message.address);
        message.externalSymbol !== undefined &&
            (obj.externalSymbol = message.externalSymbol);
        message.transferLimit !== undefined &&
            (obj.transferLimit = message.transferLimit);
        if (message.permissions) {
            obj.permissions = message.permissions.map((e) => permissionToJSON(e));
        }
        else {
            obj.permissions = [];
        }
        message.unitDenom !== undefined && (obj.unitDenom = message.unitDenom);
        message.ibcCounterpartyDenom !== undefined &&
            (obj.ibcCounterpartyDenom = message.ibcCounterpartyDenom);
        message.ibcCounterpartyChainId !== undefined &&
            (obj.ibcCounterpartyChainId = message.ibcCounterpartyChainId);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseRegistryEntry);
        message.permissions = [];
        if (object.decimals !== undefined && object.decimals !== null) {
            message.decimals = object.decimals;
        }
        else {
            message.decimals = long_1.default.ZERO;
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        else {
            message.denom = "";
        }
        if (object.baseDenom !== undefined && object.baseDenom !== null) {
            message.baseDenom = object.baseDenom;
        }
        else {
            message.baseDenom = "";
        }
        if (object.path !== undefined && object.path !== null) {
            message.path = object.path;
        }
        else {
            message.path = "";
        }
        if (object.ibcChannelId !== undefined && object.ibcChannelId !== null) {
            message.ibcChannelId = object.ibcChannelId;
        }
        else {
            message.ibcChannelId = "";
        }
        if (object.ibcCounterpartyChannelId !== undefined &&
            object.ibcCounterpartyChannelId !== null) {
            message.ibcCounterpartyChannelId = object.ibcCounterpartyChannelId;
        }
        else {
            message.ibcCounterpartyChannelId = "";
        }
        if (object.displayName !== undefined && object.displayName !== null) {
            message.displayName = object.displayName;
        }
        else {
            message.displayName = "";
        }
        if (object.displaySymbol !== undefined && object.displaySymbol !== null) {
            message.displaySymbol = object.displaySymbol;
        }
        else {
            message.displaySymbol = "";
        }
        if (object.network !== undefined && object.network !== null) {
            message.network = object.network;
        }
        else {
            message.network = "";
        }
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.externalSymbol !== undefined && object.externalSymbol !== null) {
            message.externalSymbol = object.externalSymbol;
        }
        else {
            message.externalSymbol = "";
        }
        if (object.transferLimit !== undefined && object.transferLimit !== null) {
            message.transferLimit = object.transferLimit;
        }
        else {
            message.transferLimit = "";
        }
        if (object.permissions !== undefined && object.permissions !== null) {
            for (const e of object.permissions) {
                message.permissions.push(e);
            }
        }
        if (object.unitDenom !== undefined && object.unitDenom !== null) {
            message.unitDenom = object.unitDenom;
        }
        else {
            message.unitDenom = "";
        }
        if (object.ibcCounterpartyDenom !== undefined &&
            object.ibcCounterpartyDenom !== null) {
            message.ibcCounterpartyDenom = object.ibcCounterpartyDenom;
        }
        else {
            message.ibcCounterpartyDenom = "";
        }
        if (object.ibcCounterpartyChainId !== undefined &&
            object.ibcCounterpartyChainId !== null) {
            message.ibcCounterpartyChainId = object.ibcCounterpartyChainId;
        }
        else {
            message.ibcCounterpartyChainId = "";
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=types.js.map