import { ref, Ref, effect } from "@vue/reactivity";
import {
  Amount,
  Asset,
  AssetAmount,
  IAssetAmount,
  LiquidityProvider,
  Pool,
} from "../../../entities";
import { IAmount } from "../../../entities/Amount";
import { akasha } from "../../../test/utils/accounts";
import { getTestingTokens } from "../../../test/utils/getTestingToken";
import { PoolState, usePoolCalculator } from "./addLiquidityCalculator";

const [ATK, ROWAN, CTEST] = getTestingTokens(["ATK", "ROWAN", "CTEST"]);

const ZERO = Amount("0");

describe("addLiquidityCalculator", () => {
  // input
  const tokenAAmount: Ref<string> = ref("0");
  const tokenASymbol: Ref<string | null> = ref(null);
  const tokenBAmount: Ref<string> = ref("0");
  const tokenBSymbol: Ref<string | null> = ref(null);
  const guidedMode: Ref<boolean> = ref(false);
  const lastFocusedTokenField: Ref<"A" | "B" | null> = ref(null);
  const balances = ref([]) as Ref<IAssetAmount[]>;
  const selectedField: Ref<"from" | "to" | null> = ref("from");
  const poolFinder = jest.fn<Pool | null, any>(() => null);
  const setTokenAAmount = jest.fn();
  const setTokenBAmount = jest.fn();

  // output
  let aPerBRatioMessage: Ref<string> = ref("");
  let bPerARatioMessage: Ref<string> = ref("");
  let shareOfPool: Ref<IAmount> = ref(Amount("0"));
  let aPerBRatioProjectedMessage: Ref<string> = ref("");
  let bPerARatioProjectedMessage: Ref<string> = ref("");
  let totalLiquidityProviderUnits: Ref<string> = ref("");
  let totalPoolUnits: Ref<string> = ref("");
  let shareOfPoolPercent: Ref<string> = ref("");
  let state: Ref<PoolState> = ref(PoolState.SELECT_TOKENS);
  let liquidityProvider = ref(
    LiquidityProvider(ATK, ZERO, akasha.address, ZERO, ZERO),
  ) as Ref<LiquidityProvider | null>; // ? not sure why we need to cast

  beforeEach(() => {
    setTokenAAmount.mockReset();
    setTokenBAmount.mockReset();

    effect(() => {
      const vals = usePoolCalculator({
        balances: balances.value,
        tokenAAmount: tokenAAmount.value,
        tokenBAmount: tokenBAmount.value,
        tokenASymbol: tokenASymbol.value,
        tokenBSymbol: tokenBSymbol.value,
        guidedMode: guidedMode.value,
        lastFocusedTokenField: lastFocusedTokenField.value,
        poolFinder,
        liquidityProvider: liquidityProvider.value,
        setTokenAAmount,
        setTokenBAmount,
      });

      state.value = vals.state;
      aPerBRatioMessage.value = vals.aPerBRatioMessage;
      bPerARatioMessage.value = vals.bPerARatioMessage;
      shareOfPool.value = vals.shareOfPool;
      shareOfPoolPercent.value = vals.shareOfPoolPercent;
      totalLiquidityProviderUnits.value = vals.totalLiquidityProviderUnits;
      totalPoolUnits.value = vals.totalPoolUnits;
      aPerBRatioProjectedMessage.value = vals.aPerBRatioProjectedMessage;
      bPerARatioProjectedMessage.value = vals.bPerARatioProjectedMessage;
    });

    balances.value = [];
    guidedMode.value = false;
    lastFocusedTokenField.value = null;
    selectedField.value = "from";
    tokenAAmount.value = "0";
    tokenASymbol.value = null;
    tokenBAmount.value = "0";
    tokenBSymbol.value = null;
  });

  afterEach(() => {
    poolFinder.mockReset();
    liquidityProvider.value = null;
  });
  type TestShape = {
    only?: boolean;
    skip?: boolean;
    poolExternal: string;
    poolNative: string;
    guided: boolean;
    poolUnits: string;
    addedExternal: string;
    addedNative: string;
    externalSymbol: string;
    nativeSymbol: string;
    lastFocused?: "A" | "B";
    preexistingLiquidity?: {
      native: string;
      external: string;
      units: string;
    };
    expected: {
      aPerBRatioMessage: string;
      bPerARatioMessage: string;
      aPerBRatioProjectedMessage: string;
      bPerARatioProjectedMessage: string;
      shareOfPool: string;
      state: PoolState;
      setTokenAAmountValue?: string;
      setTokenBAmountValue?: string;
    };
  };
  const ratios: TestShape[] = [
    {
      only: false,
      skip: false,
      poolExternal: "1000000000000000000000000000",
      poolNative: "1000000000000000000000000000",
      guided: false,
      poolUnits: "1000000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "10000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      preexistingLiquidity: {
        native: "0",
        external: "0",
        units: "0",
      },
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "0.99%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "1000000000000000000000000000",
      poolNative: "1000000000000000000000000000",
      guided: false,
      poolUnits: "1000000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "10000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      preexistingLiquidity: {
        native: "500000000000000000000000000",
        external: "500000000000000000000000000",
        units: "500000000000000000000000000",
      },
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "50.50%",
        state: PoolState.VALID_INPUT,
      },
    },
    // Test for small decimals coin
    {
      poolExternal: "1000000000000000",
      poolNative: "1000000000000000000000000000",
      guided: false,
      poolUnits: "1000000000000000000000000000",
      addedExternal: "10000",
      addedNative: "10000",
      externalSymbol: "ctest",
      nativeSymbol: "rowan",
      preexistingLiquidity: {
        native: "0",
        external: "0",
        units: "0",
      },
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "< 0.01%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "1000000000000000000000000000",
      poolNative: "1000000000000000000000000000",
      guided: false,
      poolUnits: "1000000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "10000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      preexistingLiquidity: {
        native: "1000000000000000000000000000",
        external: "1000000000000000000000000000",
        units: "1000000000000000000000000000",
      },
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "100.00%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "1000000000000000000000000000",
      poolNative: "1000000000000000000000000000",
      guided: false,
      poolUnits: "1000000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "10000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "0.99%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "20000000000000000000000000",
      poolNative: "10000000000000000000000000",
      guided: false,
      poolUnits: "20000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "40000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "2.00000000",
        bPerARatioMessage: "0.50000000",
        aPerBRatioProjectedMessage: "0.60000000",
        bPerARatioProjectedMessage: "1.66666667",
        shareOfPool: "54.55%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "40000000000000000000000000",
      poolNative: "10000000000000000000000000",
      guided: false,
      poolUnits: "40000000000000000000000000",
      addedExternal: "10000000",
      addedNative: "40000000",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "4.00000000",
        bPerARatioMessage: "0.25000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "45.95%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "100000000000000000000000000",
      poolNative: "100000000000000000000000000",
      guided: false,
      poolUnits: "10000000000000000000000000000000000000000000",
      addedExternal: "100000000000",
      addedNative: "1",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "1.00000000", // 100000000 / 100000000
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1000.99998999", // 100100000000/100000001
        bPerARatioProjectedMessage: "0.00099900",
        shareOfPool: "33.31%",
        state: PoolState.VALID_INPUT,
      },
    },
    {
      poolExternal: "100000000000000000000000000",
      poolNative: "100000000000000000000000000",
      guided: false,
      poolUnits: "10000000000000000000000000000000000000000000",
      addedExternal: "100000000000000", // more than balance
      addedNative: "1",
      externalSymbol: "atk",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "1.00000000", // 100000000 / 100000000
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1000000.98999999", // 100100000000/100000001
        bPerARatioProjectedMessage: "0.00000100",
        shareOfPool: "33.55%",
        state: PoolState.INSUFFICIENT_FUNDS,
      },
    },
    {
      // only: true,
      poolExternal: "100000000000000000000000000",
      poolNative: "100000000000000000000000000",
      guided: true,
      poolUnits: "10000000000000000000000000000000000000000000",
      addedExternal: "100000000000",
      addedNative: "100000000000",
      externalSymbol: "atk",
      lastFocused: "A",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "1.00000000",
        bPerARatioMessage: "1.00000000",
        aPerBRatioProjectedMessage: "1.00000000",
        bPerARatioProjectedMessage: "1.00000000",
        shareOfPool: "99.90%",
        state: PoolState.VALID_INPUT,
        setTokenBAmountValue: "100000000000.00000",
      },
    },
    {
      poolExternal: "50000000000000000000000000",
      poolNative: "100000000000000000000000000",
      guided: true,
      poolUnits: "10000000000000000000000000000000000000000000",
      addedExternal: "100000000000",
      addedNative: "100000000000",
      externalSymbol: "atk",
      lastFocused: "A",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "0.50000000",
        bPerARatioMessage: "2.00000000",
        aPerBRatioProjectedMessage: "0.99950050",
        bPerARatioProjectedMessage: "1.00049975",
        shareOfPool: "99.93%",
        state: PoolState.VALID_INPUT,
        setTokenBAmountValue: "200000000000.00000",
      },
    },
    {
      poolExternal: "50000000000000000000000000",
      poolNative: "100000000000000000000000000",
      guided: true,
      poolUnits: "10000000000000000000000000000000000000000000",
      addedExternal: "100000000000",
      addedNative: "100000000000",
      externalSymbol: "atk",
      lastFocused: "B",
      nativeSymbol: "rowan",
      expected: {
        aPerBRatioMessage: "0.50000000",
        bPerARatioMessage: "2.00000000",
        aPerBRatioProjectedMessage: "0.99950050",
        bPerARatioProjectedMessage: "1.00049975",
        shareOfPool: "99.93%",
        state: PoolState.VALID_INPUT,
        setTokenAAmountValue: "50000000000.00000",
      },
    },
  ];
  describe("ratios", () => {
    ratios.forEach(
      (
        {
          only = false,
          skip = false,
          poolExternal,
          poolNative,
          poolUnits,
          addedExternal,
          addedNative,
          guided,
          lastFocused = null,
          externalSymbol,
          nativeSymbol,
          preexistingLiquidity,
          expected,
        },
        index,
      ) => {
        const tester = only ? test.only : skip ? test.skip : test;
        tester(`Ratios #${index + 1}`, () => {
          balances.value = [
            AssetAmount(ATK, "100000000000000000000000000000"),
            AssetAmount(ROWAN, "100000000000000000000000000000"),
            AssetAmount(CTEST, "100000000000000000000000000000"),
          ];
          liquidityProvider.value = !preexistingLiquidity
            ? null
            : LiquidityProvider(
                ATK,
                Amount(preexistingLiquidity.units),
                akasha.address,
                Amount(preexistingLiquidity.native),
                Amount(preexistingLiquidity.external),
              );

          poolFinder.mockImplementation(() => {
            const pool = Pool(
              AssetAmount(ROWAN, poolNative),
              AssetAmount(Asset.get(externalSymbol), poolExternal),
              Amount(poolUnits),
            );

            return pool;
          });
          tokenAAmount.value = addedExternal;
          tokenBAmount.value = addedNative;
          tokenASymbol.value = externalSymbol;
          tokenBSymbol.value = nativeSymbol;
          lastFocusedTokenField.value = lastFocused;
          guidedMode.value = guided;

          expect(aPerBRatioMessage.value).toBe(expected.aPerBRatioMessage);
          expect(bPerARatioMessage.value).toBe(expected.bPerARatioMessage);
          expect(aPerBRatioProjectedMessage.value).toBe(
            expected.aPerBRatioProjectedMessage,
          );
          expect(bPerARatioProjectedMessage.value).toBe(
            expected.bPerARatioProjectedMessage,
          );
          expect(shareOfPoolPercent.value).toBe(expected.shareOfPool);
          expect(state.value).toBe(expected.state);
          if (expected.setTokenAAmountValue) {
            expect(setTokenAAmount).toBeCalledWith(
              expected.setTokenAAmountValue,
            );
          } else {
            expect(setTokenAAmount).not.toBeCalled();
          }
          if (expected.setTokenBAmountValue) {
            expect(setTokenBAmount).toBeCalledWith(
              expected.setTokenBAmountValue,
            );
          } else {
            expect(setTokenBAmount).not.toBeCalled();
          }
        });
      },
    );
  });

  test("poolCalculator ratio messages", () => {
    poolFinder.mockImplementation(() =>
      Pool(
        AssetAmount(ATK, "2000000000000000000000000"),
        AssetAmount(ROWAN, "1000000000000000000000000"),
      ),
    );

    tokenAAmount.value = "100000";
    tokenBAmount.value = "500000";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(aPerBRatioMessage.value).toBe("2.00000000");
    expect(bPerARatioMessage.value).toBe("0.50000000");
    expect(aPerBRatioProjectedMessage.value).toBe("1.40000000");
    expect(bPerARatioProjectedMessage.value).toBe("0.71428571");
    expect(shareOfPoolPercent.value).toBe("13.49%");
  });

  test("poolCalculator with preexisting pool", () => {
    // Pool exists with 1001000 preexisting units 1000 of which are owned by this lp
    poolFinder.mockImplementation(() =>
      Pool(
        AssetAmount(ATK, "1000000000000000000000000"),
        AssetAmount(ROWAN, "1000000000000000000000000"),
        Amount("1000000000000000000000000"),
      ),
    );

    // Liquidity provider already owns 1000 pool units (1000000 from another investor)
    liquidityProvider.value = LiquidityProvider(
      ATK,
      Amount("500000000000000000000000"),
      akasha.address,
      Amount("500000000000000000000000"),
      Amount("500000000000000000000000"),
    );

    // Add 1000 of both tokens
    tokenAAmount.value = "500000";
    tokenBAmount.value = "500000";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(aPerBRatioMessage.value).toBe("1.00000000");
    expect(bPerARatioMessage.value).toBe("1.00000000");
    expect(aPerBRatioProjectedMessage.value).toBe("1.00000000");
    expect(bPerARatioProjectedMessage.value).toBe("1.00000000");
    // New shareOfPoolPercent for liquidity provider (inc prev liquidity)
    //2000/1002000 = 0.001996007984031936 so roughtly 0.2%
    expect(shareOfPoolPercent.value).toBe("66.67%");

    // New pool units for liquidity provider (inc prev liquidity)
    expect(totalLiquidityProviderUnits.value).toBe("1000000000000000000000000");

    expect(totalPoolUnits.value).toBe("1500000000000000000000000");
  });

  test("poolCalculator with preexisting pool but no preexisting liquidity", () => {
    // Pool exists with 1001000 preexisting units 1000 of which are owned by this lp
    poolFinder.mockImplementation(() =>
      Pool(
        AssetAmount(ATK, "1000000000000000000000000"),
        AssetAmount(ROWAN, "1000000000000000000000000"),
        Amount("1000000000000000000000000"),
      ),
    );

    // Liquidity provider is null
    liquidityProvider.value = null;

    // Add 1000 of both tokens
    tokenAAmount.value = "500000";
    tokenBAmount.value = "500000";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(aPerBRatioMessage.value).toBe("1.00000000");
    expect(bPerARatioMessage.value).toBe("1.00000000");
    expect(aPerBRatioProjectedMessage.value).toBe("1.00000000");
    expect(bPerARatioProjectedMessage.value).toBe("1.00000000");

    // New shareOfPoolPercent for liquidity provider (inc prev liquidity)
    //2000/1002000 = 0.001996007984031936 so roughtly 0.2%
    expect(shareOfPoolPercent.value).toBe("33.33%");

    // New pool units for liquidity provider (inc prev liquidity)
    expect(totalLiquidityProviderUnits.value).toBe("500000000000000000000000");

    expect(totalPoolUnits.value).toBe("1500000000000000000000000");
  });

  test("Can handle division by zero", () => {
    liquidityProvider.value = LiquidityProvider(ATK, ZERO, "", ZERO, ZERO);
    tokenAAmount.value = "0";
    tokenBAmount.value = "0";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.ZERO_AMOUNTS_NEW_POOL);
    expect(aPerBRatioMessage.value).toBe("N/A");
    expect(bPerARatioMessage.value).toBe("N/A");
    expect(aPerBRatioProjectedMessage.value).toBe("N/A");
    expect(bPerARatioProjectedMessage.value).toBe("N/A");
    expect(shareOfPoolPercent.value).toBe("< 0.01%");
  });

  test("Don't allow rowan === 0 when creating new pool", () => {
    tokenAAmount.value = "1000";
    tokenBAmount.value = "0";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.ZERO_AMOUNTS_NEW_POOL);
    expect(aPerBRatioMessage.value).toBe("N/A");
    expect(bPerARatioMessage.value).toBe("N/A");
    expect(aPerBRatioProjectedMessage.value).toBe("N/A");
    expect(bPerARatioProjectedMessage.value).toBe("N/A");
  });

  test("Don't allow external token === 0 when creating new pool", () => {
    tokenAAmount.value = "0";
    tokenBAmount.value = "1000";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.ZERO_AMOUNTS_NEW_POOL);
    expect(aPerBRatioMessage.value).toBe("N/A");
    expect(bPerARatioMessage.value).toBe("N/A");
    expect(aPerBRatioProjectedMessage.value).toBe("N/A");
    expect(bPerARatioProjectedMessage.value).toBe("N/A");
  });

  test("Allow rowan === 0 when adding to preExistingPool", () => {
    balances.value = [
      AssetAmount(ATK, "1000000000000000000000"),
      AssetAmount(ROWAN, "1000000000000000000000"),
    ];
    poolFinder.mockImplementation(() =>
      Pool(
        AssetAmount(ATK, "1000000000000000000000000"),
        AssetAmount(ROWAN, "1000000000000000000000000"),
      ),
    );
    tokenAAmount.value = "1000";
    tokenBAmount.value = "0";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.VALID_INPUT);
    expect(aPerBRatioMessage.value).toBe("1.00000000");
    expect(bPerARatioMessage.value).toBe("1.00000000");
    expect(aPerBRatioProjectedMessage.value).toBe("1.00100000");
    expect(bPerARatioProjectedMessage.value).toBe("0.99900100");
  });

  test("Allow external token === 0 when adding to preExistingPool", () => {
    balances.value = [
      AssetAmount(ATK, "1000000000000000000000"),
      AssetAmount(ROWAN, "1000000000000000000000"),
    ];
    poolFinder.mockImplementation(() =>
      Pool(
        AssetAmount(ATK, "1000000000000000000000000"),
        AssetAmount(ROWAN, "1000000000000000000000000"),
      ),
    );
    tokenAAmount.value = "0";
    tokenBAmount.value = "1000";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.VALID_INPUT);
    expect(aPerBRatioMessage.value).toBe("1.00000000");
    expect(bPerARatioMessage.value).toBe("1.00000000");
    expect(aPerBRatioProjectedMessage.value).toBe("0.99900100");
    expect(bPerARatioProjectedMessage.value).toBe("1.00100000");
  });

  test("insufficient funds", () => {
    balances.value = [
      AssetAmount(ATK, "100000000000000000000"),
      AssetAmount(ROWAN, "100000000000000000000"),
    ];
    tokenAAmount.value = "1000";
    tokenBAmount.value = "500";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(state.value).toBe(PoolState.INSUFFICIENT_FUNDS);
  });

  test("valid funds below limit", () => {
    balances.value = [
      AssetAmount(ATK, "1000000000000000000000"),
      AssetAmount(ROWAN, "500000000000000000000"),
    ];
    tokenAAmount.value = "999";
    tokenBAmount.value = "499";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";
    expect(state.value).toBe(PoolState.VALID_INPUT);
  });

  test("valid funds at limit", () => {
    balances.value = [
      AssetAmount(ATK, "1000000000000000000000"),
      AssetAmount(ROWAN, "500000000000000000000"),
    ];
    tokenAAmount.value = "1000";
    tokenBAmount.value = "500";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(state.value).toBe(PoolState.VALID_INPUT);
  });

  test("invalid funds above limit", () => {
    balances.value = [AssetAmount(ATK, "1000"), AssetAmount(ROWAN, "500")];
    tokenAAmount.value = "1001";
    tokenBAmount.value = "501";
    tokenASymbol.value = "atk";
    tokenBSymbol.value = "rowan";

    expect(state.value).toBe(PoolState.INSUFFICIENT_FUNDS);
  });
});
