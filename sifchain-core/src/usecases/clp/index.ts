import { UsecaseContext } from "..";
import { effect, ReactiveEffect, stop } from "@vue/reactivity";
import { Swap } from "./swap";
import { AddLiquidity } from "./addLiquidity";
import { RemoveLiquidity } from "./removeLiquidity";
import { SyncPools } from "./syncPools";
import { Network } from "../../entities";

const PUBLIC_POOLS_POLL_DELAY = 60 * 1000;
const USER_POOLS_POLL_DELAY = 300 * 1000;

export default ({
  services,
  store,
}: UsecaseContext<
  "sif" | "clp" | "bus" | "ibc" | "chains" | "tokenRegistry" | "wallet",
  "pools" | "wallet" | "accountpools"
>) => {
  const syncPools = SyncPools(services, store);

  return {
    swap: Swap(services),
    addLiquidity: AddLiquidity(services, store),
    removeLiquidity: RemoveLiquidity(services),
    syncPools,
    subscribeToPublicPools: (delay: number = PUBLIC_POOLS_POLL_DELAY) => {
      let timeoutId: NodeJS.Timeout;
      (async function publicPoolsLoop() {
        timeoutId = setTimeout(run, delay);
        async function run() {
          try {
            await syncPools.syncPublicPools();
          } catch (error) {
            console.log("Sync pools error", error);
          } finally {
            publicPoolsLoop();
          }
        }
      })();
      return () => clearTimeout(timeoutId);
    },
    subscribeToUserPools: (
      address: string,
      delay: number = USER_POOLS_POLL_DELAY,
    ) => {
      let timeoutId: NodeJS.Timeout;
      (async function userPoolsLoop() {
        timeoutId = setTimeout(run, delay);
        async function run() {
          try {
            await syncPools.syncUserPools(address);
          } catch (error) {
            console.log("Sync pools error", error);
          } finally {
            userPoolsLoop();
          }
        }
      })();
      return () => clearTimeout(timeoutId);
    },
  };
};
