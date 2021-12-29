"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCookies = void 0;
const js_cookie_1 = __importDefault(require("js-cookie"));
const COOKIE_NAME_SIF_ENV = "__sif_env";
/**
 * DSL for managing app cookies. Eventually any cookies set by the
 * app should be set here using App types.
 * @param service cookie service
 * @returns app cookie manager
 */
function AppCookies(service = js_cookie_1.default) {
    return {
        getEnv() {
            return service.get(COOKIE_NAME_SIF_ENV);
        },
        setEnv(env) {
            service.set(COOKIE_NAME_SIF_ENV, env.toString());
        },
        clearEnv() {
            service.remove(COOKIE_NAME_SIF_ENV);
        },
    };
}
exports.AppCookies = AppCookies;
//# sourceMappingURL=AppCookies.js.map