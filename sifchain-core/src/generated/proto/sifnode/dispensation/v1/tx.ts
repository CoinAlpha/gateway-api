/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  DistributionType,
  distributionTypeFromJSON,
  distributionTypeToJSON,
} from "../../../sifnode/dispensation/v1/types";

export const protobufPackage = "sifnode.dispensation.v1";

export interface MsgCreateDistribution {
  distributor: string;
  authorizedRunner: string;
  distributionType: DistributionType;
  output: string[];
}

export interface MsgCreateDistributionResponse {}

export interface MsgCreateClaimResponse {}

export interface MsgRunDistributionResponse {}

export interface MsgCreateUserClaim {
  userClaimAddress: string;
  userClaimType: DistributionType;
}

export interface MsgRunDistribution {
  authorizedRunner: string;
  distributionName: string;
  distributionType: DistributionType;
}

const baseMsgCreateDistribution: object = {
  distributor: "",
  authorizedRunner: "",
  distributionType: 0,
  output: "",
};

export const MsgCreateDistribution = {
  encode(
    message: MsgCreateDistribution,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributor !== "") {
      writer.uint32(10).string(message.distributor);
    }
    if (message.authorizedRunner !== "") {
      writer.uint32(18).string(message.authorizedRunner);
    }
    if (message.distributionType !== 0) {
      writer.uint32(24).int32(message.distributionType);
    }
    for (const v of message.output) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreateDistribution {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateDistribution } as MsgCreateDistribution;
    message.output = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributor = reader.string();
          break;
        case 2:
          message.authorizedRunner = reader.string();
          break;
        case 3:
          message.distributionType = reader.int32() as any;
          break;
        case 4:
          message.output.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateDistribution {
    const message = { ...baseMsgCreateDistribution } as MsgCreateDistribution;
    message.output = [];
    if (object.distributor !== undefined && object.distributor !== null) {
      message.distributor = String(object.distributor);
    } else {
      message.distributor = "";
    }
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = String(object.authorizedRunner);
    } else {
      message.authorizedRunner = "";
    }
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = distributionTypeFromJSON(
        object.distributionType,
      );
    } else {
      message.distributionType = 0;
    }
    if (object.output !== undefined && object.output !== null) {
      for (const e of object.output) {
        message.output.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: MsgCreateDistribution): unknown {
    const obj: any = {};
    message.distributor !== undefined &&
      (obj.distributor = message.distributor);
    message.authorizedRunner !== undefined &&
      (obj.authorizedRunner = message.authorizedRunner);
    message.distributionType !== undefined &&
      (obj.distributionType = distributionTypeToJSON(message.distributionType));
    if (message.output) {
      obj.output = message.output.map((e) => e);
    } else {
      obj.output = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreateDistribution>,
  ): MsgCreateDistribution {
    const message = { ...baseMsgCreateDistribution } as MsgCreateDistribution;
    message.output = [];
    if (object.distributor !== undefined && object.distributor !== null) {
      message.distributor = object.distributor;
    } else {
      message.distributor = "";
    }
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = object.authorizedRunner;
    } else {
      message.authorizedRunner = "";
    }
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = object.distributionType;
    } else {
      message.distributionType = 0;
    }
    if (object.output !== undefined && object.output !== null) {
      for (const e of object.output) {
        message.output.push(e);
      }
    }
    return message;
  },
};

const baseMsgCreateDistributionResponse: object = {};

export const MsgCreateDistributionResponse = {
  encode(
    _: MsgCreateDistributionResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreateDistributionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateDistributionResponse,
    } as MsgCreateDistributionResponse;
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

  fromJSON(_: any): MsgCreateDistributionResponse {
    const message = {
      ...baseMsgCreateDistributionResponse,
    } as MsgCreateDistributionResponse;
    return message;
  },

  toJSON(_: MsgCreateDistributionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgCreateDistributionResponse>,
  ): MsgCreateDistributionResponse {
    const message = {
      ...baseMsgCreateDistributionResponse,
    } as MsgCreateDistributionResponse;
    return message;
  },
};

const baseMsgCreateClaimResponse: object = {};

export const MsgCreateClaimResponse = {
  encode(
    _: MsgCreateClaimResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreateClaimResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateClaimResponse } as MsgCreateClaimResponse;
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

  fromJSON(_: any): MsgCreateClaimResponse {
    const message = { ...baseMsgCreateClaimResponse } as MsgCreateClaimResponse;
    return message;
  },

  toJSON(_: MsgCreateClaimResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgCreateClaimResponse>): MsgCreateClaimResponse {
    const message = { ...baseMsgCreateClaimResponse } as MsgCreateClaimResponse;
    return message;
  },
};

const baseMsgRunDistributionResponse: object = {};

export const MsgRunDistributionResponse = {
  encode(
    _: MsgRunDistributionResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRunDistributionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRunDistributionResponse,
    } as MsgRunDistributionResponse;
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

  fromJSON(_: any): MsgRunDistributionResponse {
    const message = {
      ...baseMsgRunDistributionResponse,
    } as MsgRunDistributionResponse;
    return message;
  },

  toJSON(_: MsgRunDistributionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgRunDistributionResponse>,
  ): MsgRunDistributionResponse {
    const message = {
      ...baseMsgRunDistributionResponse,
    } as MsgRunDistributionResponse;
    return message;
  },
};

const baseMsgCreateUserClaim: object = {
  userClaimAddress: "",
  userClaimType: 0,
};

export const MsgCreateUserClaim = {
  encode(
    message: MsgCreateUserClaim,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.userClaimAddress !== "") {
      writer.uint32(10).string(message.userClaimAddress);
    }
    if (message.userClaimType !== 0) {
      writer.uint32(16).int32(message.userClaimType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateUserClaim {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateUserClaim } as MsgCreateUserClaim;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userClaimAddress = reader.string();
          break;
        case 2:
          message.userClaimType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateUserClaim {
    const message = { ...baseMsgCreateUserClaim } as MsgCreateUserClaim;
    if (
      object.userClaimAddress !== undefined &&
      object.userClaimAddress !== null
    ) {
      message.userClaimAddress = String(object.userClaimAddress);
    } else {
      message.userClaimAddress = "";
    }
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = distributionTypeFromJSON(object.userClaimType);
    } else {
      message.userClaimType = 0;
    }
    return message;
  },

  toJSON(message: MsgCreateUserClaim): unknown {
    const obj: any = {};
    message.userClaimAddress !== undefined &&
      (obj.userClaimAddress = message.userClaimAddress);
    message.userClaimType !== undefined &&
      (obj.userClaimType = distributionTypeToJSON(message.userClaimType));
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateUserClaim>): MsgCreateUserClaim {
    const message = { ...baseMsgCreateUserClaim } as MsgCreateUserClaim;
    if (
      object.userClaimAddress !== undefined &&
      object.userClaimAddress !== null
    ) {
      message.userClaimAddress = object.userClaimAddress;
    } else {
      message.userClaimAddress = "";
    }
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = object.userClaimType;
    } else {
      message.userClaimType = 0;
    }
    return message;
  },
};

const baseMsgRunDistribution: object = {
  authorizedRunner: "",
  distributionName: "",
  distributionType: 0,
};

export const MsgRunDistribution = {
  encode(
    message: MsgRunDistribution,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.authorizedRunner !== "") {
      writer.uint32(10).string(message.authorizedRunner);
    }
    if (message.distributionName !== "") {
      writer.uint32(18).string(message.distributionName);
    }
    if (message.distributionType !== 0) {
      writer.uint32(24).int32(message.distributionType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRunDistribution {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRunDistribution } as MsgRunDistribution;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authorizedRunner = reader.string();
          break;
        case 2:
          message.distributionName = reader.string();
          break;
        case 3:
          message.distributionType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRunDistribution {
    const message = { ...baseMsgRunDistribution } as MsgRunDistribution;
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = String(object.authorizedRunner);
    } else {
      message.authorizedRunner = "";
    }
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = String(object.distributionName);
    } else {
      message.distributionName = "";
    }
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = distributionTypeFromJSON(
        object.distributionType,
      );
    } else {
      message.distributionType = 0;
    }
    return message;
  },

  toJSON(message: MsgRunDistribution): unknown {
    const obj: any = {};
    message.authorizedRunner !== undefined &&
      (obj.authorizedRunner = message.authorizedRunner);
    message.distributionName !== undefined &&
      (obj.distributionName = message.distributionName);
    message.distributionType !== undefined &&
      (obj.distributionType = distributionTypeToJSON(message.distributionType));
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRunDistribution>): MsgRunDistribution {
    const message = { ...baseMsgRunDistribution } as MsgRunDistribution;
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = object.authorizedRunner;
    } else {
      message.authorizedRunner = "";
    }
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = object.distributionName;
    } else {
      message.distributionName = "";
    }
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = object.distributionType;
    } else {
      message.distributionType = 0;
    }
    return message;
  },
};

export interface Msg {
  CreateDistribution(
    request: MsgCreateDistribution,
  ): Promise<MsgCreateDistributionResponse>;
  CreateUserClaim(request: MsgCreateUserClaim): Promise<MsgCreateClaimResponse>;
  RunDistribution(
    request: MsgRunDistribution,
  ): Promise<MsgRunDistributionResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.CreateDistribution = this.CreateDistribution.bind(this);
    this.CreateUserClaim = this.CreateUserClaim.bind(this);
    this.RunDistribution = this.RunDistribution.bind(this);
  }
  CreateDistribution(
    request: MsgCreateDistribution,
  ): Promise<MsgCreateDistributionResponse> {
    const data = MsgCreateDistribution.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Msg",
      "CreateDistribution",
      data,
    );
    return promise.then((data) =>
      MsgCreateDistributionResponse.decode(new _m0.Reader(data)),
    );
  }

  CreateUserClaim(
    request: MsgCreateUserClaim,
  ): Promise<MsgCreateClaimResponse> {
    const data = MsgCreateUserClaim.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Msg",
      "CreateUserClaim",
      data,
    );
    return promise.then((data) =>
      MsgCreateClaimResponse.decode(new _m0.Reader(data)),
    );
  }

  RunDistribution(
    request: MsgRunDistribution,
  ): Promise<MsgRunDistributionResponse> {
    const data = MsgRunDistribution.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.dispensation.v1.Msg",
      "RunDistribution",
      data,
    );
    return promise.then((data) =>
      MsgRunDistributionResponse.decode(new _m0.Reader(data)),
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
