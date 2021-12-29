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
const sleep_1 = require("../../test/utils/sleep");
let numChecks = 0;
// Detect mossible keplr provider from browser
function getKeplrProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        const window = globalThis.window || global;
        if (typeof window === "undefined")
            return null;
        const win = window;
        if (!win) {
            console.log("window not found", win);
            return null;
        }
        if (!win.keplr || !win.getOfflineSigner) {
            numChecks++;
            if (numChecks > 1000) {
                console.warn(`keplr not found`);
                return null;
            }
            yield sleep_1.sleep(100);
            return getKeplrProvider();
        }
        numChecks = 0;
        return win.keplr;
    });
}
exports.default = getKeplrProvider;
//# sourceMappingURL=getKeplrProvider.js.map