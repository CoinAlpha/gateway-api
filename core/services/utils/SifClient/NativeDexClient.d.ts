import * as TokenRegistryV1Tx from "../../../generated/proto/sifnode/tokenregistry/v1/tx";
import * as CLPV1Tx from "../../../generated/proto/sifnode/clp/v1/tx";
import * as DispensationV1Tx from "../../../generated/proto/sifnode/dispensation/v1/tx";
import * as EthbridgeV1Tx from "../../../generated/proto/sifnode/ethbridge/v1/tx";
import * as IBCTransferV1Tx from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx";
import * as CosmosBankV1Tx from "@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { Registry } from "@cosmjs/stargate/node_modules/@cosmjs/proto-signing/build/registry";
import { GeneratedType, OfflineSigner as OfflineStargateSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { NativeDexTransaction, NativeDexTransactionFee } from "./NativeDexTransaction";
import { OfflineSigner as OfflineLaunchpadSigner } from "@cosmjs/launchpad";
import { TransactionStatus, Chain } from "../../../";
import { BroadcastTxResult } from "@cosmjs/launchpad/build/cosmosclient";
declare type OfflineSigner = OfflineLaunchpadSigner | OfflineStargateSigner;
declare type DeepReadonly<T> = T extends object ? {
    [K in keyof T]: DeepReadonly<T[K]>;
} & Readonly<T> : Readonly<T>;
export declare class NativeDexClient {
    private readonly rpcUrl;
    private readonly restUrl;
    private readonly chainId;
    private t34;
    readonly query: ReturnType<typeof NativeDexClient.createQueryClient>;
    readonly tx: ReturnType<typeof NativeDexClient.createTxClient>;
    static feeTable: Record<string, import("@cosmjs/amino").StdFee>;
    protected constructor(rpcUrl: string, restUrl: string, chainId: string, t34: Tendermint34Client, query: ReturnType<typeof NativeDexClient.createQueryClient>, tx: ReturnType<typeof NativeDexClient.createTxClient>);
    static connect(rpcUrl: string, restUrl: string, chainId: string): Promise<NativeDexClient>;
    static connectByChain(chain: Chain): Promise<NativeDexClient>;
    /**
     *
     * Composes arguments for type Registry
     * @static
     * @return {*}  {[string, GeneratedType][]}
     * @memberof NativeDexClient
     */
    static getGeneratedTypes(): [string, GeneratedType][];
    parseTxResult: typeof NativeDexClient.parseTxResult;
    /**
     *
     * Parses `BroadcastTxResult` into DEXv1-compatible output.
     * Will eventually be replaced with custom NativeDex result types
     * @static
     * @param {BroadcastTxResult} result
     * @return {*}  {TransactionStatus}
     * @memberof NativeDexClient
     */
    static parseTxResult(result: BroadcastTxResult): TransactionStatus;
    /**
     *
     * Transforms custom sifnode protobuf modules into types for registry
     */
    static createCustomTypesForModule(nativeModule: Record<string, GeneratedType | any> & {
        protobufPackage: string;
    }): Iterable<[string, GeneratedType]>;
    /**
     *
     * Builds registry with custom generated protbuf types
     */
    static getNativeRegistry(): Registry;
    /**
     * Creates a stargate signing client with custom type registry
     */
    createSigningClient(signer: OfflineSigner): Promise<SigningStargateClient>;
    /**
     *
     * Creates a type-safe amino-friendly transaction client API
     * @static
     * @return {*}
     * @memberof NativeDexClient
     */
    static createTxClient(): {
        dispensation: {
            CreateDistribution: ((arg: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        distributionType: import("../../../generated/proto/sifnode/dispensation/v1/types").DistributionType;
                        authorizedRunner: string;
                        distributor: string;
                        output: string[] & readonly string[];
                    } & Readonly<Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">) => {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateDistribution, "distributionType" | "authorizedRunner" | "distributor" | "output">;
                };
            };
            CreateUserClaim: ((arg: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        userClaimType: import("../../../generated/proto/sifnode/dispensation/v1/types").DistributionType;
                        userClaimAddress: string;
                    } & Readonly<Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">) => {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgCreateUserClaim, "userClaimType" | "userClaimAddress">;
                };
            };
            RunDistribution: ((arg: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        distributionType: import("../../../generated/proto/sifnode/dispensation/v1/types").DistributionType;
                        distributionName: string;
                        authorizedRunner: string;
                    } & Readonly<Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">) => {
                    typeUrl: string;
                    value: Pick<DispensationV1Tx.MsgRunDistribution, "distributionType" | "distributionName" | "authorizedRunner">;
                };
            };
        };
        ethbridge: {
            Lock: ((arg: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        symbol: string;
                        amount: string;
                        ethereumChainId: {
                            high: number;
                            low: number;
                            unsigned: boolean;
                            add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                            and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                            comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                            divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                            div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                            equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            getHighBits: {} & Readonly<() => number>;
                            getHighBitsUnsigned: {} & Readonly<() => number>;
                            getLowBits: {} & Readonly<() => number>;
                            getLowBitsUnsigned: {} & Readonly<() => number>;
                            getNumBitsAbs: {} & Readonly<() => number>;
                            greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            isEven: {} & Readonly<() => boolean>;
                            isNegative: {} & Readonly<() => boolean>;
                            isOdd: {} & Readonly<() => boolean>;
                            isPositive: {} & Readonly<() => boolean>;
                            isZero: {} & Readonly<() => boolean>;
                            lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                            mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                            negate: {} & Readonly<() => import("long").Long>;
                            neg: {} & Readonly<() => import("long").Long>;
                            not: {} & Readonly<() => import("long").Long>;
                            notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                            sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                            toInt: {} & Readonly<() => number>;
                            toNumber: {} & Readonly<() => number>;
                            toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                            toBytesLE: {} & Readonly<() => number[]>;
                            toBytesBE: {} & Readonly<() => number[]>;
                            toSigned: {} & Readonly<() => import("long").Long>;
                            toString: {} & Readonly<(radix?: number | undefined) => string>;
                            toUnsigned: {} & Readonly<() => import("long").Long>;
                            xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                        } & Readonly<import("long").Long>;
                        cosmosSender: string;
                        ethereumReceiver: string;
                        cethAmount: string;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgLock, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                };
            };
            Burn: ((arg: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        symbol: string;
                        amount: string;
                        ethereumChainId: {
                            high: number;
                            low: number;
                            unsigned: boolean;
                            add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                            and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                            comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                            divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                            div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                            equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            getHighBits: {} & Readonly<() => number>;
                            getHighBitsUnsigned: {} & Readonly<() => number>;
                            getLowBits: {} & Readonly<() => number>;
                            getLowBitsUnsigned: {} & Readonly<() => number>;
                            getNumBitsAbs: {} & Readonly<() => number>;
                            greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            isEven: {} & Readonly<() => boolean>;
                            isNegative: {} & Readonly<() => boolean>;
                            isOdd: {} & Readonly<() => boolean>;
                            isPositive: {} & Readonly<() => boolean>;
                            isZero: {} & Readonly<() => boolean>;
                            lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                            mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                            negate: {} & Readonly<() => import("long").Long>;
                            neg: {} & Readonly<() => import("long").Long>;
                            not: {} & Readonly<() => import("long").Long>;
                            notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                            or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                            subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                            sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                            toInt: {} & Readonly<() => number>;
                            toNumber: {} & Readonly<() => number>;
                            toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                            toBytesLE: {} & Readonly<() => number[]>;
                            toBytesBE: {} & Readonly<() => number[]>;
                            toSigned: {} & Readonly<() => import("long").Long>;
                            toString: {} & Readonly<(radix?: number | undefined) => string>;
                            toUnsigned: {} & Readonly<() => import("long").Long>;
                            xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                        } & Readonly<import("long").Long>;
                        cosmosSender: string;
                        ethereumReceiver: string;
                        cethAmount: string;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgBurn, "symbol" | "amount" | "ethereumChainId" | "cosmosSender" | "ethereumReceiver" | "cethAmount">;
                };
            };
            CreateEthBridgeClaim: ((arg: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        ethBridgeClaim?: ({
                            ethereumChainId: {
                                high: number;
                                low: number;
                                unsigned: boolean;
                                add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                getHighBits: {} & Readonly<() => number>;
                                getHighBitsUnsigned: {} & Readonly<() => number>;
                                getLowBits: {} & Readonly<() => number>;
                                getLowBitsUnsigned: {} & Readonly<() => number>;
                                getNumBitsAbs: {} & Readonly<() => number>;
                                greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                isEven: {} & Readonly<() => boolean>;
                                isNegative: {} & Readonly<() => boolean>;
                                isOdd: {} & Readonly<() => boolean>;
                                isPositive: {} & Readonly<() => boolean>;
                                isZero: {} & Readonly<() => boolean>;
                                lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                negate: {} & Readonly<() => import("long").Long>;
                                neg: {} & Readonly<() => import("long").Long>;
                                not: {} & Readonly<() => import("long").Long>;
                                notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                toInt: {} & Readonly<() => number>;
                                toNumber: {} & Readonly<() => number>;
                                toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                toBytesLE: {} & Readonly<() => number[]>;
                                toBytesBE: {} & Readonly<() => number[]>;
                                toSigned: {} & Readonly<() => import("long").Long>;
                                toString: {} & Readonly<(radix?: number | undefined) => string>;
                                toUnsigned: {} & Readonly<() => import("long").Long>;
                                xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            } & Readonly<import("long").Long>;
                            bridgeContractAddress: string;
                            nonce: {
                                high: number;
                                low: number;
                                unsigned: boolean;
                                add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                getHighBits: {} & Readonly<() => number>;
                                getHighBitsUnsigned: {} & Readonly<() => number>;
                                getLowBits: {} & Readonly<() => number>;
                                getLowBitsUnsigned: {} & Readonly<() => number>;
                                getNumBitsAbs: {} & Readonly<() => number>;
                                greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                isEven: {} & Readonly<() => boolean>;
                                isNegative: {} & Readonly<() => boolean>;
                                isOdd: {} & Readonly<() => boolean>;
                                isPositive: {} & Readonly<() => boolean>;
                                isZero: {} & Readonly<() => boolean>;
                                lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                negate: {} & Readonly<() => import("long").Long>;
                                neg: {} & Readonly<() => import("long").Long>;
                                not: {} & Readonly<() => import("long").Long>;
                                notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                toInt: {} & Readonly<() => number>;
                                toNumber: {} & Readonly<() => number>;
                                toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                toBytesLE: {} & Readonly<() => number[]>;
                                toBytesBE: {} & Readonly<() => number[]>;
                                toSigned: {} & Readonly<() => import("long").Long>;
                                toString: {} & Readonly<(radix?: number | undefined) => string>;
                                toUnsigned: {} & Readonly<() => import("long").Long>;
                                xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            } & Readonly<import("long").Long>;
                            symbol: string;
                            tokenContractAddress: string;
                            ethereumSender: string;
                            cosmosReceiver: string;
                            validatorAddress: string;
                            amount: string;
                            claimType: import("../../../generated/proto/sifnode/ethbridge/v1/types").ClaimType;
                        } & Readonly<import("../../../generated/proto/sifnode/ethbridge/v1/types").EthBridgeClaim>) | undefined;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgCreateEthBridgeClaim, "ethBridgeClaim">;
                };
            };
            UpdateWhiteListValidator: ((arg: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        cosmosSender: string;
                        validator: string;
                        operationType: string;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateWhiteListValidator, "cosmosSender" | "validator" | "operationType">;
                };
            };
            UpdateCethReceiverAccount: ((arg: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        cosmosSender: string;
                        cethReceiverAccount: string;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgUpdateCethReceiverAccount, "cosmosSender" | "cethReceiverAccount">;
                };
            };
            RescueCeth: ((arg: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        cosmosReceiver: string;
                        cosmosSender: string;
                        cethAmount: string;
                    } & Readonly<Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">) => {
                    typeUrl: string;
                    value: Pick<EthbridgeV1Tx.MsgRescueCeth, "cosmosReceiver" | "cosmosSender" | "cethAmount">;
                };
            };
        };
        clp: {
            RemoveLiquidity: ((arg: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        wBasisPoints: string;
                        asymmetry: string;
                        externalAsset?: ({
                            symbol: string;
                        } & Readonly<import("../../../generated/proto/sifnode/clp/v1/types").Asset>) | undefined;
                        signer: string;
                    } & Readonly<Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">) => {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgRemoveLiquidity, "wBasisPoints" | "asymmetry" | "externalAsset" | "signer">;
                };
            };
            CreatePool: ((arg: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        externalAsset?: ({
                            symbol: string;
                        } & Readonly<import("../../../generated/proto/sifnode/clp/v1/types").Asset>) | undefined;
                        signer: string;
                        nativeAssetAmount: string;
                        externalAssetAmount: string;
                    } & Readonly<Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">) => {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgCreatePool, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                };
            };
            AddLiquidity: ((arg: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        externalAsset?: ({
                            symbol: string;
                        } & Readonly<import("../../../generated/proto/sifnode/clp/v1/types").Asset>) | undefined;
                        signer: string;
                        nativeAssetAmount: string;
                        externalAssetAmount: string;
                    } & Readonly<Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">) => {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgAddLiquidity, "externalAsset" | "signer" | "nativeAssetAmount" | "externalAssetAmount">;
                };
            };
            Swap: ((arg: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        signer: string;
                        sentAsset?: ({
                            symbol: string;
                        } & Readonly<import("../../../generated/proto/sifnode/clp/v1/types").Asset>) | undefined;
                        receivedAsset?: ({
                            symbol: string;
                        } & Readonly<import("../../../generated/proto/sifnode/clp/v1/types").Asset>) | undefined;
                        sentAmount: string;
                        minReceivingAmount: string;
                    } & Readonly<Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">) => {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgSwap, "signer" | "sentAsset" | "receivedAsset" | "sentAmount" | "minReceivingAmount">;
                };
            };
            DecommissionPool: ((arg: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        symbol: string;
                        signer: string;
                    } & Readonly<Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">) => {
                    typeUrl: string;
                    value: Pick<CLPV1Tx.MsgDecommissionPool, "symbol" | "signer">;
                };
            };
        };
        registry: {
            Register: ((arg: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        from: string;
                        entry?: ({
                            decimals: {
                                high: number;
                                low: number;
                                unsigned: boolean;
                                add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                getHighBits: {} & Readonly<() => number>;
                                getHighBitsUnsigned: {} & Readonly<() => number>;
                                getLowBits: {} & Readonly<() => number>;
                                getLowBitsUnsigned: {} & Readonly<() => number>;
                                getNumBitsAbs: {} & Readonly<() => number>;
                                greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                isEven: {} & Readonly<() => boolean>;
                                isNegative: {} & Readonly<() => boolean>;
                                isOdd: {} & Readonly<() => boolean>;
                                isPositive: {} & Readonly<() => boolean>;
                                isZero: {} & Readonly<() => boolean>;
                                lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                negate: {} & Readonly<() => import("long").Long>;
                                neg: {} & Readonly<() => import("long").Long>;
                                not: {} & Readonly<() => import("long").Long>;
                                notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                toInt: {} & Readonly<() => number>;
                                toNumber: {} & Readonly<() => number>;
                                toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                toBytesLE: {} & Readonly<() => number[]>;
                                toBytesBE: {} & Readonly<() => number[]>;
                                toSigned: {} & Readonly<() => import("long").Long>;
                                toString: {} & Readonly<(radix?: number | undefined) => string>;
                                toUnsigned: {} & Readonly<() => import("long").Long>;
                                xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            } & Readonly<import("long").Long>;
                            denom: string;
                            baseDenom: string;
                            path: string;
                            ibcChannelId: string;
                            ibcCounterpartyChannelId: string;
                            displayName: string;
                            displaySymbol: string;
                            network: string;
                            address: string;
                            externalSymbol: string;
                            transferLimit: string;
                            permissions: import("../../../generated/proto/sifnode/tokenregistry/v1/types").Permission[] & readonly import("../../../generated/proto/sifnode/tokenregistry/v1/types").Permission[];
                            unitDenom: string;
                            ibcCounterpartyDenom: string;
                            ibcCounterpartyChainId: string;
                        } & Readonly<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>) | undefined;
                    } & Readonly<Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">) => {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgRegister, "from" | "entry">;
                };
            };
            Deregister: ((arg: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        denom: string;
                        from: string;
                    } & Readonly<Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">) => {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgDeregister, "denom" | "from">;
                };
            };
            SetRegistry: ((arg: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        registry?: ({
                            entries: ({
                                decimals: {
                                    high: number;
                                    low: number;
                                    unsigned: boolean;
                                    add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                    and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                    compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                    comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                    divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                    div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                    equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    getHighBits: {} & Readonly<() => number>;
                                    getHighBitsUnsigned: {} & Readonly<() => number>;
                                    getLowBits: {} & Readonly<() => number>;
                                    getLowBitsUnsigned: {} & Readonly<() => number>;
                                    getNumBitsAbs: {} & Readonly<() => number>;
                                    greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    isEven: {} & Readonly<() => boolean>;
                                    isNegative: {} & Readonly<() => boolean>;
                                    isOdd: {} & Readonly<() => boolean>;
                                    isPositive: {} & Readonly<() => boolean>;
                                    isZero: {} & Readonly<() => boolean>;
                                    lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                    mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                    multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                    mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                    negate: {} & Readonly<() => import("long").Long>;
                                    neg: {} & Readonly<() => import("long").Long>;
                                    not: {} & Readonly<() => import("long").Long>;
                                    notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                    or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                    shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                    subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                    sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                    toInt: {} & Readonly<() => number>;
                                    toNumber: {} & Readonly<() => number>;
                                    toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                    toBytesLE: {} & Readonly<() => number[]>;
                                    toBytesBE: {} & Readonly<() => number[]>;
                                    toSigned: {} & Readonly<() => import("long").Long>;
                                    toString: {} & Readonly<(radix?: number | undefined) => string>;
                                    toUnsigned: {} & Readonly<() => import("long").Long>;
                                    xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                } & Readonly<import("long").Long>;
                                denom: string;
                                baseDenom: string;
                                path: string;
                                ibcChannelId: string;
                                ibcCounterpartyChannelId: string;
                                displayName: string;
                                displaySymbol: string;
                                network: string;
                                address: string;
                                externalSymbol: string;
                                transferLimit: string;
                                permissions: import("../../../generated/proto/sifnode/tokenregistry/v1/types").Permission[] & readonly import("../../../generated/proto/sifnode/tokenregistry/v1/types").Permission[];
                                unitDenom: string;
                                ibcCounterpartyDenom: string;
                                ibcCounterpartyChainId: string;
                            } & Readonly<import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry>)[] & readonly import("../../../generated/proto/sifnode/tokenregistry/v1/types").RegistryEntry[];
                        } & Readonly<import("../../../generated/proto/sifnode/tokenregistry/v1/types").Registry>) | undefined;
                        from: string;
                    } & Readonly<Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">) => {
                    typeUrl: string;
                    value: Pick<TokenRegistryV1Tx.MsgSetRegistry, "registry" | "from">;
                };
            };
        };
        ibc: {
            Transfer: ((arg: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        sourcePort: string;
                        sourceChannel: string;
                        token?: ({
                            denom: string;
                            amount: string;
                        } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin>) | undefined;
                        sender: string;
                        receiver: string;
                        timeoutHeight?: ({
                            revisionNumber: {
                                high: number;
                                low: number;
                                unsigned: boolean;
                                add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                getHighBits: {} & Readonly<() => number>;
                                getHighBitsUnsigned: {} & Readonly<() => number>;
                                getLowBits: {} & Readonly<() => number>;
                                getLowBitsUnsigned: {} & Readonly<() => number>;
                                getNumBitsAbs: {} & Readonly<() => number>;
                                greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                isEven: {} & Readonly<() => boolean>;
                                isNegative: {} & Readonly<() => boolean>;
                                isOdd: {} & Readonly<() => boolean>;
                                isPositive: {} & Readonly<() => boolean>;
                                isZero: {} & Readonly<() => boolean>;
                                lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                negate: {} & Readonly<() => import("long").Long>;
                                neg: {} & Readonly<() => import("long").Long>;
                                not: {} & Readonly<() => import("long").Long>;
                                notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                toInt: {} & Readonly<() => number>;
                                toNumber: {} & Readonly<() => number>;
                                toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                toBytesLE: {} & Readonly<() => number[]>;
                                toBytesBE: {} & Readonly<() => number[]>;
                                toSigned: {} & Readonly<() => import("long").Long>;
                                toString: {} & Readonly<(radix?: number | undefined) => string>;
                                toUnsigned: {} & Readonly<() => import("long").Long>;
                                xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            } & Readonly<import("long").Long>;
                            revisionHeight: {
                                high: number;
                                low: number;
                                unsigned: boolean;
                                add: {} & Readonly<(addend: string | number | import("long").Long) => import("long").Long>;
                                and: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                compare: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                comp: {} & Readonly<(other: string | number | import("long").Long) => number>;
                                divide: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                div: {} & Readonly<(divisor: string | number | import("long").Long) => import("long").Long>;
                                equals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                eq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                getHighBits: {} & Readonly<() => number>;
                                getHighBitsUnsigned: {} & Readonly<() => number>;
                                getLowBits: {} & Readonly<() => number>;
                                getLowBitsUnsigned: {} & Readonly<() => number>;
                                getNumBitsAbs: {} & Readonly<() => number>;
                                greaterThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                greaterThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                gte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                isEven: {} & Readonly<() => boolean>;
                                isNegative: {} & Readonly<() => boolean>;
                                isOdd: {} & Readonly<() => boolean>;
                                isPositive: {} & Readonly<() => boolean>;
                                isZero: {} & Readonly<() => boolean>;
                                lessThan: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lt: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lessThanOrEqual: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                lte: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                modulo: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                mod: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                multiply: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                mul: {} & Readonly<(multiplier: string | number | import("long").Long) => import("long").Long>;
                                negate: {} & Readonly<() => import("long").Long>;
                                neg: {} & Readonly<() => import("long").Long>;
                                not: {} & Readonly<() => import("long").Long>;
                                notEquals: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                neq: {} & Readonly<(other: string | number | import("long").Long) => boolean>;
                                or: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                                shiftLeft: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shl: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRight: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shr: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shiftRightUnsigned: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                shru: {} & Readonly<(numBits: number | import("long").Long) => import("long").Long>;
                                subtract: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                sub: {} & Readonly<(subtrahend: string | number | import("long").Long) => import("long").Long>;
                                toInt: {} & Readonly<() => number>;
                                toNumber: {} & Readonly<() => number>;
                                toBytes: {} & Readonly<(le?: boolean | undefined) => number[]>;
                                toBytesLE: {} & Readonly<() => number[]>;
                                toBytesBE: {} & Readonly<() => number[]>;
                                toSigned: {} & Readonly<() => import("long").Long>;
                                toString: {} & Readonly<(radix?: number | undefined) => string>;
                                toUnsigned: {} & Readonly<() => import("long").Long>;
                                xor: {} & Readonly<(other: string | number | import("long").Long) => import("long").Long>;
                            } & Readonly<import("long").Long>;
                        } & Readonly<import("@cosmjs/stargate/build/codec/ibc/core/client/v1/client").Height>) | undefined;
                    } & Readonly<Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">) => {
                    typeUrl: string;
                    value: Pick<IBCTransferV1Tx.MsgTransfer, "sourcePort" | "sourceChannel" | "token" | "sender" | "receiver" | "timeoutHeight">;
                };
            };
        };
        bank: {
            Send: ((arg: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        amount: ({
                            denom: string;
                            amount: string;
                        } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin>)[] & readonly import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin[];
                        fromAddress: string;
                        toAddress: string;
                    } & Readonly<Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">) => {
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgSend, "amount" | "fromAddress" | "toAddress">;
                };
            };
            MultiSend: ((arg: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">, senderAddress: string, fee?: NativeDexTransactionFee | undefined, memo?: string | undefined) => {
                readonly fromAddress: string;
                readonly msgs: ({
                    typeUrl: string;
                    value: {
                        inputs: ({
                            address: string;
                            coins: ({
                                denom: string;
                                amount: string;
                            } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin>)[] & readonly import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin[];
                        } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/bank").Input>)[] & readonly import("@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/bank").Input[];
                        outputs: ({
                            address: string;
                            coins: ({
                                denom: string;
                                amount: string;
                            } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin>)[] & readonly import("@cosmjs/stargate/build/codec/cosmos/base/v1beta1/coin").Coin[];
                        } & Readonly<import("@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/bank").Output>)[] & readonly import("@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/bank").Output[];
                    } & Readonly<Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">>;
                } & Readonly<{
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">;
                }>)[] & readonly {
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">;
                }[];
                readonly fee: {
                    gas: string;
                    price: {
                        denom: string;
                        amount: string;
                    } & Readonly<{
                        denom: string;
                        amount: string;
                    }>;
                } & Readonly<NativeDexTransactionFee>;
                readonly memo: string;
            } & Readonly<NativeDexTransaction<{
                typeUrl: string;
                value: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">;
            }>>) & {
                createRawEncodeObject: (arg: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">) => {
                    typeUrl: string;
                    value: Pick<CosmosBankV1Tx.MsgMultiSend, "inputs" | "outputs">;
                };
            };
        };
    };
    private static createQueryClient;
}
export {};
