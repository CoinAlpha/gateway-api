import { Ref } from "@vue/reactivity";
import { Asset, IPool, IAssetAmount } from "../../../entities";
export declare enum SwapState {
    ZERO_AMOUNTS = 0,
    INSUFFICIENT_FUNDS = 1,
    VALID_INPUT = 2,
    INVALID_AMOUNT = 3,
    INSUFFICIENT_LIQUIDITY = 4,
    FRONTRUN_SLIPPAGE = 5,
    INVALID_SLIPPAGE = 6
}
export declare function useSwapCalculator(input: {
    fromAmount: Ref<string>;
    fromSymbol: Ref<string | null>;
    toAmount: Ref<string>;
    toSymbol: Ref<string | null>;
    balances: Ref<IAssetAmount[]>;
    selectedField: Ref<"from" | "to" | null>;
    slippage: Ref<string>;
    poolFinder: (a: Asset | string, b: Asset | string) => Ref<IPool> | null;
}): {
    state: import("@vue/reactivity").ComputedRef<SwapState>;
    fromFieldAmount: import("@vue/reactivity").ComputedRef<IAssetAmount | null>;
    toFieldAmount: import("@vue/reactivity").ComputedRef<IAssetAmount | null>;
    toAmount: Ref<string>;
    fromAmount: Ref<string>;
    priceImpact: import("@vue/reactivity").ComputedRef<string | null>;
    providerFee: import("@vue/reactivity").ComputedRef<string | null>;
    minimumReceived: import("@vue/reactivity").ComputedRef<IAssetAmount | null>;
    swapResult: Ref<{
        readonly address?: string | undefined;
        readonly decimals: number;
        readonly imageUrl?: string | undefined;
        readonly name: string;
        readonly network: import("../../../entities").Network;
        readonly symbol: string;
        readonly unitDenom?: string | undefined;
        readonly ibcDenom?: string | undefined;
        readonly displaySymbol: string;
        readonly lowercasePrefixLength?: number | undefined;
        readonly label?: string | undefined;
        readonly hasDarkIcon?: boolean | undefined;
        readonly homeNetwork: import("../../../entities").Network;
        readonly decommissioned?: true | undefined;
        readonly decommissionReason?: string | undefined;
        readonly asset: {
            address?: string | undefined;
            decimals: number;
            imageUrl?: string | undefined;
            name: string;
            network: import("../../../entities").Network;
            symbol: string;
            unitDenom?: string | undefined;
            ibcDenom?: string | undefined;
            displaySymbol: string;
            lowercasePrefixLength?: number | undefined;
            label?: string | undefined;
            hasDarkIcon?: boolean | undefined;
            homeNetwork: import("../../../entities").Network;
            decommissioned?: true | undefined;
            decommissionReason?: string | undefined;
        };
        readonly amount: {
            toBigInt: () => import("jsbi").default;
            toString: (detailed?: boolean | undefined) => string;
            add: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            divide: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            equalTo: (other: string | import("../../../entities").IAmount) => boolean;
            greaterThan: (other: string | import("../../../entities").IAmount) => boolean;
            greaterThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
            lessThan: (other: string | import("../../../entities").IAmount) => boolean;
            lessThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
            multiply: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            sqrt: () => import("../../../entities").IAmount;
            subtract: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        };
        toBigInt: () => import("jsbi").default;
        toString: (() => string) & ((detailed?: boolean | undefined) => string);
        toDerived: () => import("../../../entities").IAmount;
        add: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        divide: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        equalTo: (other: string | import("../../../entities").IAmount) => boolean;
        greaterThan: (other: string | import("../../../entities").IAmount) => boolean;
        greaterThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
        lessThan: (other: string | import("../../../entities").IAmount) => boolean;
        lessThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
        multiply: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        sqrt: () => import("../../../entities").IAmount;
        subtract: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
    } | null>;
    reverseSwapResult: Ref<{
        readonly address?: string | undefined;
        readonly decimals: number;
        readonly imageUrl?: string | undefined;
        readonly name: string;
        readonly network: import("../../../entities").Network;
        readonly symbol: string;
        readonly unitDenom?: string | undefined;
        readonly ibcDenom?: string | undefined;
        readonly displaySymbol: string;
        readonly lowercasePrefixLength?: number | undefined;
        readonly label?: string | undefined;
        readonly hasDarkIcon?: boolean | undefined;
        readonly homeNetwork: import("../../../entities").Network;
        readonly decommissioned?: true | undefined;
        readonly decommissionReason?: string | undefined;
        readonly asset: {
            address?: string | undefined;
            decimals: number;
            imageUrl?: string | undefined;
            name: string;
            network: import("../../../entities").Network;
            symbol: string;
            unitDenom?: string | undefined;
            ibcDenom?: string | undefined;
            displaySymbol: string;
            lowercasePrefixLength?: number | undefined;
            label?: string | undefined;
            hasDarkIcon?: boolean | undefined;
            homeNetwork: import("../../../entities").Network;
            decommissioned?: true | undefined;
            decommissionReason?: string | undefined;
        };
        readonly amount: {
            toBigInt: () => import("jsbi").default;
            toString: (detailed?: boolean | undefined) => string;
            add: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            divide: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            equalTo: (other: string | import("../../../entities").IAmount) => boolean;
            greaterThan: (other: string | import("../../../entities").IAmount) => boolean;
            greaterThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
            lessThan: (other: string | import("../../../entities").IAmount) => boolean;
            lessThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
            multiply: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
            sqrt: () => import("../../../entities").IAmount;
            subtract: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        };
        toBigInt: () => import("jsbi").default;
        toString: (() => string) & ((detailed?: boolean | undefined) => string);
        toDerived: () => import("../../../entities").IAmount;
        add: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        divide: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        equalTo: (other: string | import("../../../entities").IAmount) => boolean;
        greaterThan: (other: string | import("../../../entities").IAmount) => boolean;
        greaterThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
        lessThan: (other: string | import("../../../entities").IAmount) => boolean;
        lessThanOrEqual: (other: string | import("../../../entities").IAmount) => boolean;
        multiply: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
        sqrt: () => import("../../../entities").IAmount;
        subtract: (other: string | import("../../../entities").IAmount) => import("../../../entities").IAmount;
    } | null>;
    priceRatio: import("@vue/reactivity").ComputedRef<string>;
    priceMessage: import("@vue/reactivity").ComputedRef<string>;
};
