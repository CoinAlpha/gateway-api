import { Chain, Network } from "../../entities";
import {
  KeplrWalletProvider,
  MetamaskWalletProvider,
  TerraStationWalletProvider,
  CosmosWalletProvider,
  Web3WalletProvider,
} from "../../clients/wallets";
import { provider } from "web3-core";

export type WalletServiceContext = {
  sifRpcUrl: string;
  sifApiUrl: string;
  sifChainId: string;
  chains: Chain[];
  getWeb3Provider: () => Promise<provider>;
};

export class WalletService {
  protected constructor(private context: WalletServiceContext) {}
  static create(context: WalletServiceContext) {
    return new this(context);
  }

  keplrProvider = new KeplrWalletProvider(this.context);
  metamaskProvider = new MetamaskWalletProvider(this.context);
  terraProvider = new TerraStationWalletProvider(this.context);

  getPreferredProvider(chain: Chain) {
    switch (chain.network) {
      case Network.ETHEREUM:
        return this.metamaskProvider;
      case Network.TERRA:
        return this.terraProvider;
      default:
        return this.keplrProvider;
    }
  }

  tryConnectAllWallets() {
    return this.keplrProvider.tryConnectAll(
      ...this.context.chains.filter(
        (chain) =>
          !chain.chainConfig.hidden &&
          this.getPreferredProvider(chain) === this.keplrProvider,
      ),
    );
  }
}
export default WalletService.create.bind(WalletService);
