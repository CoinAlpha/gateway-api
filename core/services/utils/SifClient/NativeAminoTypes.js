"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeAminoTypes = void 0;
const stargate_1 = require("@cosmjs/stargate");
const NativeDexClient_1 = require("./NativeDexClient");
const inflection = __importStar(require("inflection"));
class NativeAminoTypes extends stargate_1.AminoTypes {
    constructor() {
        const options = {
            additions: createAminoAdditions(),
            prefix: undefined,
        };
        super(options);
        const wrapAdditionToAminoFn = (key, wrapFn) => {
            var _a;
            const originalAddition = (_a = options.additions) === null || _a === void 0 ? void 0 : _a[key];
            if (originalAddition) {
                const originalToAmino = originalAddition.toAmino;
                // @ts-ignore
                originalAddition.toAmino = (value) => {
                    return wrapFn(value, originalToAmino);
                };
            }
        };
        wrapAdditionToAminoFn("/ibc.applications.transfer.v1.MsgTransfer", (value, originalToAmino) => {
            value.timeoutHeight.revisionNumber = value.timeoutHeight.revisionNumber.toString();
            value.timeoutHeight.revisionHeight = value.timeoutHeight.revisionHeight.toString();
            const converted = originalToAmino(value);
            delete converted.timeout_timestamp;
            if (converted.timeout_height.revision_number == "0") {
                delete converted.timeout_height.revision_number;
            }
            return converted;
        });
        wrapAdditionToAminoFn("/sifnode.ethbridge.v1.MsgBurn", (value, originalToAmino) => {
            value.ethereumChainId = value.ethereumChainId.toString();
            return originalToAmino(value);
        });
        wrapAdditionToAminoFn("/sifnode.ethbridge.v1.MsgLock", (value, originalToAmino) => {
            value.ethereumChainId = value.ethereumChainId.toString();
            return originalToAmino(value);
        });
    }
}
exports.NativeAminoTypes = NativeAminoTypes;
const createAminoTypeNameFromProtoTypeUrl = (typeUrl) => {
    if (typeUrl.startsWith("/ibc")) {
        return typeUrl
            .split(".")
            .filter(Boolean)
            .filter((part) => {
            return !/applications|v1|transfer/.test(part);
        })
            .map((part) => {
            if (part === "/ibc")
                return "cosmos-sdk";
            return part;
        })
            .join("/");
    }
    if (typeUrl.includes("sifnode") && !/MsgBurn|MsgLock/.test(typeUrl)) {
        typeUrl = typeUrl.replace("Msg", "");
    }
    const [_namespace, cosmosModule, _version, messageType] = typeUrl.split(".");
    const aminoTypeUrl = `${cosmosModule}/${messageType}`;
    switch (aminoTypeUrl) {
        case "dispensation/CreateUserClaim": {
            return "dispensation/claim";
        }
        case "bank/MsgSend": {
            return "cosmos-sdk/MsgSend";
        }
        default: {
            return aminoTypeUrl;
        }
    }
};
const convertToSnakeCaseDeep = (obj) => {
    if (typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => convertToSnakeCaseDeep(item));
    }
    const newObj = {};
    for (let prop in obj) {
        newObj[inflection.underscore(prop)] = convertToSnakeCaseDeep(obj[prop]);
    }
    return newObj;
};
const convertToCamelCaseDeep = (obj) => {
    if (typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => convertToCamelCaseDeep(item));
    }
    const newObj = {};
    for (let prop in obj) {
        newObj[inflection.underscore(prop)] = convertToCamelCaseDeep(obj[prop]);
    }
    return newObj;
};
const createAminoAdditions = () => {
    /*
  
      export const liquidityTypes = {
        '/tendermint.liquidity.v1beta1.MsgCreatePool': {
          aminoType: 'liquidity/MsgCreatePool',
          toAmino: ({ poolCreatorAddress, poolTypeId, depositCoins }: MsgCreatePool): AminoMsgCreatePool['value'] => ({
            pool_creator_address: poolCreatorAddress,
            pool_type_id: poolTypeId,
            deposit_coins: [...depositCoins],
          }),
          fromAmino: ({ pool_creator_address, pool_type_id, deposit_coins }: AminoMsgCreatePool['value']): MsgCreatePool => ({
            poolCreatorAddress: pool_creator_address,
            poolTypeId: pool_type_id,
            depositCoins: [...deposit_coins],
          }),
        }
      };
  
    */
    const aminoAdditions = {};
    const protogens = NativeDexClient_1.NativeDexClient.getGeneratedTypes();
    for (let [typeUrl, _genType] of protogens) {
        // if (!typeUrl.includes("sifnode")) continue;
        aminoAdditions[typeUrl] = {
            aminoType: createAminoTypeNameFromProtoTypeUrl(typeUrl),
            toAmino: (value) => convertToSnakeCaseDeep(value),
            fromAmino: (value) => convertToCamelCaseDeep(value),
        };
    }
    return aminoAdditions;
};
//# sourceMappingURL=NativeAminoTypes.js.map