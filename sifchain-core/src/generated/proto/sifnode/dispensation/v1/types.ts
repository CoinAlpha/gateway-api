/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/coin";

export const protobufPackage = "sifnode.dispensation.v1";

/** Distribution type enum */
export enum DistributionType {
  /** DISTRIBUTION_TYPE_UNSPECIFIED - Unspecified distribution type */
  DISTRIBUTION_TYPE_UNSPECIFIED = 0,
  /** DISTRIBUTION_TYPE_AIRDROP - Airdrop distribution type */
  DISTRIBUTION_TYPE_AIRDROP = 1,
  /** DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY - Validator Subsidy distribution type */
  DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY = 2,
  /** DISTRIBUTION_TYPE_LIQUIDITY_MINING - Liquidity mining distribution type */
  DISTRIBUTION_TYPE_LIQUIDITY_MINING = 3,
  UNRECOGNIZED = -1,
}

export function distributionTypeFromJSON(object: any): DistributionType {
  switch (object) {
    case 0:
    case "DISTRIBUTION_TYPE_UNSPECIFIED":
      return DistributionType.DISTRIBUTION_TYPE_UNSPECIFIED;
    case 1:
    case "DISTRIBUTION_TYPE_AIRDROP":
      return DistributionType.DISTRIBUTION_TYPE_AIRDROP;
    case 2:
    case "DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY":
      return DistributionType.DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY;
    case 3:
    case "DISTRIBUTION_TYPE_LIQUIDITY_MINING":
      return DistributionType.DISTRIBUTION_TYPE_LIQUIDITY_MINING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DistributionType.UNRECOGNIZED;
  }
}

export function distributionTypeToJSON(object: DistributionType): string {
  switch (object) {
    case DistributionType.DISTRIBUTION_TYPE_UNSPECIFIED:
      return "DISTRIBUTION_TYPE_UNSPECIFIED";
    case DistributionType.DISTRIBUTION_TYPE_AIRDROP:
      return "DISTRIBUTION_TYPE_AIRDROP";
    case DistributionType.DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY:
      return "DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY";
    case DistributionType.DISTRIBUTION_TYPE_LIQUIDITY_MINING:
      return "DISTRIBUTION_TYPE_LIQUIDITY_MINING";
    default:
      return "UNKNOWN";
  }
}

/** Claim status enum */
export enum DistributionStatus {
  /** DISTRIBUTION_STATUS_UNSPECIFIED - Unspecified */
  DISTRIBUTION_STATUS_UNSPECIFIED = 0,
  /** DISTRIBUTION_STATUS_PENDING - Pending status */
  DISTRIBUTION_STATUS_PENDING = 1,
  /** DISTRIBUTION_STATUS_COMPLETED - Completed status */
  DISTRIBUTION_STATUS_COMPLETED = 2,
  /** DISTRIBUTION_STATUS_FAILED - Failed status */
  DISTRIBUTION_STATUS_FAILED = 3,
  UNRECOGNIZED = -1,
}

export function distributionStatusFromJSON(object: any): DistributionStatus {
  switch (object) {
    case 0:
    case "DISTRIBUTION_STATUS_UNSPECIFIED":
      return DistributionStatus.DISTRIBUTION_STATUS_UNSPECIFIED;
    case 1:
    case "DISTRIBUTION_STATUS_PENDING":
      return DistributionStatus.DISTRIBUTION_STATUS_PENDING;
    case 2:
    case "DISTRIBUTION_STATUS_COMPLETED":
      return DistributionStatus.DISTRIBUTION_STATUS_COMPLETED;
    case 3:
    case "DISTRIBUTION_STATUS_FAILED":
      return DistributionStatus.DISTRIBUTION_STATUS_FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DistributionStatus.UNRECOGNIZED;
  }
}

export function distributionStatusToJSON(object: DistributionStatus): string {
  switch (object) {
    case DistributionStatus.DISTRIBUTION_STATUS_UNSPECIFIED:
      return "DISTRIBUTION_STATUS_UNSPECIFIED";
    case DistributionStatus.DISTRIBUTION_STATUS_PENDING:
      return "DISTRIBUTION_STATUS_PENDING";
    case DistributionStatus.DISTRIBUTION_STATUS_COMPLETED:
      return "DISTRIBUTION_STATUS_COMPLETED";
    case DistributionStatus.DISTRIBUTION_STATUS_FAILED:
      return "DISTRIBUTION_STATUS_FAILED";
    default:
      return "UNKNOWN";
  }
}

export interface GenesisState {
  distributionRecords?: DistributionRecords;
  distributions?: Distributions;
  claims?: UserClaims;
}

export interface DistributionRecord {
  distributionStatus: DistributionStatus;
  distributionType: DistributionType;
  distributionName: string;
  recipientAddress: string;
  coins: Coin[];
  distributionStartHeight: Long;
  distributionCompletedHeight: Long;
  authorizedRunner: string;
}

export interface DistributionRecords {
  distributionRecords: DistributionRecord[];
}

export interface Distributions {
  distributions: Distribution[];
}

export interface Distribution {
  distributionType: DistributionType;
  distributionName: string;
  runner: string;
}

export interface UserClaim {
  userAddress: string;
  userClaimType: DistributionType;
  userClaimTime: string;
}

export interface UserClaims {
  userClaims: UserClaim[];
}

const baseGenesisState: object = {};

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionRecords !== undefined) {
      DistributionRecords.encode(
        message.distributionRecords,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    if (message.distributions !== undefined) {
      Distributions.encode(
        message.distributions,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.claims !== undefined) {
      UserClaims.encode(message.claims, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
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
          message.distributions = Distributions.decode(reader, reader.uint32());
          break;
        case 3:
          message.claims = UserClaims.decode(reader, reader.uint32());
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
    if (object.distributions !== undefined && object.distributions !== null) {
      message.distributions = Distributions.fromJSON(object.distributions);
    } else {
      message.distributions = undefined;
    }
    if (object.claims !== undefined && object.claims !== null) {
      message.claims = UserClaims.fromJSON(object.claims);
    } else {
      message.claims = undefined;
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.distributionRecords !== undefined &&
      (obj.distributionRecords = message.distributionRecords
        ? DistributionRecords.toJSON(message.distributionRecords)
        : undefined);
    message.distributions !== undefined &&
      (obj.distributions = message.distributions
        ? Distributions.toJSON(message.distributions)
        : undefined);
    message.claims !== undefined &&
      (obj.claims = message.claims
        ? UserClaims.toJSON(message.claims)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
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
    if (object.distributions !== undefined && object.distributions !== null) {
      message.distributions = Distributions.fromPartial(object.distributions);
    } else {
      message.distributions = undefined;
    }
    if (object.claims !== undefined && object.claims !== null) {
      message.claims = UserClaims.fromPartial(object.claims);
    } else {
      message.claims = undefined;
    }
    return message;
  },
};

const baseDistributionRecord: object = {
  distributionStatus: 0,
  distributionType: 0,
  distributionName: "",
  recipientAddress: "",
  distributionStartHeight: Long.ZERO,
  distributionCompletedHeight: Long.ZERO,
  authorizedRunner: "",
};

export const DistributionRecord = {
  encode(
    message: DistributionRecord,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionStatus !== 0) {
      writer.uint32(8).int32(message.distributionStatus);
    }
    if (message.distributionType !== 0) {
      writer.uint32(16).int32(message.distributionType);
    }
    if (message.distributionName !== "") {
      writer.uint32(26).string(message.distributionName);
    }
    if (message.recipientAddress !== "") {
      writer.uint32(34).string(message.recipientAddress);
    }
    for (const v of message.coins) {
      Coin.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (!message.distributionStartHeight.isZero()) {
      writer.uint32(48).int64(message.distributionStartHeight);
    }
    if (!message.distributionCompletedHeight.isZero()) {
      writer.uint32(56).int64(message.distributionCompletedHeight);
    }
    if (message.authorizedRunner !== "") {
      writer.uint32(66).string(message.authorizedRunner);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DistributionRecord {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDistributionRecord } as DistributionRecord;
    message.coins = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionStatus = reader.int32() as any;
          break;
        case 2:
          message.distributionType = reader.int32() as any;
          break;
        case 3:
          message.distributionName = reader.string();
          break;
        case 4:
          message.recipientAddress = reader.string();
          break;
        case 5:
          message.coins.push(Coin.decode(reader, reader.uint32()));
          break;
        case 6:
          message.distributionStartHeight = reader.int64() as Long;
          break;
        case 7:
          message.distributionCompletedHeight = reader.int64() as Long;
          break;
        case 8:
          message.authorizedRunner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DistributionRecord {
    const message = { ...baseDistributionRecord } as DistributionRecord;
    message.coins = [];
    if (
      object.distributionStatus !== undefined &&
      object.distributionStatus !== null
    ) {
      message.distributionStatus = distributionStatusFromJSON(
        object.distributionStatus,
      );
    } else {
      message.distributionStatus = 0;
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
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = String(object.distributionName);
    } else {
      message.distributionName = "";
    }
    if (
      object.recipientAddress !== undefined &&
      object.recipientAddress !== null
    ) {
      message.recipientAddress = String(object.recipientAddress);
    } else {
      message.recipientAddress = "";
    }
    if (object.coins !== undefined && object.coins !== null) {
      for (const e of object.coins) {
        message.coins.push(Coin.fromJSON(e));
      }
    }
    if (
      object.distributionStartHeight !== undefined &&
      object.distributionStartHeight !== null
    ) {
      message.distributionStartHeight = Long.fromString(
        object.distributionStartHeight,
      );
    } else {
      message.distributionStartHeight = Long.ZERO;
    }
    if (
      object.distributionCompletedHeight !== undefined &&
      object.distributionCompletedHeight !== null
    ) {
      message.distributionCompletedHeight = Long.fromString(
        object.distributionCompletedHeight,
      );
    } else {
      message.distributionCompletedHeight = Long.ZERO;
    }
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = String(object.authorizedRunner);
    } else {
      message.authorizedRunner = "";
    }
    return message;
  },

  toJSON(message: DistributionRecord): unknown {
    const obj: any = {};
    message.distributionStatus !== undefined &&
      (obj.distributionStatus = distributionStatusToJSON(
        message.distributionStatus,
      ));
    message.distributionType !== undefined &&
      (obj.distributionType = distributionTypeToJSON(message.distributionType));
    message.distributionName !== undefined &&
      (obj.distributionName = message.distributionName);
    message.recipientAddress !== undefined &&
      (obj.recipientAddress = message.recipientAddress);
    if (message.coins) {
      obj.coins = message.coins.map((e) => (e ? Coin.toJSON(e) : undefined));
    } else {
      obj.coins = [];
    }
    message.distributionStartHeight !== undefined &&
      (obj.distributionStartHeight = (
        message.distributionStartHeight || Long.ZERO
      ).toString());
    message.distributionCompletedHeight !== undefined &&
      (obj.distributionCompletedHeight = (
        message.distributionCompletedHeight || Long.ZERO
      ).toString());
    message.authorizedRunner !== undefined &&
      (obj.authorizedRunner = message.authorizedRunner);
    return obj;
  },

  fromPartial(object: DeepPartial<DistributionRecord>): DistributionRecord {
    const message = { ...baseDistributionRecord } as DistributionRecord;
    message.coins = [];
    if (
      object.distributionStatus !== undefined &&
      object.distributionStatus !== null
    ) {
      message.distributionStatus = object.distributionStatus;
    } else {
      message.distributionStatus = 0;
    }
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = object.distributionType;
    } else {
      message.distributionType = 0;
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
      object.recipientAddress !== undefined &&
      object.recipientAddress !== null
    ) {
      message.recipientAddress = object.recipientAddress;
    } else {
      message.recipientAddress = "";
    }
    if (object.coins !== undefined && object.coins !== null) {
      for (const e of object.coins) {
        message.coins.push(Coin.fromPartial(e));
      }
    }
    if (
      object.distributionStartHeight !== undefined &&
      object.distributionStartHeight !== null
    ) {
      message.distributionStartHeight = object.distributionStartHeight as Long;
    } else {
      message.distributionStartHeight = Long.ZERO;
    }
    if (
      object.distributionCompletedHeight !== undefined &&
      object.distributionCompletedHeight !== null
    ) {
      message.distributionCompletedHeight = object.distributionCompletedHeight as Long;
    } else {
      message.distributionCompletedHeight = Long.ZERO;
    }
    if (
      object.authorizedRunner !== undefined &&
      object.authorizedRunner !== null
    ) {
      message.authorizedRunner = object.authorizedRunner;
    } else {
      message.authorizedRunner = "";
    }
    return message;
  },
};

const baseDistributionRecords: object = {};

export const DistributionRecords = {
  encode(
    message: DistributionRecords,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.distributionRecords) {
      DistributionRecord.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DistributionRecords {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDistributionRecords } as DistributionRecords;
    message.distributionRecords = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionRecords.push(
            DistributionRecord.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DistributionRecords {
    const message = { ...baseDistributionRecords } as DistributionRecords;
    message.distributionRecords = [];
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      for (const e of object.distributionRecords) {
        message.distributionRecords.push(DistributionRecord.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: DistributionRecords): unknown {
    const obj: any = {};
    if (message.distributionRecords) {
      obj.distributionRecords = message.distributionRecords.map((e) =>
        e ? DistributionRecord.toJSON(e) : undefined,
      );
    } else {
      obj.distributionRecords = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DistributionRecords>): DistributionRecords {
    const message = { ...baseDistributionRecords } as DistributionRecords;
    message.distributionRecords = [];
    if (
      object.distributionRecords !== undefined &&
      object.distributionRecords !== null
    ) {
      for (const e of object.distributionRecords) {
        message.distributionRecords.push(DistributionRecord.fromPartial(e));
      }
    }
    return message;
  },
};

const baseDistributions: object = {};

export const Distributions = {
  encode(
    message: Distributions,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.distributions) {
      Distribution.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Distributions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDistributions } as Distributions;
    message.distributions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributions.push(
            Distribution.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Distributions {
    const message = { ...baseDistributions } as Distributions;
    message.distributions = [];
    if (object.distributions !== undefined && object.distributions !== null) {
      for (const e of object.distributions) {
        message.distributions.push(Distribution.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Distributions): unknown {
    const obj: any = {};
    if (message.distributions) {
      obj.distributions = message.distributions.map((e) =>
        e ? Distribution.toJSON(e) : undefined,
      );
    } else {
      obj.distributions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Distributions>): Distributions {
    const message = { ...baseDistributions } as Distributions;
    message.distributions = [];
    if (object.distributions !== undefined && object.distributions !== null) {
      for (const e of object.distributions) {
        message.distributions.push(Distribution.fromPartial(e));
      }
    }
    return message;
  },
};

const baseDistribution: object = {
  distributionType: 0,
  distributionName: "",
  runner: "",
};

export const Distribution = {
  encode(
    message: Distribution,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.distributionType !== 0) {
      writer.uint32(8).int32(message.distributionType);
    }
    if (message.distributionName !== "") {
      writer.uint32(18).string(message.distributionName);
    }
    if (message.runner !== "") {
      writer.uint32(26).string(message.runner);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Distribution {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDistribution } as Distribution;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.distributionType = reader.int32() as any;
          break;
        case 2:
          message.distributionName = reader.string();
          break;
        case 3:
          message.runner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Distribution {
    const message = { ...baseDistribution } as Distribution;
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
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = String(object.distributionName);
    } else {
      message.distributionName = "";
    }
    if (object.runner !== undefined && object.runner !== null) {
      message.runner = String(object.runner);
    } else {
      message.runner = "";
    }
    return message;
  },

  toJSON(message: Distribution): unknown {
    const obj: any = {};
    message.distributionType !== undefined &&
      (obj.distributionType = distributionTypeToJSON(message.distributionType));
    message.distributionName !== undefined &&
      (obj.distributionName = message.distributionName);
    message.runner !== undefined && (obj.runner = message.runner);
    return obj;
  },

  fromPartial(object: DeepPartial<Distribution>): Distribution {
    const message = { ...baseDistribution } as Distribution;
    if (
      object.distributionType !== undefined &&
      object.distributionType !== null
    ) {
      message.distributionType = object.distributionType;
    } else {
      message.distributionType = 0;
    }
    if (
      object.distributionName !== undefined &&
      object.distributionName !== null
    ) {
      message.distributionName = object.distributionName;
    } else {
      message.distributionName = "";
    }
    if (object.runner !== undefined && object.runner !== null) {
      message.runner = object.runner;
    } else {
      message.runner = "";
    }
    return message;
  },
};

const baseUserClaim: object = {
  userAddress: "",
  userClaimType: 0,
  userClaimTime: "",
};

export const UserClaim = {
  encode(
    message: UserClaim,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.userAddress !== "") {
      writer.uint32(10).string(message.userAddress);
    }
    if (message.userClaimType !== 0) {
      writer.uint32(16).int32(message.userClaimType);
    }
    if (message.userClaimTime !== "") {
      writer.uint32(26).string(message.userClaimTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserClaim {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserClaim } as UserClaim;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userAddress = reader.string();
          break;
        case 2:
          message.userClaimType = reader.int32() as any;
          break;
        case 3:
          message.userClaimTime = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserClaim {
    const message = { ...baseUserClaim } as UserClaim;
    if (object.userAddress !== undefined && object.userAddress !== null) {
      message.userAddress = String(object.userAddress);
    } else {
      message.userAddress = "";
    }
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = distributionTypeFromJSON(object.userClaimType);
    } else {
      message.userClaimType = 0;
    }
    if (object.userClaimTime !== undefined && object.userClaimTime !== null) {
      message.userClaimTime = String(object.userClaimTime);
    } else {
      message.userClaimTime = "";
    }
    return message;
  },

  toJSON(message: UserClaim): unknown {
    const obj: any = {};
    message.userAddress !== undefined &&
      (obj.userAddress = message.userAddress);
    message.userClaimType !== undefined &&
      (obj.userClaimType = distributionTypeToJSON(message.userClaimType));
    message.userClaimTime !== undefined &&
      (obj.userClaimTime = message.userClaimTime);
    return obj;
  },

  fromPartial(object: DeepPartial<UserClaim>): UserClaim {
    const message = { ...baseUserClaim } as UserClaim;
    if (object.userAddress !== undefined && object.userAddress !== null) {
      message.userAddress = object.userAddress;
    } else {
      message.userAddress = "";
    }
    if (object.userClaimType !== undefined && object.userClaimType !== null) {
      message.userClaimType = object.userClaimType;
    } else {
      message.userClaimType = 0;
    }
    if (object.userClaimTime !== undefined && object.userClaimTime !== null) {
      message.userClaimTime = object.userClaimTime;
    } else {
      message.userClaimTime = "";
    }
    return message;
  },
};

const baseUserClaims: object = {};

export const UserClaims = {
  encode(
    message: UserClaims,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.userClaims) {
      UserClaim.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserClaims {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserClaims } as UserClaims;
    message.userClaims = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userClaims.push(UserClaim.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserClaims {
    const message = { ...baseUserClaims } as UserClaims;
    message.userClaims = [];
    if (object.userClaims !== undefined && object.userClaims !== null) {
      for (const e of object.userClaims) {
        message.userClaims.push(UserClaim.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: UserClaims): unknown {
    const obj: any = {};
    if (message.userClaims) {
      obj.userClaims = message.userClaims.map((e) =>
        e ? UserClaim.toJSON(e) : undefined,
      );
    } else {
      obj.userClaims = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<UserClaims>): UserClaims {
    const message = { ...baseUserClaims } as UserClaims;
    message.userClaims = [];
    if (object.userClaims !== undefined && object.userClaims !== null) {
      for (const e of object.userClaims) {
        message.userClaims.push(UserClaim.fromPartial(e));
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
