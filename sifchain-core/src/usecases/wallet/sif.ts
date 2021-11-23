import { Address, TxParams, Network } from "../../entities";
import { UsecaseContext } from "..";
import { effect, ReactiveEffect, stop } from "@vue/reactivity";

export default ({
  services,
  store,
}: UsecaseContext<"sif" | "clp" | "bus", "wallet">) => {
  const actions = {
    initSifWallet() {
      const effects: ReactiveEffect[] = [];
      const state = services.sif.getState();
      effects.push(
        effect(() => {
          console.log("state.connected:", state.connected);
          if (
            store.wallet.get(Network.SIFCHAIN).isConnected !== state.connected
          ) {
            store.wallet.get(Network.SIFCHAIN).isConnected = state.connected;
            if (store.wallet.get(Network.SIFCHAIN).isConnected) {
              services.bus.dispatch({
                type: "WalletConnectedEvent",
                payload: {
                  walletType: "sif",
                  address: store.wallet.get(Network.SIFCHAIN).address,
                },
              });
            }
          }
        }),
      );

      effects.push(
        effect(() => {
          store.wallet.get(Network.SIFCHAIN).address = state.address;
        }),
      );

      effects.push(
        effect(() => {
          store.wallet.get(Network.SIFCHAIN).balances = state.balances;
        }),
      );

      return () => {
        for (let ef of effects) {
          stop(ef);
        }
      };
    },

    async getCosmosBalances(address: Address) {
      // TODO: validate sif prefix
      return await services.sif.getBalance(address);
    },

    async sendCosmosTransaction(params: TxParams) {
      return await services.sif.transfer(params);
    },

    async connectToSifWallet() {
      try {
        // TODO type
        await services.sif.connect();

        store.wallet.get(Network.SIFCHAIN).isConnected = true;
      } catch (error) {
        console.error(error);
        services.bus.dispatch({
          type: "WalletConnectionErrorEvent",
          payload: {
            walletType: "sif",
            message: "Failed to connect to Keplr.",
          },
        });
      }
    },
  };

  return actions;
};
