/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Asset } from "../../../sifnode/clp/v1/types";

export const protobufPackage = "sifnode.clp.v1";

export interface MsgRemoveLiquidity {
  signer: string;
  externalAsset?: Asset;
  wBasisPoints: string;
  asymmetry: string;
}

export interface MsgRemoveLiquidityResponse {}

export interface MsgCreatePool {
  signer: string;
  externalAsset?: Asset;
  nativeAssetAmount: string;
  externalAssetAmount: string;
}

export interface MsgCreatePoolResponse {}

export interface MsgAddLiquidity {
  signer: string;
  externalAsset?: Asset;
  nativeAssetAmount: string;
  externalAssetAmount: string;
}

export interface MsgAddLiquidityResponse {}

export interface MsgSwap {
  signer: string;
  sentAsset?: Asset;
  receivedAsset?: Asset;
  sentAmount: string;
  minReceivingAmount: string;
}

export interface MsgSwapResponse {}

export interface MsgDecommissionPool {
  signer: string;
  symbol: string;
}

export interface MsgDecommissionPoolResponse {}

const baseMsgRemoveLiquidity: object = {
  signer: "",
  wBasisPoints: "",
  asymmetry: "",
};

export const MsgRemoveLiquidity = {
  encode(
    message: MsgRemoveLiquidity,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.externalAsset !== undefined) {
      Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
    }
    if (message.wBasisPoints !== "") {
      writer.uint32(26).string(message.wBasisPoints);
    }
    if (message.asymmetry !== "") {
      writer.uint32(34).string(message.asymmetry);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveLiquidity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRemoveLiquidity } as MsgRemoveLiquidity;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.externalAsset = Asset.decode(reader, reader.uint32());
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

  fromJSON(object: any): MsgRemoveLiquidity {
    const message = { ...baseMsgRemoveLiquidity } as MsgRemoveLiquidity;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromJSON(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (object.wBasisPoints !== undefined && object.wBasisPoints !== null) {
      message.wBasisPoints = String(object.wBasisPoints);
    } else {
      message.wBasisPoints = "";
    }
    if (object.asymmetry !== undefined && object.asymmetry !== null) {
      message.asymmetry = String(object.asymmetry);
    } else {
      message.asymmetry = "";
    }
    return message;
  },

  toJSON(message: MsgRemoveLiquidity): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.externalAsset !== undefined &&
      (obj.externalAsset = message.externalAsset
        ? Asset.toJSON(message.externalAsset)
        : undefined);
    message.wBasisPoints !== undefined &&
      (obj.wBasisPoints = message.wBasisPoints);
    message.asymmetry !== undefined && (obj.asymmetry = message.asymmetry);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRemoveLiquidity>): MsgRemoveLiquidity {
    const message = { ...baseMsgRemoveLiquidity } as MsgRemoveLiquidity;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromPartial(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (object.wBasisPoints !== undefined && object.wBasisPoints !== null) {
      message.wBasisPoints = object.wBasisPoints;
    } else {
      message.wBasisPoints = "";
    }
    if (object.asymmetry !== undefined && object.asymmetry !== null) {
      message.asymmetry = object.asymmetry;
    } else {
      message.asymmetry = "";
    }
    return message;
  },
};

const baseMsgRemoveLiquidityResponse: object = {};

export const MsgRemoveLiquidityResponse = {
  encode(
    _: MsgRemoveLiquidityResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRemoveLiquidityResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRemoveLiquidityResponse,
    } as MsgRemoveLiquidityResponse;
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

  fromJSON(_: any): MsgRemoveLiquidityResponse {
    const message = {
      ...baseMsgRemoveLiquidityResponse,
    } as MsgRemoveLiquidityResponse;
    return message;
  },

  toJSON(_: MsgRemoveLiquidityResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgRemoveLiquidityResponse>,
  ): MsgRemoveLiquidityResponse {
    const message = {
      ...baseMsgRemoveLiquidityResponse,
    } as MsgRemoveLiquidityResponse;
    return message;
  },
};

const baseMsgCreatePool: object = {
  signer: "",
  nativeAssetAmount: "",
  externalAssetAmount: "",
};

export const MsgCreatePool = {
  encode(
    message: MsgCreatePool,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.externalAsset !== undefined) {
      Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
    }
    if (message.nativeAssetAmount !== "") {
      writer.uint32(26).string(message.nativeAssetAmount);
    }
    if (message.externalAssetAmount !== "") {
      writer.uint32(34).string(message.externalAssetAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreatePool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.externalAsset = Asset.decode(reader, reader.uint32());
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

  fromJSON(object: any): MsgCreatePool {
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromJSON(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetAmount !== undefined &&
      object.nativeAssetAmount !== null
    ) {
      message.nativeAssetAmount = String(object.nativeAssetAmount);
    } else {
      message.nativeAssetAmount = "";
    }
    if (
      object.externalAssetAmount !== undefined &&
      object.externalAssetAmount !== null
    ) {
      message.externalAssetAmount = String(object.externalAssetAmount);
    } else {
      message.externalAssetAmount = "";
    }
    return message;
  },

  toJSON(message: MsgCreatePool): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.externalAsset !== undefined &&
      (obj.externalAsset = message.externalAsset
        ? Asset.toJSON(message.externalAsset)
        : undefined);
    message.nativeAssetAmount !== undefined &&
      (obj.nativeAssetAmount = message.nativeAssetAmount);
    message.externalAssetAmount !== undefined &&
      (obj.externalAssetAmount = message.externalAssetAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreatePool>): MsgCreatePool {
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromPartial(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetAmount !== undefined &&
      object.nativeAssetAmount !== null
    ) {
      message.nativeAssetAmount = object.nativeAssetAmount;
    } else {
      message.nativeAssetAmount = "";
    }
    if (
      object.externalAssetAmount !== undefined &&
      object.externalAssetAmount !== null
    ) {
      message.externalAssetAmount = object.externalAssetAmount;
    } else {
      message.externalAssetAmount = "";
    }
    return message;
  },
};

const baseMsgCreatePoolResponse: object = {};

export const MsgCreatePoolResponse = {
  encode(
    _: MsgCreatePoolResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreatePoolResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
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

  fromJSON(_: any): MsgCreatePoolResponse {
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
    return message;
  },

  toJSON(_: MsgCreatePoolResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgCreatePoolResponse>): MsgCreatePoolResponse {
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
    return message;
  },
};

const baseMsgAddLiquidity: object = {
  signer: "",
  nativeAssetAmount: "",
  externalAssetAmount: "",
};

export const MsgAddLiquidity = {
  encode(
    message: MsgAddLiquidity,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.externalAsset !== undefined) {
      Asset.encode(message.externalAsset, writer.uint32(18).fork()).ldelim();
    }
    if (message.nativeAssetAmount !== "") {
      writer.uint32(26).string(message.nativeAssetAmount);
    }
    if (message.externalAssetAmount !== "") {
      writer.uint32(34).string(message.externalAssetAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddLiquidity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAddLiquidity } as MsgAddLiquidity;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.externalAsset = Asset.decode(reader, reader.uint32());
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

  fromJSON(object: any): MsgAddLiquidity {
    const message = { ...baseMsgAddLiquidity } as MsgAddLiquidity;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromJSON(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetAmount !== undefined &&
      object.nativeAssetAmount !== null
    ) {
      message.nativeAssetAmount = String(object.nativeAssetAmount);
    } else {
      message.nativeAssetAmount = "";
    }
    if (
      object.externalAssetAmount !== undefined &&
      object.externalAssetAmount !== null
    ) {
      message.externalAssetAmount = String(object.externalAssetAmount);
    } else {
      message.externalAssetAmount = "";
    }
    return message;
  },

  toJSON(message: MsgAddLiquidity): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.externalAsset !== undefined &&
      (obj.externalAsset = message.externalAsset
        ? Asset.toJSON(message.externalAsset)
        : undefined);
    message.nativeAssetAmount !== undefined &&
      (obj.nativeAssetAmount = message.nativeAssetAmount);
    message.externalAssetAmount !== undefined &&
      (obj.externalAssetAmount = message.externalAssetAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgAddLiquidity>): MsgAddLiquidity {
    const message = { ...baseMsgAddLiquidity } as MsgAddLiquidity;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.externalAsset !== undefined && object.externalAsset !== null) {
      message.externalAsset = Asset.fromPartial(object.externalAsset);
    } else {
      message.externalAsset = undefined;
    }
    if (
      object.nativeAssetAmount !== undefined &&
      object.nativeAssetAmount !== null
    ) {
      message.nativeAssetAmount = object.nativeAssetAmount;
    } else {
      message.nativeAssetAmount = "";
    }
    if (
      object.externalAssetAmount !== undefined &&
      object.externalAssetAmount !== null
    ) {
      message.externalAssetAmount = object.externalAssetAmount;
    } else {
      message.externalAssetAmount = "";
    }
    return message;
  },
};

const baseMsgAddLiquidityResponse: object = {};

export const MsgAddLiquidityResponse = {
  encode(
    _: MsgAddLiquidityResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgAddLiquidityResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgAddLiquidityResponse,
    } as MsgAddLiquidityResponse;
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

  fromJSON(_: any): MsgAddLiquidityResponse {
    const message = {
      ...baseMsgAddLiquidityResponse,
    } as MsgAddLiquidityResponse;
    return message;
  },

  toJSON(_: MsgAddLiquidityResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgAddLiquidityResponse>,
  ): MsgAddLiquidityResponse {
    const message = {
      ...baseMsgAddLiquidityResponse,
    } as MsgAddLiquidityResponse;
    return message;
  },
};

const baseMsgSwap: object = {
  signer: "",
  sentAmount: "",
  minReceivingAmount: "",
};

export const MsgSwap = {
  encode(
    message: MsgSwap,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.sentAsset !== undefined) {
      Asset.encode(message.sentAsset, writer.uint32(18).fork()).ldelim();
    }
    if (message.receivedAsset !== undefined) {
      Asset.encode(message.receivedAsset, writer.uint32(26).fork()).ldelim();
    }
    if (message.sentAmount !== "") {
      writer.uint32(34).string(message.sentAmount);
    }
    if (message.minReceivingAmount !== "") {
      writer.uint32(42).string(message.minReceivingAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwap {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSwap } as MsgSwap;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.sentAsset = Asset.decode(reader, reader.uint32());
          break;
        case 3:
          message.receivedAsset = Asset.decode(reader, reader.uint32());
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

  fromJSON(object: any): MsgSwap {
    const message = { ...baseMsgSwap } as MsgSwap;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.sentAsset !== undefined && object.sentAsset !== null) {
      message.sentAsset = Asset.fromJSON(object.sentAsset);
    } else {
      message.sentAsset = undefined;
    }
    if (object.receivedAsset !== undefined && object.receivedAsset !== null) {
      message.receivedAsset = Asset.fromJSON(object.receivedAsset);
    } else {
      message.receivedAsset = undefined;
    }
    if (object.sentAmount !== undefined && object.sentAmount !== null) {
      message.sentAmount = String(object.sentAmount);
    } else {
      message.sentAmount = "";
    }
    if (
      object.minReceivingAmount !== undefined &&
      object.minReceivingAmount !== null
    ) {
      message.minReceivingAmount = String(object.minReceivingAmount);
    } else {
      message.minReceivingAmount = "";
    }
    return message;
  },

  toJSON(message: MsgSwap): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.sentAsset !== undefined &&
      (obj.sentAsset = message.sentAsset
        ? Asset.toJSON(message.sentAsset)
        : undefined);
    message.receivedAsset !== undefined &&
      (obj.receivedAsset = message.receivedAsset
        ? Asset.toJSON(message.receivedAsset)
        : undefined);
    message.sentAmount !== undefined && (obj.sentAmount = message.sentAmount);
    message.minReceivingAmount !== undefined &&
      (obj.minReceivingAmount = message.minReceivingAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSwap>): MsgSwap {
    const message = { ...baseMsgSwap } as MsgSwap;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.sentAsset !== undefined && object.sentAsset !== null) {
      message.sentAsset = Asset.fromPartial(object.sentAsset);
    } else {
      message.sentAsset = undefined;
    }
    if (object.receivedAsset !== undefined && object.receivedAsset !== null) {
      message.receivedAsset = Asset.fromPartial(object.receivedAsset);
    } else {
      message.receivedAsset = undefined;
    }
    if (object.sentAmount !== undefined && object.sentAmount !== null) {
      message.sentAmount = object.sentAmount;
    } else {
      message.sentAmount = "";
    }
    if (
      object.minReceivingAmount !== undefined &&
      object.minReceivingAmount !== null
    ) {
      message.minReceivingAmount = object.minReceivingAmount;
    } else {
      message.minReceivingAmount = "";
    }
    return message;
  },
};

const baseMsgSwapResponse: object = {};

export const MsgSwapResponse = {
  encode(
    _: MsgSwapResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSwapResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSwapResponse } as MsgSwapResponse;
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

  fromJSON(_: any): MsgSwapResponse {
    const message = { ...baseMsgSwapResponse } as MsgSwapResponse;
    return message;
  },

  toJSON(_: MsgSwapResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgSwapResponse>): MsgSwapResponse {
    const message = { ...baseMsgSwapResponse } as MsgSwapResponse;
    return message;
  },
};

const baseMsgDecommissionPool: object = { signer: "", symbol: "" };

export const MsgDecommissionPool = {
  encode(
    message: MsgDecommissionPool,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.symbol !== "") {
      writer.uint32(18).string(message.symbol);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDecommissionPool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDecommissionPool } as MsgDecommissionPool;
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

  fromJSON(object: any): MsgDecommissionPool {
    const message = { ...baseMsgDecommissionPool } as MsgDecommissionPool;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    return message;
  },

  toJSON(message: MsgDecommissionPool): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDecommissionPool>): MsgDecommissionPool {
    const message = { ...baseMsgDecommissionPool } as MsgDecommissionPool;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    return message;
  },
};

const baseMsgDecommissionPoolResponse: object = {};

export const MsgDecommissionPoolResponse = {
  encode(
    _: MsgDecommissionPoolResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDecommissionPoolResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDecommissionPoolResponse,
    } as MsgDecommissionPoolResponse;
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

  fromJSON(_: any): MsgDecommissionPoolResponse {
    const message = {
      ...baseMsgDecommissionPoolResponse,
    } as MsgDecommissionPoolResponse;
    return message;
  },

  toJSON(_: MsgDecommissionPoolResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDecommissionPoolResponse>,
  ): MsgDecommissionPoolResponse {
    const message = {
      ...baseMsgDecommissionPoolResponse,
    } as MsgDecommissionPoolResponse;
    return message;
  },
};

export interface Msg {
  RemoveLiquidity(
    request: MsgRemoveLiquidity,
  ): Promise<MsgRemoveLiquidityResponse>;
  CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse>;
  AddLiquidity(request: MsgAddLiquidity): Promise<MsgAddLiquidityResponse>;
  Swap(request: MsgSwap): Promise<MsgSwapResponse>;
  DecommissionPool(
    request: MsgDecommissionPool,
  ): Promise<MsgDecommissionPoolResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RemoveLiquidity = this.RemoveLiquidity.bind(this);
    this.CreatePool = this.CreatePool.bind(this);
    this.AddLiquidity = this.AddLiquidity.bind(this);
    this.Swap = this.Swap.bind(this);
    this.DecommissionPool = this.DecommissionPool.bind(this);
  }
  RemoveLiquidity(
    request: MsgRemoveLiquidity,
  ): Promise<MsgRemoveLiquidityResponse> {
    const data = MsgRemoveLiquidity.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Msg",
      "RemoveLiquidity",
      data,
    );
    return promise.then((data) =>
      MsgRemoveLiquidityResponse.decode(new _m0.Reader(data)),
    );
  }

  CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse> {
    const data = MsgCreatePool.encode(request).finish();
    const promise = this.rpc.request("sifnode.clp.v1.Msg", "CreatePool", data);
    return promise.then((data) =>
      MsgCreatePoolResponse.decode(new _m0.Reader(data)),
    );
  }

  AddLiquidity(request: MsgAddLiquidity): Promise<MsgAddLiquidityResponse> {
    const data = MsgAddLiquidity.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Msg",
      "AddLiquidity",
      data,
    );
    return promise.then((data) =>
      MsgAddLiquidityResponse.decode(new _m0.Reader(data)),
    );
  }

  Swap(request: MsgSwap): Promise<MsgSwapResponse> {
    const data = MsgSwap.encode(request).finish();
    const promise = this.rpc.request("sifnode.clp.v1.Msg", "Swap", data);
    return promise.then((data) => MsgSwapResponse.decode(new _m0.Reader(data)));
  }

  DecommissionPool(
    request: MsgDecommissionPool,
  ): Promise<MsgDecommissionPoolResponse> {
    const data = MsgDecommissionPool.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Msg",
      "DecommissionPool",
      data,
    );
    return promise.then((data) =>
      MsgDecommissionPoolResponse.decode(new _m0.Reader(data)),
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array,
  ): Promise<Uint8Array>;
}

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
