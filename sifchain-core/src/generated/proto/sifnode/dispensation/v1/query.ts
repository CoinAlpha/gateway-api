/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  DistributionStatus,
  DistributionRecords,
  DistributionType,
  Distribution,
  UserClaim,
  distributionStatusFromJSON,
  distributionStatusToJSON,
  distributionTypeFromJSON,
  distributionTypeToJSON,
} from "../../../sifnode/dispensation/v1/types";

export const protobufPackage = "sifnode.dispensation.v1";

export interface QueryAllDistributionsRequest {}

export interface QueryAllDistributionsResponse {
  distributions: Distribution[];
  height: Long;
}

export interface QueryRecordsByDistributionNameRequest {
  distributionName: string;
  status: DistributionStatus;
}

export interface QueryRecordsByDistributionNameResponse {
  distributionRecords?: DistributionRecords;
  height: Long;
}

export interface QueryRecordsByRecipientAddrRequest {
  address: string;
}

export interface QueryRecordsByRecipientAddrResponse {
  distributionRecords?: DistributionRecords;
  height: Long;
}

export interface QueryClaimsByTypeRequest {
  userClaimType: DistributionType;
}

export interface QueryClaimsResponse {
  claims: UserClaim[];
  height: Long;
}

const baseQueryAllDistributionsRequest: object = {};

export const QueryAllDistributionsRequest = {
  encode(
    _: QueryAllDistributionsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryAllDistributionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllDistributionsRequest,
    } as QueryAllDistributionsRequest;
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

  fromJSON(_: any): QueryAllDistributionsRequest {
    const message = {
      ...baseQueryAllDistributionsRequest,
    } as QueryAllDistributionsRequest;
    return message;
  },

  toJSON(_: QueryAllDistributionsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryAllDistributionsRequest>,
  ): QueryAllDistributionsRequest {
    const message = {
      ...baseQueryAllDistributionsRequest,
    } as QueryAllDistributionsRequest;
    return message;
  },
};

const baseQueryAllDistributionsResponse: object = { height: Long.ZERO };

export const QueryAllDistributionsResponse = {
  encode(
    message: QueryAllDistributionsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.distributions) {
      Distribution.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryAllDistributionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllDistributionsResponse,
    } as QueryAllDistributionsResponse;
    message.distributions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributions.push(
            Distribution.decode(reader, reader.uint32()),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllDistributionsResponse {
    const message = {
      ...baseQueryAllDistributionsResponse,
    } as QueryAllDistributionsResponse;
    message.distributions = [];
    if (object.distributions !== undefined && object.distributions !== null) {
      for (const e of object.distributions) {
        message.distributions.push(Distribution.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryAllDistributionsResponse): unknown {
    const obj: any = {};
    if (message.distributions) {
      obj.distributions = message.distributions.map((e) =>
        e ? Distribution.toJSON(e) : undefined,
      );
    } else {
      obj.distributions = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllDistributionsResponse>,
  ): QueryAllDistributionsResponse {
    const message = {
      ...baseQueryAllDistributionsResponse,
    } as QueryAllDistributionsResponse;
    message.distributions = [];
    if (object.distributions !== undefined && object.distributions !== null) {
      for (const e of object.distributions) {
        message.distributions.push(Distribution.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRecordsByDistributionNameRequest: object = {
  distributionName: "",
  status: 0,
};

export const QueryRecordsByDistributionNameRequest = {
  encode(
    message: QueryRecordsByDistributionNameRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionName !== "") {
      writer.uint32(10).string(message.distributionName);
    }
    if (message.status !== 0) {
      writer.uint32(16).int32(message.status);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryRecordsByDistributionNameRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRecordsByDistributionNameRequest,
    } as QueryRecordsByDistributionNameRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionName = reader.string();
          break;
        case 2:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRecordsByDistributionNameRequest {
    const message = {
      ...baseQueryRecordsByDistributionNameRequest,
    } as QueryRecordsByDistributionNameRequest;
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = String(object.distributionName);
    } else {
      message.distributionName = "";
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = distributionStatusFromJSON(object.status);
    } else {
      message.status = 0;
    }
    return message;
  },

  toJSON(message: QueryRecordsByDistributionNameRequest): unknown {
    const obj: any = {};
    message.distributionName !== undefined &&
      (obj.distributionName = message.distributionName);
    message.status !== undefined &&
      (obj.status = distributionStatusToJSON(message.status));
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRecordsByDistributionNameRequest>,
  ): QueryRecordsByDistributionNameRequest {
    const message = {
      ...baseQueryRecordsByDistributionNameRequest,
    } as QueryRecordsByDistributionNameRequest;
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = object.distributionName;
    } else {
      message.distributionName = "";
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = 0;
    }
    return message;
  },
};

const baseQueryRecordsByDistributionNameResponse: object = {
  height: Long.ZERO,
};

export const QueryRecordsByDistributionNameResponse = {
  encode(
    message: QueryRecordsByDistributionNameResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionRecords !== undefined) {
      DistributionRecords.encode(
        message.distributionRecords,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryRecordsByDistributionNameResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRecordsByDistributionNameResponse,
    } as QueryRecordsByDistributionNameResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionRecords = DistributionRecords.decode(
            reader,
            reader.uint32(),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRecordsByDistributionNameResponse {
    const message = {
      ...baseQueryRecordsByDistributionNameResponse,
    } as QueryRecordsByDistributionNameResponse;
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      message.distributionRecords = DistributionRecords.fromJSON(
        object.distributionRecords,
      );
    } else {
      message.distributionRecords = undefined;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRecordsByDistributionNameResponse): unknown {
    const obj: any = {};
    message.distributionRecords !== undefined &&
      (obj.distributionRecords = message.distributionRecords
        ? DistributionRecords.toJSON(message.distributionRecords)
        : undefined);
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRecordsByDistributionNameResponse>,
  ): QueryRecordsByDistributionNameResponse {
    const message = {
      ...baseQueryRecordsByDistributionNameResponse,
    } as QueryRecordsByDistributionNameResponse;
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      message.distributionRecords = DistributionRecords.fromPartial(
        object.distributionRecords,
      );
    } else {
      message.distributionRecords = undefined;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

const baseQueryRecordsByRecipientAddrRequest: object = { address: "" };

export const QueryRecordsByRecipientAddrRequest = {
  encode(
    message: QueryRecordsByRecipientAddrRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryRecordsByRecipientAddrRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRecordsByRecipientAddrRequest,
    } as QueryRecordsByRecipientAddrRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRecordsByRecipientAddrRequest {
    const message = {
      ...baseQueryRecordsByRecipientAddrRequest,
    } as QueryRecordsByRecipientAddrRequest;
    if (object.address !== undefined && object.address !== null) {
      message.address = String(object.address);
    } else {
      message.address = "";
    }
    return message;
  },

  toJSON(message: QueryRecordsByRecipientAddrRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRecordsByRecipientAddrRequest>,
  ): QueryRecordsByRecipientAddrRequest {
    const message = {
      ...baseQueryRecordsByRecipientAddrRequest,
    } as QueryRecordsByRecipientAddrRequest;
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    } else {
      message.address = "";
    }
    return message;
  },
};

const baseQueryRecordsByRecipientAddrResponse: object = { height: Long.ZERO };

export const QueryRecordsByRecipientAddrResponse = {
  encode(
    message: QueryRecordsByRecipientAddrResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionRecords !== undefined) {
      DistributionRecords.encode(
        message.distributionRecords,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryRecordsByRecipientAddrResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRecordsByRecipientAddrResponse,
    } as QueryRecordsByRecipientAddrResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionRecords = DistributionRecords.decode(
            reader,
            reader.uint32(),
          );
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRecordsByRecipientAddrResponse {
    const message = {
      ...baseQueryRecordsByRecipientAddrResponse,
    } as QueryRecordsByRecipientAddrResponse;
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      message.distributionRecords = DistributionRecords.fromJSON(
        object.distributionRecords,
      );
    } else {
      message.distributionRecords = undefined;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryRecordsByRecipientAddrResponse): unknown {
    const obj: any = {};
    message.distributionRecords !== undefined &&
      (obj.distributionRecords = message.distributionRecords
        ? DistributionRecords.toJSON(message.distributionRecords)
        : undefined);
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRecordsByRecipientAddrResponse>,
  ): QueryRecordsByRecipientAddrResponse {
    const message = {
      ...baseQueryRecordsByRecipientAddrResponse,
    } as QueryRecordsByRecipientAddrResponse;
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      message.distributionRecords = DistributionRecords.fromPartial(
        object.distributionRecords,
      );
    } else {
      message.distributionRecords = undefined;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

const baseQueryClaimsByTypeRequest: object = { userClaimType: 0 };

export const QueryClaimsByTypeRequest = {
  encode(
    message: QueryClaimsByTypeRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.userClaimType !== 0) {
      writer.uint32(8).int32(message.userClaimType);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryClaimsByTypeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryClaimsByTypeRequest,
    } as QueryClaimsByTypeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userClaimType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryClaimsByTypeRequest {
    const message = {
      ...baseQueryClaimsByTypeRequest,
    } as QueryClaimsByTypeRequest;
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = distributionTypeFromJSON(object.userClaimType);
    } else {
      message.userClaimType = 0;
    }
    return message;
  },

  toJSON(message: QueryClaimsByTypeRequest): unknown {
    const obj: any = {};
    message.userClaimType !== undefined &&
      (obj.userClaimType = distributionTypeToJSON(message.userClaimType));
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryClaimsByTypeRequest>,
  ): QueryClaimsByTypeRequest {
    const message = {
      ...baseQueryClaimsByTypeRequest,
    } as QueryClaimsByTypeRequest;
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = object.userClaimType;
    } else {
      message.userClaimType = 0;
    }
    return message;
  },
};

const baseQueryClaimsResponse: object = { height: Long.ZERO };

export const QueryClaimsResponse = {
  encode(
    message: QueryClaimsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.claims) {
      UserClaim.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(16).int64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryClaimsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryClaimsResponse } as QueryClaimsResponse;
    message.claims = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.claims.push(UserClaim.decode(reader, reader.uint32()));
          break;
        case 2:
          message.height = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryClaimsResponse {
    const message = { ...baseQueryClaimsResponse } as QueryClaimsResponse;
    message.claims = [];
    if (object.claims !== undefined && object.claims !== null) {
      for (const e of object.claims) {
        message.claims.push(UserClaim.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },

  toJSON(message: QueryClaimsResponse): unknown {
    const obj: any = {};
    if (message.claims) {
      obj.claims = message.claims.map((e) =>
        e ? UserClaim.toJSON(e) : undefined,
      );
    } else {
      obj.claims = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryClaimsResponse>): QueryClaimsResponse {
    const message = { ...baseQueryClaimsResponse } as QueryClaimsResponse;
    message.claims = [];
    if (object.claims !== undefined && object.claims !== null) {
      for (const e of object.claims) {
        message.claims.push(UserClaim.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height as Long;
    } else {
      message.height = Long.ZERO;
    }
    return message;
  },
};

export interface Query {
  AllDistributions(
    request: QueryAllDistributionsRequest,
  ): Promise<QueryAllDistributionsResponse>;
  RecordsByDistributionName(
    request: QueryRecordsByDistributionNameRequest,
  ): Promise<QueryRecordsByDistributionNameResponse>;
  RecordsByRecipient(
    request: QueryRecordsByRecipientAddrRequest,
  ): Promise<QueryRecordsByRecipientAddrResponse>;
  ClaimsByType(request: QueryClaimsByTypeRequest): Promise<QueryClaimsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.AllDistributions = this.AllDistributions.bind(this);
    this.RecordsByDistributionName = this.RecordsByDistributionName.bind(this);
    this.RecordsByRecipient = this.RecordsByRecipient.bind(this);
    this.ClaimsByType = this.ClaimsByType.bind(this);
  }
  AllDistributions(
    request: QueryAllDistributionsRequest,
  ): Promise<QueryAllDistributionsResponse> {
    const data = QueryAllDistributionsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Query",
      "AllDistributions",
      data,
    );
    return promise.then((data) =>
      QueryAllDistributionsResponse.decode(new _m0.Reader(data)),
    );
  }

  RecordsByDistributionName(
    request: QueryRecordsByDistributionNameRequest,
  ): Promise<QueryRecordsByDistributionNameResponse> {
    const data = QueryRecordsByDistributionNameRequest.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Query",
      "RecordsByDistributionName",
      data,
    );
    return promise.then((data) =>
      QueryRecordsByDistributionNameResponse.decode(new _m0.Reader(data)),
    );
  }

  RecordsByRecipient(
    request: QueryRecordsByRecipientAddrRequest,
  ): Promise<QueryRecordsByRecipientAddrResponse> {
    const data = QueryRecordsByRecipientAddrRequest.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Query",
      "RecordsByRecipient",
      data,
    );
    return promise.then((data) =>
      QueryRecordsByRecipientAddrResponse.decode(new _m0.Reader(data)),
    );
  }

  ClaimsByType(
    request: QueryClaimsByTypeRequest,
  ): Promise<QueryClaimsResponse> {
    const data = QueryClaimsByTypeRequest.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Query",
      "ClaimsByType",
      data,
    );
    return promise.then((data) =>
      QueryClaimsResponse.decode(new _m0.Reader(data)),
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
