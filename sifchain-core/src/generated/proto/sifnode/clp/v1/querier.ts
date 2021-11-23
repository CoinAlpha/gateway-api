/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  Pool,
  LiquidityProvider,
  Asset,
  LiquidityProviderData,
} from "../../../sifnode/clp/v1/types";
import {
  PageRequest,
  PageResponse,
} from "../../../cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "sifnode.clp.v1";

export interface PoolReq {
  symbol: string;
}

export interface PoolRes {
  pool?: Pool;
  clpModuleAddress: string;
  height: Long;
}

export interface PoolsReq {
  pagination?: PageRequest;
}

export interface PoolsRes {
  pools: Pool[];
  clpModuleAddress: string;
  height: Long;
  pagination?: PageResponse;
}

export interface LiquidityProviderReq {
  symbol: string;
  lpAddress: string;
}

export interface LiquidityProviderRes {
  liquidityProvider?: LiquidityProvider;
  nativeAssetBalance: string;
  externalAssetBalance: string;
  height: Long;
}

export interface AssetListReq {
  lpAddress: string;
  pagination?: PageRequest;
}

export interface AssetListRes {
  assets: Asset[];
  height: Long;
  pagination?: PageResponse;
}

export interface LiquidityProviderDataReq {
  lpAddress: string;
  pagination?: PageRequest;
}

export interface LiquidityProviderDataRes {
  liquidityProviderData: LiquidityProviderData[];
  height: Long;
  pagination?: PageRequest;
}

export interface LiquidityProviderListReq {
  symbol: string;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}

export interface LiquidityProviderListRes {
  liquidityProviders: LiquidityProvider[];
  height: Long;
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse;
}

export interface LiquidityProvidersReq {
  pagination?: PageRequest;
}

export interface LiquidityProvidersRes {
  liquidityProviders: LiquidityProvider[];
  height: Long;
  pagination?: PageResponse;
}

const basePoolReq: object = { symbol: "" };

export const PoolReq = {
  encode(
    message: PoolReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePoolReq } as PoolReq;
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

  fromJSON(object: any): PoolReq {
    const message = { ...basePoolReq } as PoolReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    return message;
  },

  toJSON(message: PoolReq): unknown {
    const obj: any = {};
    message.symbol !== undefined && (obj.symbol = message.symbol);
    return obj;
  },

  fromPartial(object: DeepPartial<PoolReq>): PoolReq {
    const message = { ...basePoolReq } as PoolReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    return message;
  },
};

const basePoolRes: object = { clpModuleAddress: "", height: Long.ZERO };

export const PoolRes = {
  encode(
    message: PoolRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pool !== undefined) {
      Pool.encode(message.pool, writer.uint32(10).fork()).ldelim();
    }
    if (message.clpModuleAddress !== "") {
      writer.uint32(18).string(message.clpModuleAddress);
    }
    if (!message.height.isZero()) {
      writer.uint32(24).int64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePoolRes } as PoolRes;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pool = Pool.decode(reader, reader.uint32());
          break;
        case 2:
          message.clpModuleAddress = reader.string();
          break;
        case 3:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolRes {
    const message = { ...basePoolRes } as PoolRes;
    if (object.pool !== undefined && object.pool !== null) {
      message.pool = Pool.fromJSON(object.pool);
    } else {
      message.pool = undefined;
    }
    if (
      object.clpModuleAddress !== undefined &&
      object.clpModuleAddress !== null
    ) {
      message.clpModuleAddress = String(object.clpModuleAddress);
    } else {
      message.clpModuleAddress = "";
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: PoolRes): unknown {
    const obj: any = {};
    message.pool !== undefined &&
      (obj.pool = message.pool ? Pool.toJSON(message.pool) : undefined);
    message.clpModuleAddress !== undefined &&
      (obj.clpModuleAddress = message.clpModuleAddress);
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<PoolRes>): PoolRes {
    const message = { ...basePoolRes } as PoolRes;
    if (object.pool !== undefined && object.pool !== null) {
      message.pool = Pool.fromPartial(object.pool);
    } else {
      message.pool = undefined;
    }
    if (
      object.clpModuleAddress !== undefined &&
      object.clpModuleAddress !== null
    ) {
      message.clpModuleAddress = object.clpModuleAddress;
    } else {
      message.clpModuleAddress = "";
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

const basePoolsReq: object = {};

export const PoolsReq = {
  encode(
    message: PoolsReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolsReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePoolsReq } as PoolsReq;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolsReq {
    const message = { ...basePoolsReq } as PoolsReq;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: PoolsReq): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PoolsReq>): PoolsReq {
    const message = { ...basePoolsReq } as PoolsReq;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const basePoolsRes: object = { clpModuleAddress: "", height: Long.ZERO };

export const PoolsRes = {
  encode(
    message: PoolsRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.pools) {
      Pool.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.clpModuleAddress !== "") {
      writer.uint32(18).string(message.clpModuleAddress);
    }
    if (!message.height.isZero()) {
      writer.uint32(24).int64(message.height);
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolsRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePoolsRes } as PoolsRes;
    message.pools = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pools.push(Pool.decode(reader, reader.uint32()));
          break;
        case 2:
          message.clpModuleAddress = reader.string();
          break;
        case 3:
          message.height = reader.int64() as Long;
          break;
        case 4:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolsRes {
    const message = { ...basePoolsRes } as PoolsRes;
    message.pools = [];
    if (object.pools !== undefined && object.pools !== null) {
      for (const e of object.pools) {
        message.pools.push(Pool.fromJSON(e));
      }
    }
    if (
      object.clpModuleAddress !== undefined &&
      object.clpModuleAddress !== null
    ) {
      message.clpModuleAddress = String(object.clpModuleAddress);
    } else {
      message.clpModuleAddress = "";
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: PoolsRes): unknown {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map((e) => (e ? Pool.toJSON(e) : undefined));
    } else {
      obj.pools = [];
    }
    message.clpModuleAddress !== undefined &&
      (obj.clpModuleAddress = message.clpModuleAddress);
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PoolsRes>): PoolsRes {
    const message = { ...basePoolsRes } as PoolsRes;
    message.pools = [];
    if (object.pools !== undefined && object.pools !== null) {
      for (const e of object.pools) {
        message.pools.push(Pool.fromPartial(e));
      }
    }
    if (
      object.clpModuleAddress !== undefined &&
      object.clpModuleAddress !== null
    ) {
      message.clpModuleAddress = object.clpModuleAddress;
    } else {
      message.clpModuleAddress = "";
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProviderReq: object = { symbol: "", lpAddress: "" };

export const LiquidityProviderReq = {
  encode(
    message: LiquidityProviderReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    if (message.lpAddress !== "") {
      writer.uint32(18).string(message.lpAddress);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProviderReq } as LiquidityProviderReq;
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

  fromJSON(object: any): LiquidityProviderReq {
    const message = { ...baseLiquidityProviderReq } as LiquidityProviderReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = String(object.lpAddress);
    } else {
      message.lpAddress = "";
    }
    return message;
  },

  toJSON(message: LiquidityProviderReq): unknown {
    const obj: any = {};
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
    return obj;
  },

  fromPartial(object: DeepPartial<LiquidityProviderReq>): LiquidityProviderReq {
    const message = { ...baseLiquidityProviderReq } as LiquidityProviderReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = object.lpAddress;
    } else {
      message.lpAddress = "";
    }
    return message;
  },
};

const baseLiquidityProviderRes: object = {
  nativeAssetBalance: "",
  externalAssetBalance: "",
  height: Long.ZERO,
};

export const LiquidityProviderRes = {
  encode(
    message: LiquidityProviderRes,
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
    if (!message.height.isZero()) {
      writer.uint32(32).int64(message.height);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProviderRes } as LiquidityProviderRes;
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
        case 4:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderRes {
    const message = { ...baseLiquidityProviderRes } as LiquidityProviderRes;
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
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: LiquidityProviderRes): unknown {
    const obj: any = {};
    message.liquidityProvider !== undefined &&
      (obj.liquidityProvider = message.liquidityProvider
        ? LiquidityProvider.toJSON(message.liquidityProvider)
        : undefined);
    message.nativeAssetBalance !== undefined &&
      (obj.nativeAssetBalance = message.nativeAssetBalance);
    message.externalAssetBalance !== undefined &&
      (obj.externalAssetBalance = message.externalAssetBalance);
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<LiquidityProviderRes>): LiquidityProviderRes {
    const message = { ...baseLiquidityProviderRes } as LiquidityProviderRes;
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
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

const baseAssetListReq: object = { lpAddress: "" };

export const AssetListReq = {
  encode(
    message: AssetListReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.lpAddress !== "") {
      writer.uint32(10).string(message.lpAddress);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetListReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAssetListReq } as AssetListReq;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lpAddress = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AssetListReq {
    const message = { ...baseAssetListReq } as AssetListReq;
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = String(object.lpAddress);
    } else {
      message.lpAddress = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: AssetListReq): unknown {
    const obj: any = {};
    message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AssetListReq>): AssetListReq {
    const message = { ...baseAssetListReq } as AssetListReq;
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = object.lpAddress;
    } else {
      message.lpAddress = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseAssetListRes: object = { height: Long.ZERO };

export const AssetListRes = {
  encode(
    message: AssetListRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.assets) {
      Asset.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AssetListRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAssetListRes } as AssetListRes;
    message.assets = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.assets.push(Asset.decode(reader, reader.uint32()));
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        case 3:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AssetListRes {
    const message = { ...baseAssetListRes } as AssetListRes;
    message.assets = [];
    if (object.assets !== undefined && object.assets !== null) {
      for (const e of object.assets) {
        message.assets.push(Asset.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: AssetListRes): unknown {
    const obj: any = {};
    if (message.assets) {
      obj.assets = message.assets.map((e) => (e ? Asset.toJSON(e) : undefined));
    } else {
      obj.assets = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AssetListRes>): AssetListRes {
    const message = { ...baseAssetListRes } as AssetListRes;
    message.assets = [];
    if (object.assets !== undefined && object.assets !== null) {
      for (const e of object.assets) {
        message.assets.push(Asset.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProviderDataReq: object = { lpAddress: "" };

export const LiquidityProviderDataReq = {
  encode(
    message: LiquidityProviderDataReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.lpAddress !== "") {
      writer.uint32(10).string(message.lpAddress);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderDataReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLiquidityProviderDataReq,
    } as LiquidityProviderDataReq;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lpAddress = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderDataReq {
    const message = {
      ...baseLiquidityProviderDataReq,
    } as LiquidityProviderDataReq;
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = String(object.lpAddress);
    } else {
      message.lpAddress = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProviderDataReq): unknown {
    const obj: any = {};
    message.lpAddress !== undefined && (obj.lpAddress = message.lpAddress);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProviderDataReq>,
  ): LiquidityProviderDataReq {
    const message = {
      ...baseLiquidityProviderDataReq,
    } as LiquidityProviderDataReq;
    if (object.lpAddress !== undefined && object.lpAddress !== null) {
      message.lpAddress = object.lpAddress;
    } else {
      message.lpAddress = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProviderDataRes: object = { height: Long.ZERO };

export const LiquidityProviderDataRes = {
  encode(
    message: LiquidityProviderDataRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.liquidityProviderData) {
      LiquidityProviderData.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderDataRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLiquidityProviderDataRes,
    } as LiquidityProviderDataRes;
    message.liquidityProviderData = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidityProviderData.push(
            LiquidityProviderData.decode(reader, reader.uint32()),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderDataRes {
    const message = {
      ...baseLiquidityProviderDataRes,
    } as LiquidityProviderDataRes;
    message.liquidityProviderData = [];
    if (
      object.liquidityProviderData !== undefined &&
      object.liquidityProviderData !== null
    ) {
      for (const e of object.liquidityProviderData) {
        message.liquidityProviderData.push(LiquidityProviderData.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProviderDataRes): unknown {
    const obj: any = {};
    if (message.liquidityProviderData) {
      obj.liquidityProviderData = message.liquidityProviderData.map((e) =>
        e ? LiquidityProviderData.toJSON(e) : undefined,
      );
    } else {
      obj.liquidityProviderData = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProviderDataRes>,
  ): LiquidityProviderDataRes {
    const message = {
      ...baseLiquidityProviderDataRes,
    } as LiquidityProviderDataRes;
    message.liquidityProviderData = [];
    if (
      object.liquidityProviderData !== undefined &&
      object.liquidityProviderData !== null
    ) {
      for (const e of object.liquidityProviderData) {
        message.liquidityProviderData.push(
          LiquidityProviderData.fromPartial(e),
        );
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProviderListReq: object = { symbol: "" };

export const LiquidityProviderListReq = {
  encode(
    message: LiquidityProviderListReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.symbol !== "") {
      writer.uint32(10).string(message.symbol);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderListReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLiquidityProviderListReq,
    } as LiquidityProviderListReq;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.symbol = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderListReq {
    const message = {
      ...baseLiquidityProviderListReq,
    } as LiquidityProviderListReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProviderListReq): unknown {
    const obj: any = {};
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProviderListReq>,
  ): LiquidityProviderListReq {
    const message = {
      ...baseLiquidityProviderListReq,
    } as LiquidityProviderListReq;
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProviderListRes: object = { height: Long.ZERO };

export const LiquidityProviderListRes = {
  encode(
    message: LiquidityProviderListRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.liquidityProviders) {
      LiquidityProvider.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProviderListRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLiquidityProviderListRes,
    } as LiquidityProviderListRes;
    message.liquidityProviders = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidityProviders.push(
            LiquidityProvider.decode(reader, reader.uint32()),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        case 3:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProviderListRes {
    const message = {
      ...baseLiquidityProviderListRes,
    } as LiquidityProviderListRes;
    message.liquidityProviders = [];
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProviderListRes): unknown {
    const obj: any = {};
    if (message.liquidityProviders) {
      obj.liquidityProviders = message.liquidityProviders.map((e) =>
        e ? LiquidityProvider.toJSON(e) : undefined,
      );
    } else {
      obj.liquidityProviders = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProviderListRes>,
  ): LiquidityProviderListRes {
    const message = {
      ...baseLiquidityProviderListRes,
    } as LiquidityProviderListRes;
    message.liquidityProviders = [];
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProvidersReq: object = {};

export const LiquidityProvidersReq = {
  encode(
    message: LiquidityProvidersReq,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProvidersReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProvidersReq } as LiquidityProvidersReq;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProvidersReq {
    const message = { ...baseLiquidityProvidersReq } as LiquidityProvidersReq;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProvidersReq): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProvidersReq>,
  ): LiquidityProvidersReq {
    const message = { ...baseLiquidityProvidersReq } as LiquidityProvidersReq;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseLiquidityProvidersRes: object = { height: Long.ZERO };

export const LiquidityProvidersRes = {
  encode(
    message: LiquidityProvidersRes,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.liquidityProviders) {
      LiquidityProvider.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): LiquidityProvidersRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLiquidityProvidersRes } as LiquidityProvidersRes;
    message.liquidityProviders = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.liquidityProviders.push(
            LiquidityProvider.decode(reader, reader.uint32()),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        case 3:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LiquidityProvidersRes {
    const message = { ...baseLiquidityProvidersRes } as LiquidityProvidersRes;
    message.liquidityProviders = [];
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: LiquidityProvidersRes): unknown {
    const obj: any = {};
    if (message.liquidityProviders) {
      obj.liquidityProviders = message.liquidityProviders.map((e) =>
        e ? LiquidityProvider.toJSON(e) : undefined,
      );
    } else {
      obj.liquidityProviders = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LiquidityProvidersRes>,
  ): LiquidityProvidersRes {
    const message = { ...baseLiquidityProvidersRes } as LiquidityProvidersRes;
    message.liquidityProviders = [];
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

export interface Query {
  GetPool(request: PoolReq): Promise<PoolRes>;
  GetPools(request: PoolsReq): Promise<PoolsRes>;
  GetLiquidityProvider(
    request: LiquidityProviderReq,
  ): Promise<LiquidityProviderRes>;
  GetLiquidityProviderData(
    request: LiquidityProviderDataReq,
  ): Promise<LiquidityProviderDataRes>;
  GetAssetList(request: AssetListReq): Promise<AssetListRes>;
  GetLiquidityProviders(
    request: LiquidityProvidersReq,
  ): Promise<LiquidityProvidersRes>;
  GetLiquidityProviderList(
    request: LiquidityProviderListReq,
  ): Promise<LiquidityProviderListRes>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetPool = this.GetPool.bind(this);
    this.GetPools = this.GetPools.bind(this);
    this.GetLiquidityProvider = this.GetLiquidityProvider.bind(this);
    this.GetLiquidityProviderData = this.GetLiquidityProviderData.bind(this);
    this.GetAssetList = this.GetAssetList.bind(this);
    this.GetLiquidityProviders = this.GetLiquidityProviders.bind(this);
    this.GetLiquidityProviderList = this.GetLiquidityProviderList.bind(this);
  }
  GetPool(request: PoolReq): Promise<PoolRes> {
    const data = PoolReq.encode(request).finish();
    const promise = this.rpc.request("sifnode.clp.v1.Query", "GetPool", data);
    return promise.then((data) => PoolRes.decode(new _m0.Reader(data)));
  }

  GetPools(request: PoolsReq): Promise<PoolsRes> {
    const data = PoolsReq.encode(request).finish();
    const promise = this.rpc.request("sifnode.clp.v1.Query", "GetPools", data);
    return promise.then((data) => PoolsRes.decode(new _m0.Reader(data)));
  }

  GetLiquidityProvider(
    request: LiquidityProviderReq,
  ): Promise<LiquidityProviderRes> {
    const data = LiquidityProviderReq.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Query",
      "GetLiquidityProvider",
      data,
    );
    return promise.then((data) =>
      LiquidityProviderRes.decode(new _m0.Reader(data)),
    );
  }

  GetLiquidityProviderData(
    request: LiquidityProviderDataReq,
  ): Promise<LiquidityProviderDataRes> {
    const data = LiquidityProviderDataReq.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Query",
      "GetLiquidityProviderData",
      data,
    );
    return promise.then((data) =>
      LiquidityProviderDataRes.decode(new _m0.Reader(data)),
    );
  }

  GetAssetList(request: AssetListReq): Promise<AssetListRes> {
    const data = AssetListReq.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Query",
      "GetAssetList",
      data,
    );
    return promise.then((data) => AssetListRes.decode(new _m0.Reader(data)));
  }

  GetLiquidityProviders(
    request: LiquidityProvidersReq,
  ): Promise<LiquidityProvidersRes> {
    const data = LiquidityProvidersReq.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Query",
      "GetLiquidityProviders",
      data,
    );
    return promise.then((data) =>
      LiquidityProvidersRes.decode(new _m0.Reader(data)),
    );
  }

  GetLiquidityProviderList(
    request: LiquidityProviderListReq,
  ): Promise<LiquidityProviderListRes> {
    const data = LiquidityProviderListReq.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.clp.v1.Query",
      "GetLiquidityProviderList",
      data,
    );
    return promise.then((data) =>
      LiquidityProviderListRes.decode(new _m0.Reader(data)),
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
