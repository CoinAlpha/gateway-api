/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "sifnode.clp.v1";

export interface Asset {
  symbol: string;
}

export interface Pool {
  externalAsset?: Asset;
  nativeAssetBalance: string;
  externalAssetBalance: string;
  poolUnits: string;
}

export interface LiquidityProvider {
  asset?: Asset;
  liquidityProviderUnits: string;
  liquidityProviderAddress: string;
}

export interface WhiteList {
  validatorList: string[];
}

export interface LiquidityProviderData {
  liquidityProvider?: LiquidityProvider;
  nativeAssetBalance: string;
  externalAssetBalance: string;
}

const baseAsset: object = { symbol: "" };

export const Asset = {
  encode(message: Asset, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Asset {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAsset } as Asset;
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

  fromJSON(object: any): Asset {
    const message = { ...baseAsset } as Asset;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    return message;
  },

  toJSON(message: Asset): unknown {
    const obj: any = {};
    message.symbol !== undefined && (obj.symbol = message.symbol);
    return obj;
  },

  fromPartial(object: DeepPartial<Asset>): Asset {
    const message = { ...baseAsset } as Asset;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    return message;
  },
};

const basePool: object = {
  nativeAssetBalance: "",
  externalAssetBalance: "",
  poolUnits: "",
};

export const Pool = {
  encode(message: Pool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.externalAsset !== undefined) {
      Asset.encode(message.externalAsset, writer.uint32(10).fork()).ldelim();
    }
    if (message.nativeAssetBalance !== "") {
      writer.uint32(18).string(message.nativeAssetBalance);
    }
    if (message.externalAssetBalance !== "") {
      writer.uint32(26).string(message.externalAssetBalance);
    }
    if (message.poolUnits !== "") {
      writer.uint32(34).string(message.poolUnits);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePool } as Pool;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.externalAsset = Asset.decode(reader, reader.uint32());
          break;
        case 2:
          message.nativeAssetBalance = reader.string();
          break;
        case 3:
          message.externalAssetBalance = reader.string();
          break;
        case 4:
          message.poolUnits = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Pool {
    const message = { ...basePool } as Pool;
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromJSON(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetBalance !== undefined &&
      object.nativeAssetBalance !== null
    ) {
      message.nativeAssetBalance = String(object.nativeAssetBalance);
    } else {
      message.nativeAssetBalance = "";
    }
    if (
      object.externalAssetBalance !== undefined &&
      object.externalAssetBalance !== null
    ) {
      message.externalAssetBalance = String(object.externalAssetBalance);
    } else {
      message.externalAssetBalance = "";
    }
    if (object.poolUnits !== undefined && object.poolUnits !== null) {
      message.poolUnits = String(object.poolUnits);
    } else {
      message.poolUnits = "";
    }
    return message;
  },

  toJSON(message: Pool): unknown {
    const obj: any = {};
    message.externalAsset !== undefined &&
      (obj.externalAsset = message.externalAsset
        ? Asset.toJSON(message.externalAsset)
        : undefined);
    message.nativeAssetBalance !== undefined &&
      (obj.nativeAssetBalance = message.nativeAssetBalance);
    message.externalAssetBalance !== undefined &&
      (obj.externalAssetBalance = message.externalAssetBalance);
    message.poolUnits !== undefined && (obj.poolUnits = message.poolUnits);
    return obj;
  },

  fromPartial(object: DeepPartial<Pool>): Pool {
    const message = { ...basePool } as Pool;
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromPartial(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetBalance !== undefined &&
      object.nativeAssetBalance !== null
    ) {
      message.nativeAssetBalance = object.nativeAssetBalance;
    } else {
      message.nativeAssetBalance = "";
    }
    if (
      object.externalAssetBalance !== undefined &&
      object.externalAssetBalance !== null
    ) {
      message.externalAssetBalance = object.externalAssetBalance;
    } else {
      message.externalAssetBalance = "";
    }
    if (object.poolUnits !== undefined && object.poolUnits !== null) {
      message.poolUnits = object.poolUnits;
    } else {
      message.poolUnits = "";
    }
    return message;
  },
};

const baseLiquidityProvider: object = {
  liquidityProviderUnits: "",
  liquidityProviderAddress: "",
};

export const LiquidityProvider = {
  encode(
    message: LiquidityProvider,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.asset !== undefined) {
      Asset.encode(message.asset, writer.uint32(10).fork()).ldelim();
    }
    if (message.liquidityProviderUnits !== "") {
      writer.uint32(18).string(message.liquidityProviderUnits);
    }
    if (message.liquidityProviderAddress !== "") {
      writer.uint32(26).string(message.liquidityProviderAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LiquidityProvider {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProvider } as LiquidityProvider;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.asset = Asset.decode(reader, reader.uint32());
          break;
        case 2:
          message.liquidityProviderUnits = reader.string();
          break;
        case 3:
          message.liquidityProviderAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProvider {
    const message = { ...baseLiquidityProvider } as LiquidityProvider;
    if (object.asset !== undefined && object.asset !== null) {
      message.asset = Asset.fromJSON(object.asset);
    } else {
      message.asset = undefined;
    }
    if (
      object.liquidityProviderUnits !== undefined &&
      object.liquidityProviderUnits !== null
    ) {
      message.liquidityProviderUnits = String(object.liquidityProviderUnits);
    } else {
      message.liquidityProviderUnits = "";
    }
    if (
      object.liquidityProviderAddress !== undefined &&
      object.liquidityProviderAddress !== null
    ) {
      message.liquidityProviderAddress = String(
        object.liquidityProviderAddress,
      );
    } else {
      message.liquidityProviderAddress = "";
    }
    return message;
  },

  toJSON(message: LiquidityProvider): unknown {
    const obj: any = {};
    message.asset !== undefined &&
      (obj.asset = message.asset ? Asset.toJSON(message.asset) : undefined);
    message.liquidityProviderUnits !== undefined &&
      (obj.liquidityProviderUnits = message.liquidityProviderUnits);
    message.liquidityProviderAddress !== undefined &&
      (obj.liquidityProviderAddress = message.liquidityProviderAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<LiquidityProvider>): LiquidityProvider {
    const message = { ...baseLiquidityProvider } as LiquidityProvider;
    if (object.asset !== undefined && object.asset !== null) {
      message.asset = Asset.fromPartial(object.asset);
    } else {
      message.asset = undefined;
    }
    if (
      object.liquidityProviderUnits !== undefined &&
      object.liquidityProviderUnits !== null
    ) {
      message.liquidityProviderUnits = object.liquidityProviderUnits;
    } else {
      message.liquidityProviderUnits = "";
    }
    if (
      object.liquidityProviderAddress !== undefined &&
      object.liquidityProviderAddress !== null
    ) {
      message.liquidityProviderAddress = object.liquidityProviderAddress;
    } else {
      message.liquidityProviderAddress = "";
    }
    return message;
  },
};

const baseWhiteList: object = { validatorList: "" };

export const WhiteList = {
  encode(
    message: WhiteList,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.validatorList) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WhiteList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWhiteList } as WhiteList;
    message.validatorList = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorList.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WhiteList {
    const message = { ...baseWhiteList } as WhiteList;
    message.validatorList = [];
    if (object.validatorList !== undefined && object.validatorList !== null) {
      for (const e of object.validatorList) {
        message.validatorList.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: WhiteList): unknown {
    const obj: any = {};
    if (message.validatorList) {
      obj.validatorList = message.validatorList.map((e) => e);
    } else {
      obj.validatorList = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<WhiteList>): WhiteList {
    const message = { ...baseWhiteList } as WhiteList;
    message.validatorList = [];
    if (object.validatorList !== undefined && object.validatorList !== null) {
      for (const e of object.validatorList) {
        message.validatorList.push(e);
      }
    }
    return message;
  },
};

const baseLiquidityProviderData: object = {
  nativeAssetBalance: "",
  externalAssetBalance: "",
};

export const LiquidityProviderData = {
  encode(
    message: LiquidityProviderData,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.liquidityProvider !== undefined) {
      LiquidityProvider.encode(
        message.liquidityProvider,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.nativeAssetBalance !== "") {
      writer.uint32(18).string(message.nativeAssetBalance);
    }
    if (message.externalAssetBalance !== "") {
      writer.uint32(26).string(message.externalAssetBalance);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProviderData } as LiquidityProviderData;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidityProvider = LiquidityProvider.decode(
            reader,
            reader.uint32(),
          );
          break;
        case 2:
          message.nativeAssetBalance = reader.string();
          break;
        case 3:
          message.externalAssetBalance = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderData {
    const message = { ...baseLiquidityProviderData } as LiquidityProviderData;
    if (
      object.liquidityProvider !== undefined &&
      object.liquidityProvider !== null
    ) {
      message.liquidityProvider = LiquidityProvider.fromJSON(
        object.liquidityProvider,
      );
    } else {
      message.liquidityProvider = undefined;
    }
    if (
      object.nativeAssetBalance !== undefined &&
      object.nativeAssetBalance !== null
    ) {
      message.nativeAssetBalance = String(object.nativeAssetBalance);
    } else {
      message.nativeAssetBalance = "";
    }
    if (
      object.externalAssetBalance !== undefined &&
      object.externalAssetBalance !== null
    ) {
      message.externalAssetBalance = String(object.externalAssetBalance);
    } else {
      message.externalAssetBalance = "";
    }
    return message;
  },

  toJSON(message: LiquidityProviderData): unknown {
    const obj: any = {};
    message.liquidityProvider !== undefined &&
      (obj.liquidityProvider = message.liquidityProvider
        ? LiquidityProvider.toJSON(message.liquidityProvider)
        : undefined);
    message.nativeAssetBalance !== undefined &&
      (obj.nativeAssetBalance = message.nativeAssetBalance);
    message.externalAssetBalance !== undefined &&
      (obj.externalAssetBalance = message.externalAssetBalance);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProviderData>,
  ): LiquidityProviderData {
    const message = { ...baseLiquidityProviderData } as LiquidityProviderData;
    if (
      object.liquidityProvider !== undefined &&
      object.liquidityProvider !== null
    ) {
      message.liquidityProvider = LiquidityProvider.fromPartial(
        object.liquidityProvider,
      );
    } else {
      message.liquidityProvider = undefined;
    }
    if (
      object.nativeAssetBalance !== undefined &&
      object.nativeAssetBalance !== null
    ) {
      message.nativeAssetBalance = object.nativeAssetBalance;
    } else {
      message.nativeAssetBalance = "";
    }
    if (
      object.externalAssetBalance !== undefined &&
      object.externalAssetBalance !== null
    ) {
      message.externalAssetBalance = object.externalAssetBalance;
    } else {
      message.externalAssetBalance = "";
    }
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined
  | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
