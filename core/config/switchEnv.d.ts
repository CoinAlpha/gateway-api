import { AppCookies } from "./AppCookies";
export declare function switchEnv({ location, cookies, }: {
    location: {
        search: string;
        href: string;
    };
    cookies?: Pick<AppCookies, "setEnv" | "clearEnv">;
}): void;
