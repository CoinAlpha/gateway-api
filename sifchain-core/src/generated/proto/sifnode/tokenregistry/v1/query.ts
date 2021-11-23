/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Registry } from "../../../sifnode/tokenregistry/v1/types";

export const protobufPackage = "sifnode.tokenregistry.v1";

export interface QueryEntriesResponse {
  registry?: Registry;
}

export interface QueryEntriesRequest {}

const baseQueryEntriesResponse: object = {};

export const QueryEntriesResponse = {
  encode(
    message: QueryEntriesResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.registry !== undefined) {
      Registry.encode(message.registry, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryEntriesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryEntriesResponse } as QueryEntriesResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.registry = Registry.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryEntriesResponse {
    const message = { ...baseQueryEntriesResponse } as QueryEntriesResponse;
    if (object.registry !== undefined && object.registry !== null) {
      message.registry = Registry.fromJSON(object.registry);
    } else {
      message.registry = undefined;
    }
    return message;
  },

  toJSON(message: QueryEntriesResponse): unknown {
    const obj: any = {};
    message.registry !== undefined &&
      (obj.registry = message.registry
        ? Registry.toJSON(message.registry)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryEntriesResponse>): QueryEntriesResponse {
    const message = { ...baseQueryEntriesResponse } as QueryEntriesResponse;
    if (object.registry !== undefined && object.registry !== null) {
      message.registry = Registry.fromPartial(object.registry);
    } else {
      message.registry = undefined;
    }
    return message;
  },
};

const baseQueryEntriesRequest: object = {};

export const QueryEntriesRequest = {
  encode(
    _: QueryEntriesRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEntriesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryEntriesRequest } as QueryEntriesRequest;
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

  fromJSON(_: any): QueryEntriesRequest {
    const message = { ...baseQueryEntriesRequest } as QueryEntriesRequest;
    return message;
  },

  toJSON(_: QueryEntriesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryEntriesRequest>): QueryEntriesRequest {
    const message = { ...baseQueryEntriesRequest } as QueryEntriesRequest;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  Entries(request: QueryEntriesRequest): Promise<QueryEntriesResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Entries = this.Entries.bind(this);
  }
  Entries(request: QueryEntriesRequest): Promise<QueryEntriesResponse> {
    const data = QueryEntriesRequest.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.tokenregistry.v1.Query",
      "Entries",
      data,
    );
    return promise.then((data) =>
      QueryEntriesResponse.decode(new _m0.Reader(data)),
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
