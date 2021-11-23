import { WalletProvider, WalletProviderContext } from "../WalletProvider";
import {
  Chain,
  IAssetAmount,
  EthChainConfig,
  AssetAmount,
} from "../../../entities";
import { provider, WebsocketProvider, IpcProvider } from "web3-core";
import Web3 from "web3";
import { erc20TokenAbi } from "./erc20TokenAbi";
import JSBI from "jsbi";
import {
  NativeDexTransaction,
  NativeDexSignedTransaction,
  NativeDexTransactionResult,
} from "../../../services/utils/SifClient/NativeDexTransaction";
import { EventEmitter } from "events";

// NOTE(ajoslin): Web3WalletProvider doesn't actually sign anything yet,
// all it has to do is approve amounts to contracts.
export class Web3Transaction {
  constructor(readonly contractAddress: string) {}
}

export function isEventEmittingProvider(
  provider?: unknown,
): provider is WebsocketProvider | IpcProvider {
  if (!provider || typeof provider === "string") return false;
  return typeof (provider as any).on === "function";
}

export class Web3WalletProvider extends WalletProvider<Web3Transaction> {
  constructor(
    public context: WalletProviderContext,
    private options: {
      getWeb3Provider: () => Promise<provider>;
    },
  ) {
    super();
  }

  async isInstalled(chain: Chain) {
    return true;
  }

  private async onProviderEvent<T>(
    eventName: string,
    callback: () => void,
  ): Promise<() => void> {
    const web3 = await this.getWeb3();
    if (!isEventEmittingProvider(web3.currentProvider)) return () => {};

    web3.currentProvider.on(eventName, () => callback());
    return () =>
      ((web3.currentProvider as unknown) as EventEmitter)?.off(
        eventName,
        callback,
      );
  }

  onChainChanged(callback: () => void) {
    return this.onProviderEvent("chainChanged", callback);
  }
  onAccountChanged(callback: () => void) {
    return this.onProviderEvent<string>("accountsChanged", callback);
  }

  private web3Promise?: Promise<Web3>;
  async getWeb3() {
    if (!this.web3Promise) {
      this.web3Promise = (async () => {
        const provider = await this.options.getWeb3Provider();
        if (!provider) throw new Error("Web3 provider not found!");
        return new Web3(provider);
      })();
    }
    return this.web3Promise;
  }

  async getRequiredApprovalAmount(
    chain: Chain,
    tx: NativeDexTransaction<Web3Transaction>,
    assetAmount: IAssetAmount,
  ) {
    if (assetAmount.symbol.toLowerCase() === "eth") {
      return AssetAmount(assetAmount.asset, "0");
    }

    // This will popup an approval request in metamask
    const web3 = await this.getWeb3();
    const tokenContract = new web3.eth.Contract(
      erc20TokenAbi,
      assetAmount.address!,
    );

    // TODO - give interface option to approve unlimited spend via web3.utils.toTwosComplement(-1);
    // NOTE - We may want to move this out into its own separate function.
    // Although I couldn't think of a situation we'd call allowance separately from approve
    const hasAlreadyApprovedSpend = await tokenContract.methods
      .allowance(tx.fromAddress, tx.msgs[0].contractAddress)
      .call();
    if (
      JSBI.lessThanOrEqual(
        assetAmount.toBigInt(),
        JSBI.BigInt(hasAlreadyApprovedSpend),
      )
    ) {
      return assetAmount;
    }
    return AssetAmount(assetAmount.asset, "0");
  }
  async approve(
    chain: Chain,
    tx: NativeDexTransaction<Web3Transaction>,
    amount: IAssetAmount,
  ): Promise<void | undefined> {
    const web3 = await this.getWeb3();
    const tokenContract = new web3.eth.Contract(
      erc20TokenAbi,
      amount.asset.address!,
    );

    const sendArgs = {
      from: tx.fromAddress,
      value: 0,
      gas: 100000,
    };
    const res = await tokenContract.methods
      .approve(tx.msgs[0].contractAddress, amount.toBigInt().toString())
      .send(sendArgs);
    console.log("approveBridgeBankSpend:", res);
  }
  sign(
    chain: Chain,
    tx: NativeDexTransaction<Web3Transaction>,
  ): Promise<NativeDexSignedTransaction<Web3Transaction>> {
    throw "not implemented; implementation in ethbridge for all eth tx";
  }

  broadcast(
    chain: Chain,
    tx: NativeDexSignedTransaction<Web3Transaction>,
  ): Promise<NativeDexTransactionResult> {
    throw "not implemented; implementation in ethbridge for all eth tx";
  }

  getEthChainConfig(chain: Chain): EthChainConfig {
    if (chain.chainConfig.chainType !== "eth") {
      throw new Error(this.constructor.name + " only accepts eth chainTypes");
    }
    return chain.chainConfig as EthChainConfig;
  }

  isChainSupported(chain: Chain) {
    return chain.chainConfig.chainType === "eth";
  }

  async connect(chain: Chain): Promise<string> {
    const web3 = await this.getWeb3();
    const [address] = await web3.eth.getAccounts();
    return address;
  }

  async hasConnected(chain: Chain): Promise<boolean> {
    return false;
  }
  canDisconnect(chain: Chain): boolean {
    return false;
  }
  async disconnect(chain: Chain): Promise<void> {}

  async fetchBalances(chain: Chain, address: string): Promise<IAssetAmount[]> {
    const web3 = await this.getWeb3();

    return Promise.all(
      chain.assets.map(async (asset) => {
        if (asset.symbol === chain.nativeAsset.symbol) {
          return AssetAmount(asset, await web3.eth.getBalance(address));
        }
        if (!asset.address) {
          return AssetAmount(asset, "0");
        }
        const contract = new web3.eth.Contract(
          erc20TokenAbi,
          asset.address.toLowerCase(),
        );
        let amount = "0";
        try {
          amount = await contract.methods.balanceOf(address).call();
        } catch (error) {
          console.error("token fetch error", asset);
        }
        return AssetAmount(asset, amount);
      }),
    );
  }
}
