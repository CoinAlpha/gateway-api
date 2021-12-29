import Cookies from "js-cookie";
import { NetworkEnv } from "./getEnv";
declare type CookieService = Pick<typeof Cookies, "set" | "get" | "remove">;
/**
 * DSL for managing app cookies. Eventually any cookies set by the
 * app should be set here using App types.
 * @param service cookie service
 * @returns app cookie manager
 */
export declare function AppCookies(service?: CookieService): {
    getEnv(): NetworkEnv | undefined;
    setEnv(env: NetworkEnv): void;
    clearEnv(): void;
};
export declare type AppCookies = ReturnType<typeof AppCookies>;
export {};
