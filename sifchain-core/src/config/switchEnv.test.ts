import { AppCookies } from "./AppCookies";
import { switchEnv } from "./switchEnv";

let cookies: Pick<AppCookies, "setEnv" | "clearEnv">;

beforeEach(() => {
  cookies = {
    setEnv: jest.fn(),
    clearEnv: jest.fn(),
  };
});

it("switches the env when provided with an _env string", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=1",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).toHaveBeenCalledWith("1");
  expect(location.href).toBe("/");
});

it("switches the env when provided with a second _env string", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=mainnet",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).toHaveBeenCalledWith("0");
  expect(location.href).toBe("/");
});

it("doesnt switch the env when no string is provided", () => {
  const location = {
    href: "/#/foo",
    search: "",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).not.toHaveBeenCalled();
  expect(location.href).toBe("/#/foo");
});

it("doesnt switch the env when provided with an _env string out of bounds of NetworkEnv", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=7",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).not.toHaveBeenCalled();
  expect(location.href).toBe("/#/foo");
});

it("doesnt switch the env when provided with another _env string out of bounds of NetworkEnv", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=-1",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).not.toHaveBeenCalled();
  expect(location.href).toBe("/#/foo");
});

it("doesnt react to garbage", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=akjshdlkasjhdlkj",
  };

  switchEnv({ location, cookies });
  expect(cookies.setEnv).not.toHaveBeenCalled();
  expect(location.href).toBe("/#/foo");
});

it("_ clears the cookie", () => {
  const location = {
    href: "/#/foo",
    search: "?_env=_",
  };

  switchEnv({ location, cookies });
  expect(cookies.clearEnv).toHaveBeenCalled();
  expect(location.href).toBe("/");
});
