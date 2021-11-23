const fetch = require("cross-fetch").default;
const JSBI = require("jsbi");
console.log({ JSBI });
const {
  assets,
} = require("../src/config/networks/sifchain/assets.sifchain.mainnet.json");
fetch(`https://data.sifchain.finance/beta/asset/tokenStats`)
  .then((d) => d.json())
  .then((data) => {
    console.log(data);
    const out = data.body.pools
      .map((pool) => {
        const asset = assets.find((a) => a.symbol === pool.symbol);
        const maxTransferAmountPerTx =
          +`9223372036854775807` / 10 ** asset.decimals;
        const maxMsgsPerTx = 2048;
        const maxTransferAmount = maxTransferAmountPerTx * maxMsgsPerTx;
        return {
          symbol: pool.symbol,
          priceUSD: pool.priceToken,
          maxTransferAmountPerTx: maxTransferAmountPerTx,
          maxUITransferAmount: maxTransferAmount.toPrecision(50),
          maxUITransferUSD:
            "$" +
            (+maxTransferAmount.toString() * pool.priceToken).toPrecision(50),
        };
      })
      .sort((a, b) => {
        return +a.maxUITransferUSD.split("$").pop() >
          +b.maxUITransferUSD.split("$").pop()
          ? 1
          : -1;
      });
    console.log(out);
    require("fs").writeFileSync(
      "./scripts/max-ibc-transfers.json",
      JSON.stringify(out, null, 2),
    );
  });
