/* 
--------------------------
WARNING
--------------------------

This implementation is functionally correct, but causes a severe bug when implemented
within an observer pattern. Please use `reactiveAddLiquidityCalculator` until further notice.

*/
import {
  Asset,
  AssetAmount,
  IAssetAmount,
  LiquidityProvider,
  Pool,
} from "../../../entities";
import { Amount } from "../../../entities";
import { format } from "../../../utils/format";

export enum PoolState {
  SELECT_TOKENS,
  ZERO_AMOUNTS,
  INSUFFICIENT_FUNDS,
  VALID_INPUT,
  NO_LIQUIDITY,
  ZERO_AMOUNTS_NEW_POOL,
}
import { toBaseUnits } from "../../../utils";

// The following has been done as a stepping stone for refactoring away from
// @vue/reactivity - this was the quickest way to remove it from this api
// for our react FE implementors. Here we are leaving this as we may want to
// add a dependency array to utilize this as a memoization point if this function
// becomes a slow point that we want to optimize. Eg. computed((var1,var2) => {...}, [var1,var2])
function computed<T>(fn: () => T) {
  return fn();
}

function useField(amount: string, symbol: string | null) {
  const asset = computed(() => {
    if (!symbol) return null;
    return Asset(symbol);
  });

  const fieldAmount = computed(() => {
    if (!asset || !amount) return null;
    return AssetAmount(asset, toBaseUnits(amount, asset));
  });

  return {
    fieldAmount,
    asset,
  };
}

function useBalances(balances: IAssetAmount[]) {
  return computed(() => {
    const map = new Map<string, IAssetAmount>();

    for (const item of balances) {
      map.set(item.asset.symbol, item);
    }
    return map;
  });
}

export function usePoolCalculator(input: {
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
}) {
  const tokenAField = useField(input.tokenAAmount, input.tokenASymbol);
  const tokenBField = useField(input.tokenBAmount, input.tokenBSymbol);
  const balanceMap = useBalances(input.balances);

  const preExistingPool = computed(() => {
    if (!tokenAField.asset || !tokenBField.asset) {
      return null;
    }

    // Find pool from poolFinder
    const pool = input.poolFinder(
      tokenAField.asset.symbol,
      tokenBField.asset.symbol,
    );

    return pool || null;
  });

  const assetA = computed(() => {
    if (!input.tokenASymbol) {
      return null;
    }
    return Asset.get(input.tokenASymbol);
  });

  const assetB = computed(() => {
    if (!input.tokenBSymbol) {
      return null;
    }
    return Asset.get(input.tokenBSymbol);
  });

  const tokenABalance = computed(() => {
    if (!tokenAField.fieldAmount || !tokenAField.asset) {
      return null;
    }

    if (preExistingPool) {
      return input.tokenASymbol
        ? balanceMap.get(input.tokenASymbol) ??
            AssetAmount(tokenAField.asset, "0")
        : null;
    } else {
      return input.tokenASymbol
        ? balanceMap.get(input.tokenASymbol) ?? null
        : null;
    }
  });
  const tokenBBalance = computed(() => {
    return input.tokenBSymbol
      ? balanceMap.get(input.tokenBSymbol) ?? null
      : null;
  });

  const fromBalanceOverdrawn = computed(() => {
    return !tokenABalance?.greaterThanOrEqual(tokenAField.fieldAmount || "0");
  });

  const toBalanceOverdrawn = computed(
    () => !tokenBBalance?.greaterThanOrEqual(tokenBField.fieldAmount || "0"),
  );

  const liquidityPool = computed(() => {
    if (preExistingPool) {
      return preExistingPool;
    }
    if (
      !tokenAField.fieldAmount ||
      !tokenBField.fieldAmount ||
      !tokenAField.asset ||
      !tokenBField.asset
    ) {
      return null;
    }

    return Pool(
      AssetAmount(tokenAField.asset, "0"),
      AssetAmount(tokenBField.asset, "0"),
    );
  });

  // pool units for this prospective transaction [total, newUnits]
  const provisionedPoolUnitsArray = computed(() => {
    if (
      !liquidityPool ||
      !tokenBField.fieldAmount ||
      !tokenAField.fieldAmount
    ) {
      return [Amount("0"), Amount("0")];
    }

    return liquidityPool.calculatePoolUnits(
      tokenBField.fieldAmount,
      tokenAField.fieldAmount,
    );
  });

  // pool units from the perspective of the liquidity provider
  const liquidityProviderPoolUnitsArray = computed(() => {
    if (!provisionedPoolUnitsArray) return [Amount("0"), Amount("0")];

    const [totalPoolUnits, newUnits] = provisionedPoolUnitsArray;

    // if this user already has pool units include those in the newUnits
    const totalLiquidityProviderUnits = input.liquidityProvider
      ? input.liquidityProvider.units.add(newUnits)
      : newUnits;

    return [totalPoolUnits, totalLiquidityProviderUnits];
  });

  const totalPoolUnits = computed(() =>
    liquidityProviderPoolUnitsArray[0].toBigInt().toString(),
  );

  const totalLiquidityProviderUnits = computed(() =>
    liquidityProviderPoolUnitsArray[1].toBigInt().toString(),
  );

  const shareOfPool = computed(() => {
    if (!liquidityProviderPoolUnitsArray) return Amount("0");

    const [units, lpUnits] = liquidityProviderPoolUnitsArray;

    // shareOfPool should be 0 if units and lpUnits are zero
    if (units.equalTo("0") && lpUnits.equalTo("0")) return Amount("0");

    // if no units lp owns 100% of pool
    return units.equalTo("0") ? Amount("1") : lpUnits.divide(units);
  });

  const shareOfPoolPercent = computed(() => {
    if (shareOfPool.multiply("10000").lessThan("1")) return "< 0.01%";
    return `${format(shareOfPool, {
      mantissa: 2,
      mode: "percent",
    })}`;
  });

  const poolAmounts = computed(() => {
    if (!preExistingPool || !tokenAField.asset) {
      return null;
    }

    if (!preExistingPool.contains(tokenAField.asset)) return null;
    const externalBalance = preExistingPool.getAmount(tokenAField.asset);
    const nativeBalance = preExistingPool.getAmount("rowan");

    return [nativeBalance, externalBalance];
  });

  // external_balance / native_balance
  const aPerBRatio = computed(() => {
    if (!poolAmounts) return 0;
    const [native, external] = poolAmounts;

    const derivedNative = native.toDerived();
    const derivedExternal = external.toDerived();

    return derivedExternal.divide(derivedNative);
  });

  const aPerBRatioMessage = computed(() => {
    if (!aPerBRatio) {
      return "N/A";
    }

    return format(aPerBRatio, { mantissa: 8 });
  });

  // native_balance / external_balance
  const bPerARatio = computed(() => {
    if (!poolAmounts) return 0;
    const [native, external] = poolAmounts;

    const derivedNative = native.toDerived();
    const derivedExternal = external.toDerived();

    return derivedNative.divide(derivedExternal);
  });

  const bPerARatioMessage = computed(() => {
    if (!bPerARatio) {
      return "N/A";
    }

    return format(bPerARatio, { mantissa: 8 });
  });

  // Price Impact and Pool Share:
  // (external_balance + external_added) / (native_balance + native_added)
  const aPerBRatioProjected = computed(() => {
    if (!poolAmounts || !tokenAField.fieldAmount || !tokenBField.fieldAmount)
      return null;

    const [native, external] = poolAmounts;
    const derivedNative = native.toDerived();
    const derivedExternal = external.toDerived();
    const externalAdded = tokenAField.fieldAmount.toDerived();
    const nativeAdded = tokenBField.fieldAmount.toDerived();

    return derivedExternal
      .add(externalAdded)
      .divide(derivedNative.add(nativeAdded));
  });

  const aPerBRatioProjectedMessage = computed(() => {
    if (!aPerBRatioProjected) {
      return "N/A";
    }

    return format(aPerBRatioProjected, { mantissa: 8 });
  });

  // Price Impact and Pool Share:
  // (native_balance + native_added)/(external_balance + external_added)
  const bPerARatioProjected = computed(() => {
    if (!poolAmounts || !tokenAField.fieldAmount || !tokenBField.fieldAmount)
      return null;

    const [native, external] = poolAmounts;
    const derivedNative = native.toDerived();
    const derivedExternal = external.toDerived();
    const externalAdded = tokenAField.fieldAmount.toDerived();
    const nativeAdded = tokenBField.fieldAmount.toDerived();
    return derivedNative
      .add(nativeAdded)
      .divide(derivedExternal.add(externalAdded));
  });

  const bPerARatioProjectedMessage = computed(() => {
    if (!bPerARatioProjected) {
      return "N/A";
    }

    return format(bPerARatioProjected, { mantissa: 8 });
  });

  computed(() => {
    // if in guided mode
    // calculate the price ratio of A / B
    // Only activates when it is a preexisting pool
    if (
      assetA &&
      assetB &&
      input.guidedMode &&
      preExistingPool &&
      input.lastFocusedTokenField !== null
    ) {
      if (bPerARatio === null || aPerBRatio === null || !assetA || !assetB) {
        return null;
      }
      const assetAmountA = AssetAmount(assetA, tokenAField.fieldAmount || "0");
      const assetAmountB = AssetAmount(assetB, tokenBField.fieldAmount || "0");
      if (input.lastFocusedTokenField === "A") {
        input.setTokenBAmount(
          format(assetAmountA.toDerived().multiply(bPerARatio || "0"), {
            mantissa: 5,
          }),
        );
      } else if (input.lastFocusedTokenField === "B") {
        input.setTokenAAmount(
          format(assetAmountB.toDerived().multiply(aPerBRatio || "0"), {
            mantissa: 5,
          }),
        );
      }
    }
  });

  const state = computed(() => {
    // Select Tokens
    const aSymbolNotSelected = !input.tokenASymbol;
    const bSymbolNotSelected = !input.tokenBSymbol;
    if (aSymbolNotSelected || bSymbolNotSelected) {
      return PoolState.SELECT_TOKENS;
    }

    // Zero amounts
    const aAmount = tokenAField.fieldAmount;
    const bAmount = tokenBField.fieldAmount;
    const aAmountIsZeroOrFalsy = !aAmount || aAmount.equalTo("0");
    const bAmountIsZeroOrFalsy = !bAmount || bAmount.equalTo("0");

    if (!preExistingPool && (aAmountIsZeroOrFalsy || bAmountIsZeroOrFalsy)) {
      return PoolState.ZERO_AMOUNTS_NEW_POOL;
    }

    if (aAmountIsZeroOrFalsy && bAmountIsZeroOrFalsy) {
      return PoolState.ZERO_AMOUNTS;
    }

    // Insufficient Funds
    if (fromBalanceOverdrawn || toBalanceOverdrawn) {
      return PoolState.INSUFFICIENT_FUNDS;
    }

    // Valid yay!
    return PoolState.VALID_INPUT;
  });

  return {
    state,
    aPerBRatioMessage,
    bPerARatioMessage,
    aPerBRatioProjectedMessage,
    bPerARatioProjectedMessage,
    shareOfPool,
    shareOfPoolPercent,
    preExistingPool,
    totalLiquidityProviderUnits,
    totalPoolUnits,
    poolAmounts,
    tokenAFieldAmount: tokenAField.fieldAmount,
    tokenBFieldAmount: tokenBField.fieldAmount,
  };
}
