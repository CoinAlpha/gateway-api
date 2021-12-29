import { Ref } from "@vue/reactivity";
import { Store } from ".";
import { Asset, Pool } from "../entities";
import { AccountPool } from "./pools";
declare type PoolFinderFn = (s: Store) => (a: Asset | string, b: Asset | string) => Ref<Pool> | null;
declare type AccountPoolFinderFn = (s: Store) => (a: Asset | string, b: Asset | string) => Ref<AccountPool> | null;
export declare const createPoolFinder: PoolFinderFn;
export declare const createAccountPoolFinder: AccountPoolFinderFn;
export {};
