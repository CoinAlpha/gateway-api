import { UsecaseContext } from "..";
import {
  CryptoeconomicsRewardType,
  CryptoeconomicsUserData,
} from "../../services/CryptoeconomicsService";
import { Claim } from "./claim";
import { Network } from "../../entities";
import { Services } from "services";

export const BLOCK_TIME_MS = 1000 * 60 * 200;

export const VS_STORAGE_KEY = "NOTIFIED_VS_STORAGE";
export const LM_STORAGE_KEY = "NOTIFIED_LM_STORAGE";

export default function rewardActions({
  services,
  store,
}: UsecaseContext<keyof Services, "wallet">) {
  function hasUserReachedMaturity(userData: CryptoeconomicsUserData) {
    if (!userData) return false;

    return (
      userData?.user?.maturityDate != null &&
      new Date() > userData?.user?.maturityDate &&
      userData?.user?.totalClaimableCommissionsAndClaimableRewards > 0
    );
  }

  return {
    subscribeToRewardData(rewardType: CryptoeconomicsRewardType) {
      // const key = rewardType === "vs" ? "vsUserData" : "lmUserData";
      // let intervalId: NodeJS.Timeout;

      // if (store.wallet.get(Network.SIFCHAIN).address) {
      //   const update = async () => {
      //     store.wallet.get(Network.SIFCHAIN).key] = await services.cryptoeconomics.fetchData({
      //       rewardType,
      //       address: store.wallet.get(Network.SIFCHAIN).address,
      //       key: "userData",
      //       timestamp: "now",
      //     });
      //   };
      //   update();
      //   intervalId = setInterval(update, BLOCK_TIME_MS);
      // }
      // return () => clearInterval(intervalId);
      return () => {};
    },

    notifyLmMaturity() {
      // if (
      //   store.wallet.get(Network.SIFCHAIN).lmUserData &&
      //   hasUserReachedMaturity(store.wallet.get(Network.SIFCHAIN).lmUserData) &&
      //   !services.storage.getItem(LM_STORAGE_KEY)
      // ) {
      //   services.bus.dispatch({
      //     type: "SuccessEvent",
      //     payload: {
      //       message:
      //         "Your liquidity mining rewards have reached full maturity!",
      //       detail: {
      //         type: "info",
      //         message:
      //           "Please feel free to claim these rewards. If you have already submitted a claim, these will be processed at week end.",
      //       },
      //     },
      //   });
      //   services.storage.setItem(LM_STORAGE_KEY, "true");
      // }
      return () => {};
    },

    notifyVsMaturity() {
      // if (
      //   store.wallet.get(Network.SIFCHAIN).vsUserData &&
      //   hasUserReachedMaturity(store.wallet.get(Network.SIFCHAIN).vsUserData) &&
      //   !services.storage.getItem(VS_STORAGE_KEY)
      // ) {
      //   services.bus.dispatch({
      //     type: "SuccessEvent",
      //     payload: {
      //       message:
      //         "Your validator staking rewards have reached full maturity!",
      //       detail: {
      //         type: "info",
      //         message:
      //           "Please feel free to claim these rewards. If you have already submitted a claim, these will be processed at week end.",
      //       },
      //     },
      //   });
      //   services.storage.setItem(VS_STORAGE_KEY, "true");
      // }
      return () => {};
    },
    claim: Claim(services),
  };
}
