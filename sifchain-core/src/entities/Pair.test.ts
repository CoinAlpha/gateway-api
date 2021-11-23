import { Asset } from "./Asset";
import { AssetAmount } from "./AssetAmount";

import { Network } from "./Network";
import { Pair } from "./Pair";

describe("Pair", () => {
  const ATK = Asset({
    decimals: 6,
    symbol: "atk",
    label: "ATK",
    displaySymbol: "ATK",
    name: "AppleToken",
    address: "123",
    network: Network.ETHEREUM,
    homeNetwork: Network.ETHEREUM,
  });
  const BTK = Asset({
    decimals: 18,
    symbol: "btk",
    label: "BTK",
    displaySymbol: "BTK",
    name: "BananaToken",
    address: "1234",
    network: Network.ETHEREUM,
    homeNetwork: Network.ETHEREUM,
  });
  const ETH = Asset({
    decimals: 18,
    symbol: "eth",
    displaySymbol: "ETH",
    label: "ETH",
    name: "Ethereum",
    network: Network.ETHEREUM,
    homeNetwork: Network.ETHEREUM,
  });
  const ROWAN = Asset({
    decimals: 18,
    symbol: "rowan",
    displaySymbol: "ROWAN",
    label: "ROWAN",
    name: "Rowan",
    network: Network.SIFCHAIN,
    homeNetwork: Network.ETHEREUM,
  });

  test("contains()", () => {
    const pair = Pair(AssetAmount(ATK, "10"), AssetAmount(BTK, "10"));

    expect(pair.contains(ATK)).toBe(true);
    expect(pair.contains(BTK)).toBe(true);
    expect(pair.contains(ROWAN)).toBe(false);
  });
  test("other asset", () => {
    const pair = Pair(AssetAmount(ATK, "10"), AssetAmount(BTK, "10"));
    expect(pair.otherAsset(ATK).symbol).toBe("btk");
  });
  describe("when half", () => {
    const pair = Pair(AssetAmount(ATK, "5"), AssetAmount(BTK, "10"));

    test("pair has symbol", () => {
      expect(pair.symbol()).toEqual("atk_btk");
    });
  });
});
