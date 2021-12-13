import { AminoConverter, AminoTypes } from "@cosmjs/stargate";
import { NativeDexClient } from "./NativeDexClient";
import * as inflection from "inflection";
import { AminoMsg } from "@cosmjs/amino";

export class NativeAminoTypes extends AminoTypes {
  constructor() {
    const options = {
      additions: createAminoAdditions(),
      prefix: undefined,
    };
    super(options);

    type ToAminoFn = (value: any) => any;

    const wrapAdditionToAminoFn = (
      key: string,
      wrapFn: (value: any, original: ToAminoFn) => any,
    ) => {
      const originalAddition = options.additions?.[key];
      if (originalAddition) {
        const originalToAmino = originalAddition.toAmino;

        // @ts-ignore
        originalAddition.toAmino = (value: any) => {
          return wrapFn(value, originalToAmino);
        };
      }
    };

    wrapAdditionToAminoFn(
      "/ibc.applications.transfer.v1.MsgTransfer",
      (value: any, originalToAmino: ToAminoFn) => {
        value.timeoutHeight.revisionNumber =
          value.timeoutHeight.revisionNumber.toString();
        value.timeoutHeight.revisionHeight =
          value.timeoutHeight.revisionHeight.toString();
        const converted = originalToAmino(value);
        delete converted.timeout_timestamp;
        if (converted.timeout_height.revision_number == "0") {
          delete converted.timeout_height.revision_number;
        }
        return converted;
      },
    );

    wrapAdditionToAminoFn(
      "/sifnode.ethbridge.v1.MsgBurn",
      (value: any, originalToAmino: ToAminoFn) => {
        value.ethereumChainId = value.ethereumChainId.toString();
        return originalToAmino(value);
      },
    );

    wrapAdditionToAminoFn(
      "/sifnode.ethbridge.v1.MsgLock",
      (value: any, originalToAmino: ToAminoFn) => {
        value.ethereumChainId = value.ethereumChainId.toString();
        return originalToAmino(value);
      },
    );
  }
}

const createAminoTypeNameFromProtoTypeUrl = (typeUrl: string) => {
  if (typeUrl.startsWith("/ibc")) {
    return typeUrl
      .split(".")
      .filter(Boolean)
      .filter((part) => {
        return !/applications|v1|transfer/.test(part);
      })
      .map((part) => {
        if (part === "/ibc") return "cosmos-sdk";
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

const convertToSnakeCaseDeep = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSnakeCaseDeep(item));
  }
  const newObj: any = {};
  for (let prop in obj) {
    newObj[inflection.underscore(prop)] = convertToSnakeCaseDeep(obj[prop]);
  }
  return newObj;
};

const convertToCamelCaseDeep = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCaseDeep(item));
  }
  const newObj: any = {};
  for (let prop in obj) {
    newObj[inflection.underscore(prop)] = convertToCamelCaseDeep(obj[prop]);
  }
  return newObj;
};

const createAminoAdditions = (): Record<string, AminoConverter> => {
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
  const aminoAdditions: Record<string, AminoConverter> = {};
  const protogens = NativeDexClient.getGeneratedTypes();
  for (let [typeUrl, _genType] of protogens) {
    // if (!typeUrl.includes("sifnode")) continue;
    aminoAdditions[typeUrl] = {
      aminoType: createAminoTypeNameFromProtoTypeUrl(typeUrl),
      toAmino: (value: any): AminoMsg => convertToSnakeCaseDeep(value),
      fromAmino: (value: AminoMsg): any => convertToCamelCaseDeep(value),
    };
  }
  return aminoAdditions;
};
