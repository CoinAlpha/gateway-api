// @ts-ignore
import { Client, defaultChains, IrisChain, CosmoshubChain } from "sifchain";

const BitcoinCosmoshubConnnection = "";

const client = new Client({
  chains: [
    new IrisChain({
      connections: [{}],
    }),
  ],
});
