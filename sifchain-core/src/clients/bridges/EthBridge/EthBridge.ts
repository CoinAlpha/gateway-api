import { BaseBridge, BridgeTx, EthBridgeTx, BridgeParams } from "../BaseBridge";
import {
  IAsset,
  IAssetAmount,
  getChainsService,
  Network,
  TransactionStatus,
  AssetAmount,
  EthChainConfig,
} from "../../../entities";
import { provider } from "web3-core";
import Web3 from "web3";
import {
  createPegTxEventEmitter,
  PegTxEventEmitter,
} from "../../../services/EthbridgeService/PegTxEventEmitter";
import {
  confirmTx,
  getConfirmations,
} from "../../../services/EthbridgeService/utils/confirmTx";
import { Contract } from "web3-eth-contract";
import { erc20TokenAbi } from "../../wallets/ethereum/erc20TokenAbi";
import JSBI from "jsbi";
import { getBridgeBankContract } from "../../../services/EthbridgeService/bridgebankContract";
import { isOriginallySifchainNativeToken } from "./isOriginallySifchainNativeToken";
import { NativeDexClient } from "../../../services/utils/SifClient/NativeDexClient";
import { CosmosWalletProvider } from "../../wallets/cosmos/CosmosWalletProvider";
import Long from "long";
import {
  parseTxFailure,
  parseEthereumTxFailure,
} from "../../../services/SifService/parseTxFailure";
import { isBroadcastTxFailure } from "@cosmjs/launchpad";
import TokenRegistryService from "../../../services/TokenRegistryService";
import { Web3WalletProvider, Web3Transaction } from "../../wallets";
import { NativeDexTransaction } from "../../../services/utils/SifClient/NativeDexTransaction";
import { TxEventEthConfCountChanged } from "services/EthbridgeService/types";

export type EthBridgeContext = {
  sifApiUrl: string;
  sifWsUrl: string;
  sifRpcUrl: string;
  sifChainId: string;
  bridgebankContractAddress: string;
  bridgetokenContractAddress: string;
  getWeb3Provider: () => Promise<provider>;
  assets: IAsset[];
  peggyCompatibleCosmosBaseDenoms: Set<string>;
  cosmosWalletProvider: CosmosWalletProvider;
};

export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ETH_CONFIRMATIONS = 50;

export class EthBridge extends BaseBridge<
  CosmosWalletProvider | Web3WalletProvider
> {
  constructor(public context: EthBridgeContext) {
    super();
  }
  static create(context: EthBridgeContext) {
    return new EthBridge(context);
  }

  assertValidBridgeParams(
    wallet: CosmosWalletProvider | Web3WalletProvider,
    params: BridgeParams,
  ) {
    if (
      params.toChain.network === Network.SIFCHAIN &&
      params.fromChain.network === Network.ETHEREUM
    ) {
      if (!(wallet instanceof Web3WalletProvider)) {
        throw new Error(
          "EthBridge must be called with a Web3WalletProvider when transfering from Ethereum to Sifchain",
        );
      }
    } else if (
      params.toChain.network === Network.ETHEREUM &&
      params.fromChain.network === Network.SIFCHAIN
    ) {
      if (!(wallet instanceof CosmosWalletProvider)) {
        throw new Error(
          "EthBridge must be called with a CosmosWalletProvider when transfering from Sifchain to Ethereum",
        );
      }
    } else {
      throw new Error(
        "EthBridge can only broker transfers between Sifchain and Ethereum",
      );
    }
  }

  tokenRegistry = TokenRegistryService(this.context);

  // Pull this out to a util?
  // How to handle context/dependency injection?
  private web3: Web3 | null = null;
  ensureWeb3 = async () => {
    if (!this.web3) {
      this.web3 = new Web3(await this.context.getWeb3Provider());
    }
    return this.web3;
  };

  estimateFees(
    provider: CosmosWalletProvider | Web3WalletProvider,
    params: BridgeParams,
  ): IAssetAmount | undefined {
    if (params.toChain.network === Network.ETHEREUM) {
      const ceth = getChainsService()
        .get(Network.SIFCHAIN)
        .lookupAssetOrThrow("ceth");

      const feeNumber = isOriginallySifchainNativeToken(params.assetAmount)
        ? "35370000000000000"
        : "35370000000000000";

      return AssetAmount(ceth, feeNumber);
    }
  }

  async approveTransfer(
    wallet: Web3WalletProvider | CosmosWalletProvider,
    params: BridgeParams,
  ) {
    this.assertValidBridgeParams(wallet, params);

    if (wallet instanceof Web3WalletProvider) {
      return wallet.approve(
        params.fromChain,
        new NativeDexTransaction(params.fromAddress, [
          new Web3Transaction(this.context.bridgebankContractAddress),
        ]),
        params.assetAmount,
      );
    }
  }

  async transfer(
    wallet: CosmosWalletProvider | Web3WalletProvider,
    params: BridgeParams,
  ) {
    this.assertValidBridgeParams(wallet, params);
    const web3 = new Web3(await this.context.getWeb3Provider());

    if (wallet instanceof CosmosWalletProvider) {
      const tx = await this.exportToEth(wallet, params);

      if (isBroadcastTxFailure(tx)) {
        throw new Error(parseTxFailure(tx).memo);
      }

      const startingHeight = await web3.eth.getBlockNumber();

      return {
        type: "eth",
        startingHeight,
        confirmCount: 0,
        completionConfirmCount: 0,
        ...params,
        hash: tx.transactionHash,
        fromChain: params.fromChain,
        toChain: params.toChain,
      } as EthBridgeTx;
    } else {
      const pegTx = await this.importFromEth(wallet, params);
      const startingHeight = await web3.eth.getBlockNumber();

      try {
        const hash = await new Promise<string>((resolve, reject) => {
          pegTx.onError((error) => reject(error.payload));
          pegTx.onTxHash((hash) => resolve(hash.txHash));
        });

        return {
          type: "eth",
          startingHeight,
          confirmCount: 0,
          completionConfirmCount: ETH_CONFIRMATIONS,
          ...params,
          fromChain: params.fromChain,
          toChain: params.toChain,
          hash: hash,
        } as EthBridgeTx;
      } catch (transactionStatus) {
        throw new Error(parseEthereumTxFailure(transactionStatus).memo);
      }
    }
  }

  private async exportToEth(
    provider: CosmosWalletProvider,
    params: BridgeParams,
  ) {
    const feeAmount = await this.estimateFees(provider, params);
    const nativeChain = params.fromChain;

    const client = await NativeDexClient.connectByChain(nativeChain);

    const sifAsset = nativeChain.findAssetWithLikeSymbolOrThrow(
      params.assetAmount.asset.symbol,
    );

    const entry = await this.tokenRegistry.findAssetEntryOrThrow(sifAsset);

    const tx = isOriginallySifchainNativeToken(params.assetAmount.asset)
      ? client.tx.ethbridge.Lock(
          {
            ethereumReceiver: params.toAddress,

            amount: params.assetAmount.toBigInt().toString(),
            symbol: entry.denom,
            cosmosSender: params.fromAddress,
            ethereumChainId: Long.fromString(
              `${parseInt(params.toChain.chainConfig.chainId)}`,
            ),
            // ethereumReceiver: tokenAddress,
            cethAmount: feeAmount!.toBigInt().toString(),
          },
          params.fromAddress,
        )
      : client.tx.ethbridge.Burn(
          {
            ethereumReceiver: params.toAddress,

            amount: params.assetAmount.toBigInt().toString(),
            symbol: entry.denom,
            cosmosSender: params.fromAddress,
            ethereumChainId: Long.fromString(
              `${parseInt(params.toChain.chainConfig.chainId)}`,
            ),
            // ethereumReceiver: tokenAddress,
            cethAmount: feeAmount!.toBigInt().toString(),
          },
          params.fromAddress,
        );

    const signed = await provider.sign(nativeChain, tx);
    const sent = await provider.broadcast(nativeChain, signed);

    return sent;
  }

  private async importFromEth(
    provider: Web3WalletProvider,
    params: BridgeParams,
  ) {
    const chainConfig = params.fromChain.chainConfig as EthChainConfig;
    const web3 = await this.ensureWeb3();
    const web3ChainId = await web3.eth.getChainId();
    if (+chainConfig.chainId !== web3ChainId) {
      throw new Error(
        `Invalid EVM chain id! Got ${web3ChainId}, expected ${+chainConfig.chainId}.`,
      );
    }

    let lockOrBurnFn;
    if (isOriginallySifchainNativeToken(params.assetAmount.asset)) {
      lockOrBurnFn = this.burnToSifchain;
    } else {
      lockOrBurnFn = this.lockToSifchain;
    }

    const pegTx = await lockOrBurnFn.call(
      this,
      params.toAddress,
      params.assetAmount,
      ETH_CONFIRMATIONS,
    );
    this.subscribeToTx(pegTx, console.log.bind(console, "subscribtion"));
    return pegTx;
  }

  async waitForTransferComplete(
    provider: Web3WalletProvider,
    tx: BridgeTx,
    onUpdateTx?: (update: Partial<BridgeTx>) => void,
  ): Promise<boolean> {
    const ethTx = tx as EthBridgeTx;
    const web3 = await provider.getWeb3();
    if (ethTx.toChain.network === Network.SIFCHAIN) {
      let done = false;
      return new Promise<boolean>((resolve, reject) => {
        const pegTx = this.createPegTx(
          ETH_CONFIRMATIONS,
          ethTx.assetAmount.asset.ibcDenom || ethTx.assetAmount.asset.symbol,
          ethTx.hash,
        );
        this.subscribeToTx(pegTx, (ethTx: TransactionStatus) => {
          if (ethTx.state === "completed") {
            resolve(true);
          } else if (ethTx.state === "failed") {
            reject(new Error("Transaction failed"));
          }
        });

        (async () => {
          let confirmCount = ethTx.confirmCount;
          const blockHeight = await web3.eth.getBlockNumber();
          while (!done) {
            const newCount = await getConfirmations(web3, ethTx.hash);
            if (newCount && newCount !== confirmCount) {
              onUpdateTx?.({ confirmCount: newCount });
              confirmCount = newCount;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));

            if (blockHeight > ethTx.startingHeight + ETH_CONFIRMATIONS * 1.1) {
              // In the cases a tx was sped up or canceled in metamask before
              // it took off, we don't have an API to find out.
              // https://github.com/ChainSafe/web3.js/issues/3723
              // In this case, our transaction will timeout. Just quietly cancel
              // our UI-side listen for the import after a grace period of expected
              // confirmations + 10%.
              resolve(false);
              break;
            }
          }
        })();
      }).finally(() => (done = true));
    } else {
      // For ethereum exports, we can't listen for completion...
      // just assume completion if it's sent.
      if (/eth$/.test(ethTx.assetAmount.symbol.toLowerCase())) {
        await new Promise((r) => setTimeout(r, 15_000));
        return true;
      }

      const contract = new web3.eth.Contract(
        erc20TokenAbi,
        ethTx.toChain.findAssetWithLikeSymbolOrThrow(ethTx.assetAmount.symbol)
          .address || ETH_ADDRESS,
      );

      let startingHeight = ethTx.startingHeight;
      const transferOptions = {
        fromBlock: startingHeight,
        filter: {
          _to: ethTx.toAddress,
          _value: ethTx.assetAmount.amount.toString(),
        },
      };

      const pastEvents = await contract.getPastEvents("Transfer", {
        ...transferOptions,
        toBlock: "latest",
      });
      if (pastEvents.length) return true;

      return new Promise<boolean>(async (resolve, reject) => {
        // wait for the money on this token to hit
        contract.events.Transfer(
          transferOptions,
          (error: Error, value: any) => {
            if (error) reject(error);
            else resolve(true);
          },
        );
      });
    }
  }

  /**
   * Create an event listener to report status of a peg transaction.
   * Usage:
   * const tx = createPegTx(50)
   * tx.setTxHash('0x52ds.....'); // set the hash to lookup and confirm on the blockchain
   * @param confirmations number of confirmations before pegtx is considered confirmed
   */
  createPegTx(
    confirmations: number,
    symbol?: string,
    txHash?: string,
  ): PegTxEventEmitter {
    console.log("createPegTx", {
      confirmations,
      symbol,
      txHash,
    });
    const emitter = createPegTxEventEmitter(txHash, symbol);

    // decorate pegtx to invert dependency to web3 and confirmations
    emitter.onTxHash(async ({ payload: txHash }) => {
      const web3 = await this.ensureWeb3();
      confirmTx({
        web3,
        txHash,
        confirmations,
        onSuccess() {
          emitter.emit({ type: "Complete", payload: null });
        },
        onCheckConfirmation(count) {
          emitter.emit({ type: "EthConfCountChanged", payload: count });
        },
      });
    });

    return emitter;
  }

  /**
   * Gets a list of transactionHashes found as _from keys within the given events within a given blockRange from the current block
   * @param {*} address eth address to correlate transactions with
   * @param {*} contract web3 contract
   * @param {*} eventList event name list of events (must have an addresskey)
   * @param {*} blockRange number of blocks from the current block header to search
   */
  async getEventTxsInBlockrangeFromAddress(
    address: string,
    contract: Contract,
    eventList: string[],
    blockRange: number,
  ) {
    const web3 = await this.ensureWeb3();
    const latest = await web3.eth.getBlockNumber();
    const fromBlock = Math.max(latest - blockRange, 0);
    const allEvents = await contract.getPastEvents("allEvents", {
      // filter:{_from:address}, // if _from was indexed we could do this
      fromBlock,
      toBlock: "latest",
    });

    // unfortunately because _from is not an indexed key we have to manually filter
    // TODO: ask peggy team to index the _from field which would make this more efficient
    const txs: { symbol: string; hash: string }[] = [];
    for (let event of allEvents) {
      const isEventWeCareAbout = eventList.includes(event.event);

      const matchesInputAddress =
        address &&
        event?.returnValues?._from?.toLowerCase() === address.toLowerCase();

      if (isEventWeCareAbout && matchesInputAddress && event.transactionHash) {
        txs.push({
          hash: event.transactionHash,
          symbol: event.returnValues?._symbol,
        });
      }
    }
    return txs;
  }

  async addEthereumAddressToPeggyCompatibleCosmosAssets() {
    /* 
       Should be called on load. This is a hack to make cosmos assets peggy compatible 
       while the SDK bridge abstraction is a WIP.
     */
    const ethChain = getChainsService().get(Network.ETHEREUM);
    for (let asset of ethChain.assets) {
      try {
        if (this.context.peggyCompatibleCosmosBaseDenoms.has(asset.symbol)) {
          asset.address = await this.fetchTokenAddress(asset);
        }
      } catch (e) {
        console.error(e);
      }
    }
    for (let asset of this.context.assets) {
      if (this.context.peggyCompatibleCosmosBaseDenoms.has(asset.symbol)) {
        const ethAsset = ethChain.lookupAsset(asset.symbol);
        if (ethAsset) {
          asset.address = ethAsset.address;
        }
      }
    }
  }

  async lockToSifchain(
    sifRecipient: string,
    assetAmount: IAssetAmount,
    confirmations: number,
  ) {
    const pegTx = this.createPegTx(confirmations, assetAmount.asset.symbol);

    function handleError(err: any) {
      console.log("lockToSifchain: handleError: ", err);
      pegTx.emit({
        type: "Error",
        payload: {
          hash: "",
          rawLog: err.message.toString(),
        },
      });
    }

    try {
      const web3 = await this.ensureWeb3();
      const cosmosRecipient = Web3.utils.utf8ToHex(sifRecipient);

      const bridgeBankContract = await getBridgeBankContract(
        web3,
        this.context.bridgebankContractAddress,
      );
      const accounts = await web3.eth.getAccounts();
      const coinDenom =
        assetAmount.asset.ibcDenom || assetAmount.asset.address || ETH_ADDRESS; // eth address is ""

      const amount = assetAmount.toBigInt().toString();
      const fromAddress = accounts[0];

      const sendArgs = {
        from: fromAddress,
        value: coinDenom === ETH_ADDRESS ? amount : 0,
        gas: 150000,
      };

      console.log(
        "lockToSifchain: bridgeBankContract.lock",
        JSON.stringify({ cosmosRecipient, coinDenom, amount, sendArgs }),
      );

      bridgeBankContract.methods
        .lock(cosmosRecipient, coinDenom, amount)
        .send(sendArgs)
        .on("transactionHash", (hash: string) => {
          console.log("lockToSifchain: bridgeBankContract.lock TX", hash);
          pegTx.setTxHash(hash);
        })
        .on("error", (err: any) => {
          console.log("lockToSifchain: bridgeBankContract.lock ERROR", err);
          handleError(err);
        });
    } catch (err) {
      handleError(err);
    }

    return pegTx;
  }

  /**
   * Get a list of unconfirmed transaction hashes associated with
   * a particular address and return pegTxs associated with that hash
   * @param address contract address
   * @param confirmations number of confirmations required
   */
  async fetchUnconfirmedLockBurnTxs(
    address: string,
    confirmations: number,
  ): Promise<PegTxEventEmitter[]> {
    const web3 = await this.ensureWeb3();

    const bridgeBankContract = await getBridgeBankContract(
      web3,
      this.context.bridgebankContractAddress,
    );

    const txs = await this.getEventTxsInBlockrangeFromAddress(
      address,
      bridgeBankContract,
      ["LogBurn", "LogLock"],
      confirmations,
    );

    return txs.map(({ hash, symbol }) =>
      this.createPegTx(confirmations, symbol, hash),
    );
  }

  async burnToSifchain(
    sifRecipient: string,
    assetAmount: IAssetAmount,
    confirmations: number,
    address?: string,
  ) {
    console.log(
      "burnToSifchain",
      sifRecipient,
      assetAmount.asset.symbol,
      assetAmount.amount.toBigInt().toString(),
      confirmations,
      address,
    );

    const pegTx = this.createPegTx(confirmations, assetAmount.asset.symbol);

    function handleError(err: any) {
      console.log("burnToSifchain: handleError ERROR", err);
      pegTx.emit({
        type: "Error",
        payload: {
          hash: "",
          rawLog: err.message.toString(),
        },
      });
    }

    try {
      const web3 = await this.ensureWeb3();
      const cosmosRecipient = Web3.utils.utf8ToHex(sifRecipient);

      const bridgeBankContract = await getBridgeBankContract(
        web3,
        this.context.bridgebankContractAddress,
      );
      const accounts = await web3.eth.getAccounts();
      const coinDenom = assetAmount.asset.address;
      const amount = assetAmount.toBigInt().toString();
      const fromAddress = address || accounts[0];

      const sendArgs = {
        from: fromAddress,
        value: 0,
        gas: 150000, // Note: This chose in lieu of burn(params).estimateGas({from})
      };

      bridgeBankContract.methods
        .burn(cosmosRecipient, coinDenom, amount)
        .send(sendArgs)
        .on("transactionHash", (hash: string) => {
          console.log("burnToSifchain: bridgeBankContract.burn TX", hash);
          pegTx.setTxHash(hash);
        })
        .on("error", (err: any) => {
          console.log("burnToSifchain: bridgeBankContract.burn ERROR", err);
          handleError(err);
        });
    } catch (err) {
      console.error(err);
      handleError(err);
    }

    return pegTx;
  }

  async fetchSymbolAddress(symbol: string) {
    return this.fetchTokenAddress(
      getChainsService()
        .get(Network.SIFCHAIN)
        .findAssetWithLikeSymbolOrThrow(symbol),
    );
  }

  async fetchTokenAddress(
    // asset to fetch token address for
    asset: IAsset,
    // optional: pass in HTTP, or other provider (for testing)
    loadWeb3Instance: () => Promise<Web3> | Web3 = this.ensureWeb3,
  ): Promise<string | undefined> {
    // const web3 = new Web3(createWeb3WsProvider());
    const web3 = await loadWeb3Instance();
    const bridgeBankContract = await getBridgeBankContract(
      web3,
      this.context.bridgebankContractAddress,
    );

    const possibleSymbols = [
      // IBC assets with dedicated decimal-precise contracts are uppercase
      asset.displaySymbol.toUpperCase(),
      // remove c prefix
      asset.symbol.replace(/^c/, ""),
      // remove e prefix
      asset.symbol.replace(/^e/, ""),
      // display symbol goes before ibc denom because the dedicated decimal-precise contracts
      // utilize the display symbol
      asset.displaySymbol,
      asset.ibcDenom,
      asset.symbol,
      "e" + asset.symbol,
    ].filter(Boolean);

    for (let symbol of possibleSymbols) {
      // Fetch the token address from bridgebank
      let tokenAddress = await bridgeBankContract.methods
        .getBridgeToken(symbol)
        .call();

      // Token address is a hex number. If it is non-zero (not ethereum or empty) when parsed, return it.
      if (+tokenAddress) {
        return tokenAddress;
      }
      // If this is ethereum, and the token address is empty, return the ethereum address
      if (tokenAddress === ETH_ADDRESS && symbol?.endsWith("eth")) {
        return tokenAddress;
      }
    }
  }

  subscribeToTx(
    tx: PegTxEventEmitter,
    onUpdated: (tx: TransactionStatus) => void,
  ) {
    function unsubscribe() {
      tx.removeListeners();
    }

    tx.onTxHash(({ txHash }) => {
      console.log("onTxHash", txHash);
      onUpdated({
        hash: txHash,
        memo: "Transaction Accepted",
        state: "accepted",
        symbol: tx.symbol,
      });
    });

    tx.onComplete(({ txHash }) => {
      onUpdated({
        hash: txHash,
        memo: "Transaction Complete",
        state: "completed",
      });

      // tx is complete so we can unsubscribe
      unsubscribe();
    });

    tx.onError((err) => {
      onUpdated({
        hash: tx.hash || "",
        memo: err.payload.memo || "Transaction Failed",
        state: "failed",
      });
    });

    // HACK: Trigger all hashHandlers
    // Maybe make this some kind of ready function?
    if (tx.hash) tx.setTxHash(tx.hash);

    return unsubscribe;
  }
}
