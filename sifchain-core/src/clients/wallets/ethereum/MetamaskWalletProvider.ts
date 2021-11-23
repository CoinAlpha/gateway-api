import { Web3WalletProvider } from "./Web3WalletProvider";
import { EventEmitter } from "events";
import { Chain } from "../../..";
import { WalletProviderContext } from "../WalletProvider";
import { getMetamaskProvider } from "./getMetamaskProvider";
import { MetaMaskInpageProvider } from "@metamask/inpage-provider";
import { IAsset } from "entities";

export class MetamaskWalletProvider extends Web3WalletProvider {
  constructor(public context: WalletProviderContext) {
    super(context, {
      getWeb3Provider: () => getMetamaskProvider(),
    });
  }

  private async getMetamaskProvider(): Promise<MetaMaskInpageProvider> {
    const web3 = await this.getWeb3();
    return web3.currentProvider as MetaMaskInpageProvider;
  }

  async isInstalled(chain: Chain) {
    return !!(await this.getMetamaskProvider());
  }

  async connect(chain: Chain) {
    const provider = await this.getMetamaskProvider();

    const chainId = await provider.request({ method: "eth_chainId" });
    console.log({ chainId });
    const [address] = await (provider.request({
      method: "eth_requestAccounts",
    }) as Promise<string>);
    return address;
  }

  async hasConnected(chain: Chain): Promise<boolean> {
    const web3 = await this.getWeb3();
    const accounts = await web3.eth.getAccounts();
    return accounts.length > 0;
  }

  async suggestEthereumAsset(
    asset: IAsset,
    loadTokenIconUrl: (
      asset: IAsset,
    ) => Promise<string | undefined> | string | undefined,
    contractAddress: string | undefined = asset.address,
  ): Promise<boolean> {
    if (!contractAddress) throw new Error("No contract address supplied");

    const metamask = await this.getMetamaskProvider();
    const wasAdded = await metamask.request({
      method: "wallet_watchAsset",
      params: {
        // @ts-ignore
        type: "ERC20",
        options: {
          address: contractAddress,
          symbol: asset.displaySymbol.toUpperCase(),
          decimals: asset.decimals,
          image: await loadTokenIconUrl(asset),
        },
      },
    });
    return !!wasAdded;
  }
}
