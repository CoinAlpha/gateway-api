import { Ref, toRefs } from "@vue/reactivity";
import { Store } from ".";
import { Asset, Pool, Network } from "../entities";
import { AccountPool } from "./pools";
import { createPoolKey } from "../utils/pool";

type PoolFinderFn = (
  s: Store,
) => (a: Asset | string, b: Asset | string) => Ref<Pool> | null;

type AccountPoolFinderFn = (
  s: Store,
) => (a: Asset | string, b: Asset | string) => Ref<AccountPool> | null;

export const createPoolFinder: PoolFinderFn = (s: Store) => (
  a: Asset | string,
  b: Asset | string,
) => {
  if (typeof a === "string") a = Asset.get(a);
  if (typeof b === "string") b = Asset.get(b);

  const pools = toRefs(s.pools);

  const key = createPoolKey(a, b);

  const poolRef = pools[key] as Ref<Pool> | undefined;
  return poolRef ?? null;
};

export const createAccountPoolFinder: AccountPoolFinderFn = (s: Store) => (
  a: Asset | string,
  b: Asset | string,
) => {
  if (typeof a === "string") a = Asset.get(a);
  if (typeof b === "string") b = Asset.get(b);

  const accountpools = toRefs(
    s.accountpools[s.wallet.get(Network.SIFCHAIN).address] || {},
  );
  const key = createPoolKey(a, b);

  const accountPoolRef = accountpools[key] as Ref<AccountPool> | undefined;
  return accountPoolRef ?? null;
};
