import { Network, WalletType, IAssetAmount } from "../../entities";
import { UsecaseContext } from "..";
import { WalletActions } from "./types";

// const chainIdName = new Map([
//   ["0x1", "Ethereum Mainnet"],
//   ["0x3", "Ropsten Test Network"],
// ]);

export default function MetamaskActions(
  context: UsecaseContext,
): WalletActions {
  const { services } = context;
  const { wallet, chains } = services;

  return {
    async loadIfConnected(network: Network) {
      await new Promise((r) => setTimeout(r, 500));
      if (await wallet.metamaskProvider.hasConnected(chains.get(network))) {
        return this.load(network);
      }
      return {
        connected: false,
      };
    },
    async load(network: Network) {
      const address = await wallet.metamaskProvider.connect(
        chains.get(network),
      );
      return {
        address,
        balances: [],
        connected: true,
      };
    },
    async getBalances(network: Network, address: string) {
      const bal = await wallet.metamaskProvider.fetchBalances(
        chains.get(network),
        address,
      );
      return bal;
    },
    async disconnect(network: Network) {
      await wallet.metamaskProvider.disconnect(chains.get(network));
    },
  };
}
