import Cookies from "js-cookie";
import { NetworkEnv } from "./getEnv";
type CookieService = Pick<typeof Cookies, "set" | "get" | "remove">;

const COOKIE_NAME_SIF_ENV = "__sif_env";

/**
 * DSL for managing app cookies. Eventually any cookies set by the
 * app should be set here using App types.
 * @param service cookie service
 * @returns app cookie manager
 */
export function AppCookies(service: CookieService = Cookies) {
  return {
    getEnv() {
      return service.get(COOKIE_NAME_SIF_ENV) as NetworkEnv | undefined;
    },
    setEnv(env: NetworkEnv) {
      service.set(COOKIE_NAME_SIF_ENV, env.toString());
    },
    clearEnv() {
      service.remove(COOKIE_NAME_SIF_ENV);
    },
  };
}
export type AppCookies = ReturnType<typeof AppCookies>;
