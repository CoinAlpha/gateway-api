/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params } from "../../../sifnode/clp/v1/params";
import { Pool, LiquidityProvider } from "../../../sifnode/clp/v1/types";

export const protobufPackage = "sifnode.clp.v1";

/**
 * GenesisState - all clp state that must be provided at genesis
 * TODO: Add parameters to Genesis state ,such as minimum liquidity required to
 * create a pool
 */
export interface GenesisState {
  params?: Params;
  addressWhitelist: string[];
  poolList: Pool[];
  liquidityProviders: LiquidityProvider[];
}

const baseGenesisState: object = { addressWhitelist: "" };

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.addressWhitelist) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.poolList) {
      Pool.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.liquidityProviders) {
      LiquidityProvider.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
    message.addressWhitelist = [];
    message.poolList = [];
    message.liquidityProviders = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.addressWhitelist.push(reader.string());
          break;
        case 3:
          message.poolList.push(Pool.decode(reader, reader.uint32()));
          break;
        case 4:
          message.liquidityProviders.push(
            LiquidityProvider.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.addressWhitelist = [];
    message.poolList = [];
    message.liquidityProviders = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.addressWhitelist !== undefined &&
      object.addressWhitelist !== null
    ) {
      for (const e of object.addressWhitelist) {
        message.addressWhitelist.push(String(e));
      }
    }
    if (object.poolList !== undefined && object.poolList !== null) {
      for (const e of object.poolList) {
        message.poolList.push(Pool.fromJSON(e));
      }
    }
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.addressWhitelist) {
      obj.addressWhitelist = message.addressWhitelist.map((e) => e);
    } else {
      obj.addressWhitelist = [];
    }
    if (message.poolList) {
      obj.poolList = message.poolList.map((e) =>
        e ? Pool.toJSON(e) : undefined,
      );
    } else {
      obj.poolList = [];
    }
    if (message.liquidityProviders) {
      obj.liquidityProviders = message.liquidityProviders.map((e) =>
        e ? LiquidityProvider.toJSON(e) : undefined,
      );
    } else {
      obj.liquidityProviders = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.addressWhitelist = [];
    message.poolList = [];
    message.liquidityProviders = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.addressWhitelist !== undefined &&
      object.addressWhitelist !== null
    ) {
      for (const e of object.addressWhitelist) {
        message.addressWhitelist.push(e);
      }
    }
    if (object.poolList !== undefined && object.poolList !== null) {
      for (const e of object.poolList) {
        message.poolList.push(Pool.fromPartial(e));
      }
    }
    if (
      object.liquidityProviders !== undefined &&
      object.liquidityProviders !== null
    ) {
      for (const e of object.liquidityProviders) {
        message.liquidityProviders.push(LiquidityProvider.fromPartial(e));
      }
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
