"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LM_STORAGE_KEY = exports.VS_STORAGE_KEY = exports.BLOCK_TIME_MS = void 0;
const claim_1 = require("./claim");
exports.BLOCK_TIME_MS = 1000 * 60 * 200;
exports.VS_STORAGE_KEY = "NOTIFIED_VS_STORAGE";
exports.LM_STORAGE_KEY = "NOTIFIED_LM_STORAGE";
function rewardActions({ services, store, }) {
    function hasUserReachedMaturity(userData) {
        var _a, _b, _c;
        if (!userData)
            return false;
        return (((_a = userData === null || userData === void 0 ? void 0 : userData.user) === null || _a === void 0 ? void 0 : _a.maturityDate) != null &&
            new Date() > ((_b = userData === null || userData === void 0 ? void 0 : userData.user) === null || _b === void 0 ? void 0 : _b.maturityDate) &&
            ((_c = userData === null || userData === void 0 ? void 0 : userData.user) === null || _c === void 0 ? void 0 : _c.totalClaimableCommissionsAndClaimableRewards) > 0);
    }
    return {
        subscribeToRewardData(rewardType) {
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
            return () => { };
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
            return () => { };
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
            return () => { };
        },
        claim: claim_1.Claim(services),
    };
}
exports.default = rewardActions;
//# sourceMappingURL=index.js.map