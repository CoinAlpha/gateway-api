/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { EthBridgeClaim } from "../../../sifnode/ethbridge/v1/types";

export const protobufPackage = "sifnode.ethbridge.v1";

/** MsgLock defines a message for locking coins and triggering a related event */
export interface MsgLock {
  cosmosSender: string;
  amount: string;
  symbol: string;
  ethereumChainId: Long;
  ethereumReceiver: string;
  cethAmount: string;
}

export interface MsgLockResponse {}

/** MsgBurn defines a message for burning coins and triggering a related event */
export interface MsgBurn {
  cosmosSender: string;
  amount: string;
  symbol: string;
  ethereumChainId: Long;
  ethereumReceiver: string;
  cethAmount: string;
}

export interface MsgBurnResponse {}

export interface MsgCreateEthBridgeClaim {
  ethBridgeClaim?: EthBridgeClaim;
}

export interface MsgCreateEthBridgeClaimResponse {}

/** MsgUpdateWhiteListValidator add or remove validator from whitelist */
export interface MsgUpdateWhiteListValidator {
  cosmosSender: string;
  validator: string;
  operationType: string;
}

export interface MsgUpdateWhiteListValidatorResponse {}

export interface MsgUpdateCethReceiverAccount {
  cosmosSender: string;
  cethReceiverAccount: string;
}

export interface MsgUpdateCethReceiverAccountResponse {}

export interface MsgRescueCeth {
  cosmosSender: string;
  cosmosReceiver: string;
  cethAmount: string;
}

export interface MsgRescueCethResponse {}

const baseMsgLock: object = {
  cosmosSender: "",
  amount: "",
  symbol: "",
  ethereumChainId: Long.ZERO,
  ethereumReceiver: "",
  cethAmount: "",
};

export const MsgLock = {
  encode(
    message: MsgLock,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cosmosSender !== "") {
      writer.uint32(10).string(message.cosmosSender);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.symbol !== "") {
      writer.uint32(26).string(message.symbol);
    }
    if (!message.ethereumChainId.isZero()) {
      writer.uint32(32).int64(message.ethereumChainId);
    }
    if (message.ethereumReceiver !== "") {
      writer.uint32(42).string(message.ethereumReceiver);
    }
    if (message.cethAmount !== "") {
      writer.uint32(50).string(message.cethAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgLock {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgLock } as MsgLock;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosSender = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.symbol = reader.string();
          break;
        case 4:
          message.ethereumChainId = reader.int64() as Long;
          break;
        case 5:
          message.ethereumReceiver = reader.string();
          break;
        case 6:
          message.cethAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgLock {
    const message = { ...baseMsgLock } as MsgLock;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = String(object.cosmosSender);
    } else {
      message.cosmosSender = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = String(object.amount);
    } else {
      message.amount = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (
      object.ethereumChainId !== undefined &&
      object.ethereumChainId !== null
    ) {
      message.ethereumChainId = Long.fromString(object.ethereumChainId);
    } else {
      message.ethereumChainId = Long.ZERO;
    }
    if (
      object.ethereumReceiver !== undefined &&
      object.ethereumReceiver !== null
    ) {
      message.ethereumReceiver = String(object.ethereumReceiver);
    } else {
      message.ethereumReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = String(object.cethAmount);
    } else {
      message.cethAmount = "";
    }
    return message;
  },

  toJSON(message: MsgLock): unknown {
    const obj: any = {};
    message.cosmosSender !== undefined &&
      (obj.cosmosSender = message.cosmosSender);
    message.amount !== undefined && (obj.amount = message.amount);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.ethereumChainId !== undefined &&
      (obj.ethereumChainId = (message.ethereumChainId || Long.ZERO).toString());
    message.ethereumReceiver !== undefined &&
      (obj.ethereumReceiver = message.ethereumReceiver);
    message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgLock>): MsgLock {
    const message = { ...baseMsgLock } as MsgLock;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = object.cosmosSender;
    } else {
      message.cosmosSender = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (
      object.ethereumChainId !== undefined &&
      object.ethereumChainId !== null
    ) {
      message.ethereumChainId = object.ethereumChainId as Long;
    } else {
      message.ethereumChainId = Long.ZERO;
    }
    if (
      object.ethereumReceiver !== undefined &&
      object.ethereumReceiver !== null
    ) {
      message.ethereumReceiver = object.ethereumReceiver;
    } else {
      message.ethereumReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = object.cethAmount;
    } else {
      message.cethAmount = "";
    }
    return message;
  },
};

const baseMsgLockResponse: object = {};

export const MsgLockResponse = {
  encode(
    _: MsgLockResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgLockResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgLockResponse } as MsgLockResponse;
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

  fromJSON(_: any): MsgLockResponse {
    const message = { ...baseMsgLockResponse } as MsgLockResponse;
    return message;
  },

  toJSON(_: MsgLockResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgLockResponse>): MsgLockResponse {
    const message = { ...baseMsgLockResponse } as MsgLockResponse;
    return message;
  },
};

const baseMsgBurn: object = {
  cosmosSender: "",
  amount: "",
  symbol: "",
  ethereumChainId: Long.ZERO,
  ethereumReceiver: "",
  cethAmount: "",
};

export const MsgBurn = {
  encode(
    message: MsgBurn,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cosmosSender !== "") {
      writer.uint32(10).string(message.cosmosSender);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.symbol !== "") {
      writer.uint32(26).string(message.symbol);
    }
    if (!message.ethereumChainId.isZero()) {
      writer.uint32(32).int64(message.ethereumChainId);
    }
    if (message.ethereumReceiver !== "") {
      writer.uint32(42).string(message.ethereumReceiver);
    }
    if (message.cethAmount !== "") {
      writer.uint32(50).string(message.cethAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBurn } as MsgBurn;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosSender = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.symbol = reader.string();
          break;
        case 4:
          message.ethereumChainId = reader.int64() as Long;
          break;
        case 5:
          message.ethereumReceiver = reader.string();
          break;
        case 6:
          message.cethAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgBurn {
    const message = { ...baseMsgBurn } as MsgBurn;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = String(object.cosmosSender);
    } else {
      message.cosmosSender = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = String(object.amount);
    } else {
      message.amount = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (
      object.ethereumChainId !== undefined &&
      object.ethereumChainId !== null
    ) {
      message.ethereumChainId = Long.fromString(object.ethereumChainId);
    } else {
      message.ethereumChainId = Long.ZERO;
    }
    if (
      object.ethereumReceiver !== undefined &&
      object.ethereumReceiver !== null
    ) {
      message.ethereumReceiver = String(object.ethereumReceiver);
    } else {
      message.ethereumReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = String(object.cethAmount);
    } else {
      message.cethAmount = "";
    }
    return message;
  },

  toJSON(message: MsgBurn): unknown {
    const obj: any = {};
    message.cosmosSender !== undefined &&
      (obj.cosmosSender = message.cosmosSender);
    message.amount !== undefined && (obj.amount = message.amount);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.ethereumChainId !== undefined &&
      (obj.ethereumChainId = (message.ethereumChainId || Long.ZERO).toString());
    message.ethereumReceiver !== undefined &&
      (obj.ethereumReceiver = message.ethereumReceiver);
    message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgBurn>): MsgBurn {
    const message = { ...baseMsgBurn } as MsgBurn;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = object.cosmosSender;
    } else {
      message.cosmosSender = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (
      object.ethereumChainId !== undefined &&
      object.ethereumChainId !== null
    ) {
      message.ethereumChainId = object.ethereumChainId as Long;
    } else {
      message.ethereumChainId = Long.ZERO;
    }
    if (
      object.ethereumReceiver !== undefined &&
      object.ethereumReceiver !== null
    ) {
      message.ethereumReceiver = object.ethereumReceiver;
    } else {
      message.ethereumReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = object.cethAmount;
    } else {
      message.cethAmount = "";
    }
    return message;
  },
};

const baseMsgBurnResponse: object = {};

export const MsgBurnResponse = {
  encode(
    _: MsgBurnResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurnResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBurnResponse } as MsgBurnResponse;
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

  fromJSON(_: any): MsgBurnResponse {
    const message = { ...baseMsgBurnResponse } as MsgBurnResponse;
    return message;
  },

  toJSON(_: MsgBurnResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgBurnResponse>): MsgBurnResponse {
    const message = { ...baseMsgBurnResponse } as MsgBurnResponse;
    return message;
  },
};

const baseMsgCreateEthBridgeClaim: object = {};

export const MsgCreateEthBridgeClaim = {
  encode(
    message: MsgCreateEthBridgeClaim,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.ethBridgeClaim !== undefined) {
      EthBridgeClaim.encode(
        message.ethBridgeClaim,
        writer.uint32(10).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreateEthBridgeClaim {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateEthBridgeClaim,
    } as MsgCreateEthBridgeClaim;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ethBridgeClaim = EthBridgeClaim.decode(
            reader,
            reader.uint32(),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateEthBridgeClaim {
    const message = {
      ...baseMsgCreateEthBridgeClaim,
    } as MsgCreateEthBridgeClaim;
    if (object.ethBridgeClaim !== undefined && object.ethBridgeClaim !== null) {
      message.ethBridgeClaim = EthBridgeClaim.fromJSON(object.ethBridgeClaim);
    } else {
      message.ethBridgeClaim = undefined;
    }
    return message;
  },

  toJSON(message: MsgCreateEthBridgeClaim): unknown {
    const obj: any = {};
    message.ethBridgeClaim !== undefined &&
      (obj.ethBridgeClaim = message.ethBridgeClaim
        ? EthBridgeClaim.toJSON(message.ethBridgeClaim)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreateEthBridgeClaim>,
  ): MsgCreateEthBridgeClaim {
    const message = {
      ...baseMsgCreateEthBridgeClaim,
    } as MsgCreateEthBridgeClaim;
    if (object.ethBridgeClaim !== undefined && object.ethBridgeClaim !== null) {
      message.ethBridgeClaim = EthBridgeClaim.fromPartial(
        object.ethBridgeClaim,
      );
    } else {
      message.ethBridgeClaim = undefined;
    }
    return message;
  },
};

const baseMsgCreateEthBridgeClaimResponse: object = {};

export const MsgCreateEthBridgeClaimResponse = {
  encode(
    _: MsgCreateEthBridgeClaimResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgCreateEthBridgeClaimResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateEthBridgeClaimResponse,
    } as MsgCreateEthBridgeClaimResponse;
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

  fromJSON(_: any): MsgCreateEthBridgeClaimResponse {
    const message = {
      ...baseMsgCreateEthBridgeClaimResponse,
    } as MsgCreateEthBridgeClaimResponse;
    return message;
  },

  toJSON(_: MsgCreateEthBridgeClaimResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgCreateEthBridgeClaimResponse>,
  ): MsgCreateEthBridgeClaimResponse {
    const message = {
      ...baseMsgCreateEthBridgeClaimResponse,
    } as MsgCreateEthBridgeClaimResponse;
    return message;
  },
};

const baseMsgUpdateWhiteListValidator: object = {
  cosmosSender: "",
  validator: "",
  operationType: "",
};

export const MsgUpdateWhiteListValidator = {
  encode(
    message: MsgUpdateWhiteListValidator,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cosmosSender !== "") {
      writer.uint32(10).string(message.cosmosSender);
    }
    if (message.validator !== "") {
      writer.uint32(18).string(message.validator);
    }
    if (message.operationType !== "") {
      writer.uint32(26).string(message.operationType);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgUpdateWhiteListValidator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateWhiteListValidator,
    } as MsgUpdateWhiteListValidator;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosSender = reader.string();
          break;
        case 2:
          message.validator = reader.string();
          break;
        case 3:
          message.operationType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateWhiteListValidator {
    const message = {
      ...baseMsgUpdateWhiteListValidator,
    } as MsgUpdateWhiteListValidator;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = String(object.cosmosSender);
    } else {
      message.cosmosSender = "";
    }
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = String(object.validator);
    } else {
      message.validator = "";
    }
    if (object.operationType !== undefined && object.operationType !== null) {
      message.operationType = String(object.operationType);
    } else {
      message.operationType = "";
    }
    return message;
  },

  toJSON(message: MsgUpdateWhiteListValidator): unknown {
    const obj: any = {};
    message.cosmosSender !== undefined &&
      (obj.cosmosSender = message.cosmosSender);
    message.validator !== undefined && (obj.validator = message.validator);
    message.operationType !== undefined &&
      (obj.operationType = message.operationType);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgUpdateWhiteListValidator>,
  ): MsgUpdateWhiteListValidator {
    const message = {
      ...baseMsgUpdateWhiteListValidator,
    } as MsgUpdateWhiteListValidator;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = object.cosmosSender;
    } else {
      message.cosmosSender = "";
    }
    if (object.validator !== undefined && object.validator !== null) {
      message.validator = object.validator;
    } else {
      message.validator = "";
    }
    if (object.operationType !== undefined && object.operationType !== null) {
      message.operationType = object.operationType;
    } else {
      message.operationType = "";
    }
    return message;
  },
};

const baseMsgUpdateWhiteListValidatorResponse: object = {};

export const MsgUpdateWhiteListValidatorResponse = {
  encode(
    _: MsgUpdateWhiteListValidatorResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgUpdateWhiteListValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateWhiteListValidatorResponse,
    } as MsgUpdateWhiteListValidatorResponse;
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

  fromJSON(_: any): MsgUpdateWhiteListValidatorResponse {
    const message = {
      ...baseMsgUpdateWhiteListValidatorResponse,
    } as MsgUpdateWhiteListValidatorResponse;
    return message;
  },

  toJSON(_: MsgUpdateWhiteListValidatorResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgUpdateWhiteListValidatorResponse>,
  ): MsgUpdateWhiteListValidatorResponse {
    const message = {
      ...baseMsgUpdateWhiteListValidatorResponse,
    } as MsgUpdateWhiteListValidatorResponse;
    return message;
  },
};

const baseMsgUpdateCethReceiverAccount: object = {
  cosmosSender: "",
  cethReceiverAccount: "",
};

export const MsgUpdateCethReceiverAccount = {
  encode(
    message: MsgUpdateCethReceiverAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cosmosSender !== "") {
      writer.uint32(10).string(message.cosmosSender);
    }
    if (message.cethReceiverAccount !== "") {
      writer.uint32(18).string(message.cethReceiverAccount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgUpdateCethReceiverAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateCethReceiverAccount,
    } as MsgUpdateCethReceiverAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosSender = reader.string();
          break;
        case 2:
          message.cethReceiverAccount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateCethReceiverAccount {
    const message = {
      ...baseMsgUpdateCethReceiverAccount,
    } as MsgUpdateCethReceiverAccount;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = String(object.cosmosSender);
    } else {
      message.cosmosSender = "";
    }
    if (
      object.cethReceiverAccount !== undefined &&
      object.cethReceiverAccount !== null
    ) {
      message.cethReceiverAccount = String(object.cethReceiverAccount);
    } else {
      message.cethReceiverAccount = "";
    }
    return message;
  },

  toJSON(message: MsgUpdateCethReceiverAccount): unknown {
    const obj: any = {};
    message.cosmosSender !== undefined &&
      (obj.cosmosSender = message.cosmosSender);
    message.cethReceiverAccount !== undefined &&
      (obj.cethReceiverAccount = message.cethReceiverAccount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgUpdateCethReceiverAccount>,
  ): MsgUpdateCethReceiverAccount {
    const message = {
      ...baseMsgUpdateCethReceiverAccount,
    } as MsgUpdateCethReceiverAccount;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = object.cosmosSender;
    } else {
      message.cosmosSender = "";
    }
    if (
      object.cethReceiverAccount !== undefined &&
      object.cethReceiverAccount !== null
    ) {
      message.cethReceiverAccount = object.cethReceiverAccount;
    } else {
      message.cethReceiverAccount = "";
    }
    return message;
  },
};

const baseMsgUpdateCethReceiverAccountResponse: object = {};

export const MsgUpdateCethReceiverAccountResponse = {
  encode(
    _: MsgUpdateCethReceiverAccountResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgUpdateCethReceiverAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateCethReceiverAccountResponse,
    } as MsgUpdateCethReceiverAccountResponse;
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

  fromJSON(_: any): MsgUpdateCethReceiverAccountResponse {
    const message = {
      ...baseMsgUpdateCethReceiverAccountResponse,
    } as MsgUpdateCethReceiverAccountResponse;
    return message;
  },

  toJSON(_: MsgUpdateCethReceiverAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgUpdateCethReceiverAccountResponse>,
  ): MsgUpdateCethReceiverAccountResponse {
    const message = {
      ...baseMsgUpdateCethReceiverAccountResponse,
    } as MsgUpdateCethReceiverAccountResponse;
    return message;
  },
};

const baseMsgRescueCeth: object = {
  cosmosSender: "",
  cosmosReceiver: "",
  cethAmount: "",
};

export const MsgRescueCeth = {
  encode(
    message: MsgRescueCeth,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.cosmosSender !== "") {
      writer.uint32(10).string(message.cosmosSender);
    }
    if (message.cosmosReceiver !== "") {
      writer.uint32(18).string(message.cosmosReceiver);
    }
    if (message.cethAmount !== "") {
      writer.uint32(26).string(message.cethAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRescueCeth {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRescueCeth } as MsgRescueCeth;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosSender = reader.string();
          break;
        case 2:
          message.cosmosReceiver = reader.string();
          break;
        case 3:
          message.cethAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRescueCeth {
    const message = { ...baseMsgRescueCeth } as MsgRescueCeth;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = String(object.cosmosSender);
    } else {
      message.cosmosSender = "";
    }
    if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
      message.cosmosReceiver = String(object.cosmosReceiver);
    } else {
      message.cosmosReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = String(object.cethAmount);
    } else {
      message.cethAmount = "";
    }
    return message;
  },

  toJSON(message: MsgRescueCeth): unknown {
    const obj: any = {};
    message.cosmosSender !== undefined &&
      (obj.cosmosSender = message.cosmosSender);
    message.cosmosReceiver !== undefined &&
      (obj.cosmosReceiver = message.cosmosReceiver);
    message.cethAmount !== undefined && (obj.cethAmount = message.cethAmount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRescueCeth>): MsgRescueCeth {
    const message = { ...baseMsgRescueCeth } as MsgRescueCeth;
    if (object.cosmosSender !== undefined && object.cosmosSender !== null) {
      message.cosmosSender = object.cosmosSender;
    } else {
      message.cosmosSender = "";
    }
    if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
      message.cosmosReceiver = object.cosmosReceiver;
    } else {
      message.cosmosReceiver = "";
    }
    if (object.cethAmount !== undefined && object.cethAmount !== null) {
      message.cethAmount = object.cethAmount;
    } else {
      message.cethAmount = "";
    }
    return message;
  },
};

const baseMsgRescueCethResponse: object = {};

export const MsgRescueCethResponse = {
  encode(
    _: MsgRescueCethResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRescueCethResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRescueCethResponse } as MsgRescueCethResponse;
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

  fromJSON(_: any): MsgRescueCethResponse {
    const message = { ...baseMsgRescueCethResponse } as MsgRescueCethResponse;
    return message;
  },

  toJSON(_: MsgRescueCethResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgRescueCethResponse>): MsgRescueCethResponse {
    const message = { ...baseMsgRescueCethResponse } as MsgRescueCethResponse;
    return message;
  },
};

/** Msg service for messages */
export interface Msg {
  Lock(request: MsgLock): Promise<MsgLockResponse>;
  Burn(request: MsgBurn): Promise<MsgBurnResponse>;
  CreateEthBridgeClaim(
    request: MsgCreateEthBridgeClaim,
  ): Promise<MsgCreateEthBridgeClaimResponse>;
  UpdateWhiteListValidator(
    request: MsgUpdateWhiteListValidator,
  ): Promise<MsgUpdateWhiteListValidatorResponse>;
  UpdateCethReceiverAccount(
    request: MsgUpdateCethReceiverAccount,
  ): Promise<MsgUpdateCethReceiverAccountResponse>;
  RescueCeth(request: MsgRescueCeth): Promise<MsgRescueCethResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Lock = this.Lock.bind(this);
    this.Burn = this.Burn.bind(this);
    this.CreateEthBridgeClaim = this.CreateEthBridgeClaim.bind(this);
    this.UpdateWhiteListValidator = this.UpdateWhiteListValidator.bind(this);
    this.UpdateCethReceiverAccount = this.UpdateCethReceiverAccount.bind(this);
    this.RescueCeth = this.RescueCeth.bind(this);
  }
  Lock(request: MsgLock): Promise<MsgLockResponse> {
    const data = MsgLock.encode(request).finish();
    const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "Lock", data);
    return promise.then((data) => MsgLockResponse.decode(new _m0.Reader(data)));
  }

  Burn(request: MsgBurn): Promise<MsgBurnResponse> {
    const data = MsgBurn.encode(request).finish();
    const promise = this.rpc.request("sifnode.ethbridge.v1.Msg", "Burn", data);
    return promise.then((data) => MsgBurnResponse.decode(new _m0.Reader(data)));
  }

  CreateEthBridgeClaim(
    request: MsgCreateEthBridgeClaim,
  ): Promise<MsgCreateEthBridgeClaimResponse> {
    const data = MsgCreateEthBridgeClaim.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.ethbridge.v1.Msg",
      "CreateEthBridgeClaim",
      data,
    );
    return promise.then((data) =>
      MsgCreateEthBridgeClaimResponse.decode(new _m0.Reader(data)),
    );
  }

  UpdateWhiteListValidator(
    request: MsgUpdateWhiteListValidator,
  ): Promise<MsgUpdateWhiteListValidatorResponse> {
    const data = MsgUpdateWhiteListValidator.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.ethbridge.v1.Msg",
      "UpdateWhiteListValidator",
      data,
    );
    return promise.then((data) =>
      MsgUpdateWhiteListValidatorResponse.decode(new _m0.Reader(data)),
    );
  }

  UpdateCethReceiverAccount(
    request: MsgUpdateCethReceiverAccount,
  ): Promise<MsgUpdateCethReceiverAccountResponse> {
    const data = MsgUpdateCethReceiverAccount.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.ethbridge.v1.Msg",
      "UpdateCethReceiverAccount",
      data,
    );
    return promise.then((data) =>
      MsgUpdateCethReceiverAccountResponse.decode(new _m0.Reader(data)),
    );
  }

  RescueCeth(request: MsgRescueCeth): Promise<MsgRescueCethResponse> {
    const data = MsgRescueCeth.encode(request).finish();
    const promise = this.rpc.request(
      "sifnode.ethbridge.v1.Msg",
      "RescueCeth",
      data,
    );
    return promise.then((data) =>
      MsgRescueCethResponse.decode(new _m0.Reader(data)),
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
