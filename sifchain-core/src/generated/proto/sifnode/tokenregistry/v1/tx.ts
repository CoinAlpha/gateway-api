/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  RegistryEntry,
  Registry,
} from "../../../sifnode/tokenregistry/v1/types";

export const protobufPackage = "sifnode.tokenregistry.v1";

export interface MsgRegister {
  from: string;
  entry?: RegistryEntry;
}

export interface MsgRegisterResponse {}

export interface MsgSetRegistry {
  from: string;
  registry?: Registry;
}

export interface MsgSetRegistryResponse {}

export interface MsgDeregister {
  from: string;
  denom: string;
}

export interface MsgDeregisterResponse {}

const baseMsgRegister: object = { from: "" };

export const MsgRegister = {
  encode(
    message: MsgRegister,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.entry !== undefined) {
      RegistryEntry.encode(message.entry, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegister {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRegister } as MsgRegister;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.entry = RegistryEntry.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegister {
    const message = { ...baseMsgRegister } as MsgRegister;
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from);
    } else {
      message.from = "";
    }
    if (object.entry !== undefined && object.entry !== null) {
      message.entry = RegistryEntry.fromJSON(object.entry);
    } else {
      message.entry = undefined;
    }
    return message;
  },

  toJSON(message: MsgRegister): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.entry !== undefined &&
      (obj.entry = message.entry
        ? RegistryEntry.toJSON(message.entry)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRegister>): MsgRegister {
    const message = { ...baseMsgRegister } as MsgRegister;
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    } else {
      message.from = "";
    }
    if (object.entry !== undefined && object.entry !== null) {
      message.entry = RegistryEntry.fromPartial(object.entry);
    } else {
      message.entry = undefined;
    }
    return message;
  },
};

const baseMsgRegisterResponse: object = {};

export const MsgRegisterResponse = {
  encode(
    _: MsgRegisterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRegisterResponse } as MsgRegisterResponse;
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

  fromJSON(_: any): MsgRegisterResponse {
    const message = { ...baseMsgRegisterResponse } as MsgRegisterResponse;
    return message;
  },

  toJSON(_: MsgRegisterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgRegisterResponse>): MsgRegisterResponse {
    const message = { ...baseMsgRegisterResponse } as MsgRegisterResponse;
    return message;
  },
};

const baseMsgSetRegistry: object = { from: "" };

export const MsgSetRegistry = {
  encode(
    message: MsgSetRegistry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.registry !== undefined) {
      Registry.encode(message.registry, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetRegistry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSetRegistry } as MsgSetRegistry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.registry = Registry.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSetRegistry {
    const message = { ...baseMsgSetRegistry } as MsgSetRegistry;
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from);
    } else {
      message.from = "";
    }
    if (object.registry !== undefined && object.registry !== null) {
      message.registry = Registry.fromJSON(object.registry);
    } else {
      message.registry = undefined;
    }
    return message;
  },

  toJSON(message: MsgSetRegistry): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.registry !== undefined &&
      (obj.registry = message.registry
        ? Registry.toJSON(message.registry)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSetRegistry>): MsgSetRegistry {
    const message = { ...baseMsgSetRegistry } as MsgSetRegistry;
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    } else {
      message.from = "";
    }
    if (object.registry !== undefined && object.registry !== null) {
      message.registry = Registry.fromPartial(object.registry);
    } else {
      message.registry = undefined;
    }
    return message;
  },
};

const baseMsgSetRegistryResponse: object = {};

export const MsgSetRegistryResponse = {
  encode(
    _: MsgSetRegistryResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgSetRegistryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSetRegistryResponse } as MsgSetRegistryResponse;
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

  fromJSON(_: any): MsgSetRegistryResponse {
    const message = { ...baseMsgSetRegistryResponse } as MsgSetRegistryResponse;
    return message;
  },

  toJSON(_: MsgSetRegistryResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgSetRegistryResponse>): MsgSetRegistryResponse {
    const message = { ...baseMsgSetRegistryResponse } as MsgSetRegistryResponse;
    return message;
  },
};

const baseMsgDeregister: object = { from: "", denom: "" };

export const MsgDeregister = {
  encode(
    message: MsgDeregister,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.denom !== "") {
      writer.uint32(18).string(message.denom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeregister {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeregister } as MsgDeregister;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeregister {
    const message = { ...baseMsgDeregister } as MsgDeregister;
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from);
    } else {
      message.from = "";
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = String(object.denom);
    } else {
      message.denom = "";
    }
    return message;
  },

  toJSON(message: MsgDeregister): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.denom !== undefined && (obj.denom = message.denom);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeregister>): MsgDeregister {
    const message = { ...baseMsgDeregister } as MsgDeregister;
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    } else {
      message.from = "";
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    } else {
      message.denom = "";
    }
    return message;
  },
};

const baseMsgDeregisterResponse: object = {};

export const MsgDeregisterResponse = {
  encode(
    _: MsgDeregisterResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDeregisterResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeregisterResponse } as MsgDeregisterResponse;
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

  fromJSON(_: any): MsgDeregisterResponse {
    const message = { ...baseMsgDeregisterResponse } as MsgDeregisterResponse;
    return message;
  },

  toJSON(_: MsgDeregisterResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgDeregisterResponse>): MsgDeregisterResponse {
    const message = { ...baseMsgDeregisterResponse } as MsgDeregisterResponse;
    return message;
  },
};

export interface Msg {
  Register(request: MsgRegister): Promise<MsgRegisterResponse>;
  Deregister(request: MsgDeregister): Promise<MsgDeregisterResponse>;
  SetRegistry(request: MsgSetRegistry): Promise<MsgSetRegistryResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Register = this.Register.bind(this);
    this.Deregister = this.Deregister.bind(this);
    this.SetRegistry = this.SetRegistry.bind(this);
  }
  Register(request: MsgRegister): Promise<MsgRegisterResponse> {
    const data = MsgRegister.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.tokenregistry.v1.Msg",
      "Register",
      data,
    );
    return promise.then((data) =>
      MsgRegisterResponse.decode(new _m0.Reader(data)),
    );
  }

  Deregister(request: MsgDeregister): Promise<MsgDeregisterResponse> {
    const data = MsgDeregister.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.tokenregistry.v1.Msg",
      "Deregister",
      data,
    );
    return promise.then((data) =>
      MsgDeregisterResponse.decode(new _m0.Reader(data)),
    );
  }

  SetRegistry(request: MsgSetRegistry): Promise<MsgSetRegistryResponse> {
    const data = MsgSetRegistry.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.tokenregistry.v1.Msg",
      "SetRegistry",
      data,
    );
    return promise.then((data) =>
      MsgSetRegistryResponse.decode(new _m0.Reader(data)),
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
