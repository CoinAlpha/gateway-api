import { Asset, IAssetAmount, LiquidityProvider, Pool } from "../../../entities";
export declare enum PoolState {
    SELECT_TOKENS = 0,
    ZERO_AMOUNTS = 1,
    INSUFFICIENT_FUNDS = 2,
    VALID_INPUT = 3,
    NO_LIQUIDITY = 4,
    ZERO_AMOUNTS_NEW_POOL = 5
}
export declare function usePoolCalculator(input: {
    tokenAAmount: string;
    tokenASymbol: string | null;
    tokenBAmount: string;
    tokenBSymbol: string | null;
    balances: IAssetAmount[];
    liquidityProvider: LiquidityProvider | null;
    poolFinder: (a: Asset | string, b: Asset | string) => Pool | null;
    guidedMode: boolean;
    lastFocusedTokenField: "A" | "B" | null;
    setTokenAAmount: (amount: string) => void;
    setTokenBAmount: (amount: string) => void;
}): {
    state: PoolState;
    aPerBRatioMessage: string;
    bPerARatioMessage: string;
    aPerBRatioProjectedMessage: string;
    bPerARatioProjectedMessage: string;
    shareOfPool: import("../../../entities").IAmount;
    shareOfPoolPercent: string;
    preExistingPool: {
        amounts: [IAssetAmount, IAssetAmount];
        readonly externalAmount: IAssetAmount | undefined;
        readonly nativeAmount: IAssetAmount | undefined;
        otherAsset: (asset: import("../../../entities").IAsset) => IAssetAmount;
        symbol: () => string;
        contains: (...assets: import("../../../entities").IAsset[]) => boolean;
        toString: () => string;
        getAmount: (asset: string | import("../../../entities").IAsset) => IAssetAmount;
        poolUnits: import("../../../entities").IAmount;
        priceAsset(asset: import("../../../entities").IAsset): IAssetAmount;
        calcProviderFee(x: IAssetAmount): IAssetAmount;
        calcPriceImpact(x: IAssetAmount): import("../../../entities").IAmount;
        calcSwapResult(x: IAssetAmount): IAssetAmount;
        calcReverseSwapResult(Sa: IAssetAmount): IAssetAmount;
        calculatePoolUnits(nativeAssetAmount: IAssetAmount, externalAssetAmount: IAssetAmount): import("../../../entities").IAmount[];
    } | null;
    totalLiquidityProviderUnits: string;
    totalPoolUnits: string;
    poolAmounts: IAssetAmount[] | null;
    tokenAFieldAmount: IAssetAmount | null;
    tokenBFieldAmount: IAssetAmount | null;
};
