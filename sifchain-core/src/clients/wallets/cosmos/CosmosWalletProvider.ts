import { WalletProvider, WalletProviderContext } from "../WalletProvider";
import {
  Chain,
  IBCChainConfig,
  Network,
  IAssetAmount,
  AssetAmount,
  IAsset,
  Asset,
} from "../../../entities";
import fetch from "cross-fetch";
import {
  OfflineSigner,
  OfflineDirectSigner,
  EncodeObject,
} from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  QueryClient,
  setupIbcExtension,
  setupBankExtension,
  setupAuthExtension,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { DenomTrace } from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/transfer";
import { BroadcastTxResult } from "@cosmjs/launchpad";
import { createIBCHash } from "../../../utils/createIBCHash";
import { QueryDenomTracesResponse } from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/query";
import { TokenRegistry } from "../../native/TokenRegistry";
import {
  NativeDexClient,
  NativeDexTransaction,
  NativeDexSignedTransaction,
} from "../../native";

type IBCHashDenomTraceLookup = Record<
  string,
  { isValid: boolean; denomTrace: DenomTrace }
>;

export abstract class CosmosWalletProvider extends WalletProvider<EncodeObject> {
  tokenRegistry: ReturnType<typeof TokenRegistry>;

  constructor(public context: WalletProviderContext) {
    super();
    this.tokenRegistry = TokenRegistry(context);
  }

  isChainSupported(chain: Chain) {
    return chain.chainConfig.chainType === "ibc";
  }

  parseTxResultToStatus(txResult: BroadcastTxResult) {
    return NativeDexClient.parseTxResult(txResult);
  }

  abstract getSendingSigner(
    chain: Chain,
  ): Promise<OfflineSigner & OfflineDirectSigner>;

  async getRequiredApprovalAmount(
    chain: Chain,
    tx: NativeDexTransaction<EncodeObject>,
    amount: IAssetAmount,
  ) {
    return AssetAmount(amount.asset, "0");
  }
  async approve(
    chain: Chain,
    tx: NativeDexTransaction<EncodeObject>,
    amount: IAssetAmount,
  ) {
    throw "not implemented";
  }

  getIBCChainConfig(chain: Chain) {
    if (chain.chainConfig.chainType !== "ibc")
      throw new Error("Cannot connect to non-ibc chain " + chain.displayName);
    return chain.chainConfig as IBCChainConfig;
  }

  createIBCHash = createIBCHash;

  async getStargateClient(chain: Chain) {
    const chainConfig = this.getIBCChainConfig(chain);
    const sendingSigner = await this.getSendingSigner(chain);

    return SigningStargateClient?.connectWithSigner(
      chainConfig.rpcUrl,
      sendingSigner,
      {
        gasLimits: {
          send: 80000,
          ibcTransfer: 120000,
          delegate: 250000,
          undelegate: 250000,
          redelegate: 250000,
          // The gas multiplication per rewards.
          withdrawRewards: 140000,
          govVote: 250000,
        },
      },
    );
  }

  async getQueryClient(chain: Chain) {
    const chainConfig = this.getIBCChainConfig(chain);
    const tendermintClient = await Tendermint34Client.connect(
      chainConfig.rpcUrl,
    );
    return QueryClient.withExtensions(
      tendermintClient,
      setupIbcExtension,
      setupBankExtension,
      setupAuthExtension,
    );
  }

  private denomTracesCache: Record<string, Promise<IBCHashDenomTraceLookup>> =
    {};
  async getIBCDenomTracesLookupCached(chain: Chain) {
    const chainId = chain.chainConfig.chainId;
    if (!this.denomTracesCache[chainId]) {
      const promise = this.getIBCDenomTracesLookup(chain);
      this.denomTracesCache[chainId] = promise;
      promise.catch((error) => {
        delete this.denomTracesCache[chainId];
        throw error;
      });
    }
    return this.denomTracesCache[chainId];
  }

  async getIBCDenomTracesLookup(
    chain: Chain,
  ): Promise<IBCHashDenomTraceLookup> {
    const chainConfig = this.getIBCChainConfig(chain);

    // For some networks, the REST denomTraces works...
    // for others, the RPC one works. It's a mystery which networks have which implemented.
    const denomTracesRestPromise = (async () => {
      try {
        const denomTracesRes = await fetch(
          `${chainConfig.restUrl}/ibc/applications/transfer/v1beta1/denom_traces`,
        );
        if (!denomTracesRes.ok)
          throw new Error(
            `Failed to fetch denomTraces for ${chain.displayName}`,
          );
        const denomTracesJson = await denomTracesRes.json();
        return {
          denomTraces: denomTracesJson.denom_traces.map(
            (denomTrace: any): DenomTrace => {
              return {
                path: denomTrace.path,
                baseDenom: denomTrace.base_denom,
              };
            },
          ),
        };
      } catch (error) {
        // If REST fails, let it fail and go with RPC instead.
        return undefined;
      }
    })();
    const denomTracesRpcPromise = (async () => {
      const queryClient = await this.getQueryClient(chain);
      return queryClient.ibc.transfer.allDenomTraces();
    })();

    // Rest usually resolves first...
    let denomTraces: QueryDenomTracesResponse | undefined = undefined;
    try {
      denomTraces = await denomTracesRestPromise;
    } catch (error) {
      // continue if rest fails...
    }
    if (!denomTraces?.denomTraces) {
      // If RPC fails, it's a real error and will throw.
      denomTraces = await denomTracesRpcPromise;
    }

    const hashToTraceMapping: IBCHashDenomTraceLookup = {};
    for (let denomTrace of denomTraces.denomTraces) {
      const [port, ...channelIds] = denomTrace.path.split("/");
      const hash = await createIBCHash(
        port,
        channelIds[0],
        denomTrace.baseDenom,
      );
      hashToTraceMapping[hash] = { isValid: false, denomTrace };
    }
    if (chain.network === Network.SIFCHAIN) {
      // For sifchain, check for tokens that come from ANY ibc entry
      try {
        const ibcEntries = (await this.tokenRegistry.load()).filter(
          (item) => !!item.ibcCounterpartyChannelId,
        );
        for (let [hash, item] of Object.entries(hashToTraceMapping)) {
          hashToTraceMapping[hash].isValid = ibcEntries.some(
            (entry) =>
              item.denomTrace.path.startsWith(
                "transfer/" + entry.ibcCounterpartyChannelId,
              ) ||
              item.denomTrace.path.startsWith("transfer/" + entry.ibcChannelId),
          );
        }
      } catch (error) {
        // invalid token we don't support anymore, ignore
      }
    } else {
      try {
        // For other networks, check for tokens that come from specific counterparty channel
        const entry = await this.tokenRegistry.findAssetEntryOrThrow(
          chain.nativeAsset,
        );
        const channelId = entry.ibcCounterpartyChannelId;
        if (!channelId) {
          throw new Error(
            "Cannot trace denoms, not an IBC chain " + chain.displayName,
          );
        }
        for (let [hash, item] of Object.entries(hashToTraceMapping)) {
          hashToTraceMapping[hash].isValid = item.denomTrace.path.startsWith(
            `transfer/${channelId}`,
          );
        }
      } catch (error) {
        // invalid token we don't support anymore, ignore
      }
    }

    return hashToTraceMapping;
  }

  private individualDenomTraceCache: Record<
    string,
    Promise<DenomTrace | undefined>
  > = {};
  async getDenomTraceCached(chain: Chain, hash: string) {
    hash = hash.replace("ibc/", "");

    const key = chain.chainConfig.chainId + "_" + hash;
    if (!this.individualDenomTraceCache[key]) {
      this.individualDenomTraceCache[key] = this.getDenomTrace(
        chain,
        hash,
      ).catch((error) => {
        delete this.individualDenomTraceCache[key];
        return Promise.reject(error);
      });
    }
    return this.individualDenomTraceCache[key];
  }

  async getDenomTrace(
    chain: Chain,
    hash: string,
  ): Promise<DenomTrace | undefined> {
    const queryClient = await this.getQueryClient(chain);

    const { denomTrace } = await queryClient.ibc.transfer.denomTrace(hash);
    if (!denomTrace) {
      return;
    }

    if (chain.network === Network.SIFCHAIN) {
      // For sifchain, check if the token came from ANY counterparty network
      const ibcEntries = (await this.tokenRegistry.load()).filter(
        (item) => !!item.ibcCounterpartyChannelId,
      );
      const isValid = ibcEntries.some(
        (entry) =>
          denomTrace.path.startsWith(
            "transfer/" + entry.ibcCounterpartyChannelId,
          ) || denomTrace.path.startsWith("transfer/" + entry.ibcChannelId),
      );
      if (!isValid) {
        return;
      }
    } else {
      // For other networks, check for tokens that come from specific counterparty channel
      const entry = await this.tokenRegistry.findAssetEntryOrThrow(
        chain.nativeAsset,
      );
      const channelId = entry.ibcCounterpartyChannelId;
      if (!denomTrace.path.startsWith(`transfer/${channelId}`)) {
        return;
      }
    }
    return denomTrace;
  }

  async fetchBalances(chain: Chain, address: string): Promise<IAssetAmount[]> {
    const queryClient = await this.getQueryClient(chain);
    const balances = await queryClient?.bank.allBalances(address);

    const denomTracesLookup = await this.getIBCDenomTracesLookupCached(chain);

    const assetAmounts: IAssetAmount[] = [];

    for (let coin of balances) {
      if (!+coin.amount) continue;

      if (!coin.denom.startsWith("ibc/")) {
        const asset = chain.lookupAsset(coin.denom);

        try {
          // create asset it doesn't exist and is a precision-adjusted counterparty asset
          const assetAmount = await this.tokenRegistry.loadNativeAssetAmount(
            AssetAmount(asset || coin.denom, coin.amount),
          );
          assetAmounts.push(assetAmount);
        } catch (error) {
          console.log("error", error);
          // invalid token, ignore
        }
      } else {
        let lookupData = denomTracesLookup[coin.denom];
        let denomTrace = lookupData?.denomTrace;
        if (lookupData && !lookupData.isValid) {
          continue;
        } else if (!lookupData) {
          // If it's not in the master list of all denom traces, that list may just be outdated...
          // Newly minted tokens aren't added to the master list immediately.
          // @ts-ignore
          denomTrace = await this.getDenomTraceCached(chain, coin.denom);
        }

        if (!denomTrace) {
          continue; // Ignore, it's an invalid coin from invalid chain
        }

        const registry = await this.tokenRegistry.load();
        const entry = registry.find((e) => {
          return e.baseDenom === denomTrace.baseDenom;
        });
        if (!entry) continue;

        try {
          const nativeAsset =
            entry.unitDenom && entry.baseDenom !== entry.unitDenom
              ? chain.lookupAssetOrThrow(entry.unitDenom)
              : chain.lookupAssetOrThrow(entry.baseDenom);

          let asset = chain.assets.find(
            (asset) =>
              asset.symbol.toLowerCase() === nativeAsset.symbol.toLowerCase(),
          );
          if (asset) {
            asset.ibcDenom = coin.denom;
          }
          const counterpartyAsset =
            await this.tokenRegistry.loadCounterpartyAsset(nativeAsset);
          const assetAmount = AssetAmount(counterpartyAsset, coin.amount);
          assetAmounts.push(
            await this.tokenRegistry.loadNativeAssetAmount(assetAmount),
          );
        } catch (error) {
          // ignore asset, doesnt exist in our list.
        }
      }
    }

    return assetAmounts;
  }
}
