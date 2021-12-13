import { createSdk } from "../src/setup";
import fetch from "cross-fetch";
import {
  NetworkEnv,
  AssetAmount,
  toBaseUnits,
  formatAssetAmount,
  IAsset,
  Network,
  IAssetAmount,
} from "../src";
import {
  DirectSecp256k1HdWalletProvider,
  WalletProvider,
  CosmosWalletProvider,
} from "../src/clients/wallets/cosmos";
import { Web3WalletProvider } from "../src/clients/wallets/ethereum";

import HDWalletProvider from "@truffle/hdwallet-provider";
import { BridgeParams, BridgeTx } from "../src/clients/bridges/BaseBridge";
import { isBroadcastTxFailure } from "@cosmjs/launchpad";

const sdk = createSdk({
  environment: NetworkEnv.TESTNET,
});

const cosmosWallet = new DirectSecp256k1HdWalletProvider(sdk.context, {
  mnemonic: process.env.COSMOS_MNEMONIC || "",
});
const web3Wallet = new Web3WalletProvider(sdk.context, {
  getWeb3Provider: async () => {
    return new HDWalletProvider({
      mnemonic: {
        phrase: process.env.ETH_MNEMONIC!,
      },
      providerOrUrl: process.env.ETH_HTTP_PROVIDER_URL!,
      chainId: 0,
    });
  },
});

async function swap(fromAssetAmount: IAssetAmount, toAsset: IAsset) {
  const pools = await sdk.liquidity.swap.fetchAllPools();
  const { fromPool, toPool } = await sdk.liquidity.swap.findSwapFromToPool({
    fromAsset: fromAssetAmount.asset,
    toAsset,
    pools,
  });

  const quote = sdk.liquidity.swap.createSwapQuote({
    fromAmount: fromAssetAmount,
    fromPool,
    toPool,
    slippagePercent: 1,
  });
  console.log(quote.toAmount.toString());
  console.log(quote.fromAmount.toString());
  console.log(quote.minimumReceived.toString());

  const address = await cosmosWallet.connect(sdk.chains.sifchain);

  const txDraft = await sdk.liquidity.swap.prepareSwapTx({
    address,
    fromAmount: fromAssetAmount,
    toAsset,
    minimumReceived: quote.minimumReceived,
  });
  console.log(txDraft);

  const signed = await cosmosWallet.sign(sdk.chains.sifchain, txDraft);
  const res = await cosmosWallet.broadcast(sdk.chains.sifchain, signed);
  console.log("isSuccess", !isBroadcastTxFailure(res));
  console.log(
    "New balances",
    await cosmosWallet.fetchBalances(sdk.chains.sifchain, address),
  );
}

async function ibcBridge(params: BridgeParams) {
  console.log("start sdk.bridges.ibc");
  try {
    await sdk.bridges.ibc.approveTransfer(cosmosWallet, params);
  } catch (error) {
    console.log("approve error", error);
    return;
  }

  let bridgeTx: BridgeTx;
  try {
    bridgeTx = await sdk.bridges.ibc.transfer(cosmosWallet, params);
  } catch (error) {
    console.log("send tx error", error);
  }
  try {
    const didComplete = await sdk.bridges.ibc.waitForTransferComplete(
      cosmosWallet,
      bridgeTx,
      console.log.bind(console, "update..."),
    );
    console.log("did transfer complete?", didComplete);
  } catch (error) {
    console.log("Error waiting for transfer completion", error);
  }
}

async function ethBridge(params: BridgeParams) {
  console.log("start sdk.bridges.eth");
  try {
    await sdk.bridges.eth.approveTransfer(web3Wallet, params);
  } catch (error) {
    console.log("approve error", error);
    return;
  }

  let bridgeTx: BridgeTx;
  try {
    bridgeTx = await sdk.bridges.eth.transfer(web3Wallet, params);
  } catch (error) {
    console.log("send tx error", error);
  }
  try {
    const didComplete = await sdk.bridges.eth.waitForTransferComplete(
      web3Wallet,
      bridgeTx,
      console.log.bind(console, "update..."),
    );
    console.log("did transfer complete?", didComplete);
  } catch (error) {
    console.log("Error waiting for transfer completion", error);
  }
}

async function run() {
  await swap(
    AssetAmount(sdk.chains.sifchain.forceGetAsset("rowan"), "1000"),
    sdk.chains.sifchain.forceGetAsset("cusdt"),
  );

  const photon = sdk.chains.cosmoshub.forceGetAsset("uphoton");
  await ibcBridge({
    fromChain: sdk.chains.cosmoshub,
    toChain: sdk.chains.sifchain,
    assetAmount: AssetAmount(photon, toBaseUnits("1.0", photon)),
    fromAddress: await cosmosWallet.connect(sdk.chains.cosmoshub),
    toAddress: await cosmosWallet.connect(sdk.chains.sifchain),
  });

  const eth = sdk.chains.ethereum.forceGetAsset("eth");
  await ethBridge({
    fromChain: sdk.chains.ethereum,
    toChain: sdk.chains.sifchain,
    assetAmount: AssetAmount(eth, toBaseUnits("0.01", eth)),
    fromAddress: await web3Wallet.connect(sdk.chains.ethereum),
    toAddress: await cosmosWallet.connect(sdk.chains.sifchain),
  });
}
