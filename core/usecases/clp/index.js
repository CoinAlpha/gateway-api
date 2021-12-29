"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const swap_1 = require("./swap");
const addLiquidity_1 = require("./addLiquidity");
const removeLiquidity_1 = require("./removeLiquidity");
const syncPools_1 = require("./syncPools");
const PUBLIC_POOLS_POLL_DELAY = 60 * 1000;
const USER_POOLS_POLL_DELAY = 300 * 1000;
exports.default = ({ services, store, }) => {
    const syncPools = syncPools_1.SyncPools(services, store);
    return {
        swap: swap_1.Swap(services),
        addLiquidity: addLiquidity_1.AddLiquidity(services, store),
        removeLiquidity: removeLiquidity_1.RemoveLiquidity(services),
        syncPools,
        subscribeToPublicPools: (delay = PUBLIC_POOLS_POLL_DELAY) => {
            let timeoutId;
            (function publicPoolsLoop() {
                return __awaiter(this, void 0, void 0, function* () {
                    timeoutId = setTimeout(run, delay);
                    function run() {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield syncPools.syncPublicPools();
                            }
                            catch (error) {
                                console.log("Sync pools error", error);
                            }
                            finally {
                                publicPoolsLoop();
                            }
                        });
                    }
                });
            })();
            return () => clearTimeout(timeoutId);
        },
        subscribeToUserPools: (address, delay = USER_POOLS_POLL_DELAY) => {
            let timeoutId;
            (function userPoolsLoop() {
                return __awaiter(this, void 0, void 0, function* () {
                    timeoutId = setTimeout(run, delay);
                    function run() {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield syncPools.syncUserPools(address);
                            }
                            catch (error) {
                                console.log("Sync pools error", error);
                            }
                            finally {
                                userPoolsLoop();
                            }
                        });
                    }
                });
            })();
            return () => clearTimeout(timeoutId);
        },
    };
};
//# sourceMappingURL=index.js.map