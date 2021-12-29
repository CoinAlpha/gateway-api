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
function createCryptoeconomicsService(config) {
    function fetchData(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            params.set("address", props.address);
            params.set("key", props.key || "userData");
            params.set("timestamp", props.timestamp || "now");
            if (props.rewardProgram) {
                params.set("program", props.rewardProgram);
            }
            props.snapShotSource
                ? params.set("snapshot-source", props.snapShotSource)
                : null;
            const res = yield fetch(`https://api-cryptoeconomics${props.devnet ? "-devnet" : ""}.sifchain.finance/api/${props.rewardType}?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch cryptoeconomics data");
            }
            else {
                const json = yield res.json();
                if ((_a = json.user) === null || _a === void 0 ? void 0 : _a.maturityDateISO) {
                    json.user.maturityDate = new Date(json.user.maturityDateISO);
                }
                return json;
            }
        });
    }
    return {
        fetchData,
        getAddressLink: (address, rewardType) => {
            return `https://cryptoeconomics.sifchain.finance/#${address}&type=${rewardType}`;
        },
        fetchSummaryAPY({ rewardProgram, devnet = false, }) {
            return __awaiter(this, void 0, void 0, function* () {
                const summaryAPY = yield fetch(`https://api-cryptoeconomics${devnet ? "-devnet" : ""}.sifchain.finance/api/lm?key=apy-summary&program=${rewardProgram || ""}`)
                    .then((r) => r.json())
                    .then((r) => r.summaryAPY);
                return summaryAPY;
            });
        },
        fetchVsData: (options) => fetchData(Object.assign(Object.assign({}, options), { rewardType: "vs" })),
        fetchLmData: (options) => fetchData(Object.assign(Object.assign({}, options), { rewardType: "lm" })),
        fetchTimeseriesData: (props) => __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchData({
                address: props.address,
                rewardType: "lm",
                key: "userTimeSeriesData",
                devnet: props.devnet,
            });
            return data;
        }),
    };
}
exports.default = createCryptoeconomicsService;
//# sourceMappingURL=CryptoeconomicsService.js.map