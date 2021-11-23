import { getEnv, NetworkEnv } from "./getEnv";

const profiles = {
  devnet: {
    tag: "devnet",
    ethAssetTag: "ethereum.devnet",
    sifAssetTag: "sifchain.mainnet",
  },
  testnet: {
    tag: "testnet",
    ethAssetTag: "ethereum.testnet",
    sifAssetTag: "sifchain.mainnet",
  },
  mainnet: {
    tag: "mainnet",
    ethAssetTag: "ethereum.mainnet",
    sifAssetTag: "sifchain.mainnet",
  },
  localnet: {
    tag: "localnet",
    ethAssetTag: "ethereum.localnet",
    sifAssetTag: "sifchain.localnet",
  },
};
const cases = [
  { hostname: "testnet.sifchain.finance", tag: "testnet" },
  { hostname: "devnet.sifchain.finance", tag: "devnet" },
  { hostname: "gateway.pinata.cloud", tag: "devnet" },
  { hostname: "myawesomebranch.sifchain.vercel.app", tag: "devnet" },
  { hostname: "dingfoo.sifchain.vercel.app", tag: "devnet" },
  { hostname: "dex.sifchain.finance", tag: "mainnet" },
  { hostname: "localhost", tag: "localnet" },
];

cases.forEach(({ hostname, tag }) => {
  describe(`host is ${hostname} then use cookie > "${tag}"`, () => {
    const tests = [
      {
        input: { hostname, cookie: undefined },
        output: profiles[tag as keyof typeof profiles],
      },
      {
        input: { hostname, cookie: NetworkEnv.MAINNET },
        output: profiles.mainnet,
      },
      {
        input: { hostname, cookie: NetworkEnv.DEVNET },
        output: profiles.devnet,
      },
      {
        input: { hostname, cookie: NetworkEnv.TESTNET },
        output: profiles.testnet,
      },
    ];
    tests.forEach(({ input: { hostname, cookie }, output }) => {
      test(`hostname: ${hostname} + cookie: ${cookie} = ${output.tag}`, () => {
        expect(
          getEnv({
            location: { hostname },
            cookies: { getEnv: () => cookie },
          }),
        ).toEqual(output);
      });
    });
  });
});

test("unknown hosts should bork", () => {
  expect(() => {
    getEnv({
      location: { hostname: "evil.com" },
      cookies: { getEnv: () => NetworkEnv.MAINNET },
    });
  }).toThrow();
  expect(() => {
    getEnv({
      location: { hostname: "evil.com" },
      cookies: { getEnv: () => undefined },
    });
  }).toThrow();
});

test("weird cookie values should bork", () => {
  expect(() => {
    getEnv({
      location: { hostname: "dex.sifchain.finance" },
      cookies: { getEnv: () => "foo" as NetworkEnv },
    });
  }).toThrow();
});

test("hosts that contain valid hosts but are not subdomains of valid hosts will bork", () => {
  expect(() => {
    getEnv({
      location: { hostname: "devnet.sifchain.finance.evil.com" },
      cookies: { getEnv: () => NetworkEnv.MAINNET },
    });
  }).toThrow();
});
