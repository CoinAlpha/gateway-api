import { createSdk } from "../src/setup";
import { NetworkEnv, AssetAmount, toBaseUnits } from "../src";
import {
  WalletProviderContext,
  DirectSecp256k1HdWalletProvider,
} from "../src/clients/wallets";

const sdk = createSdk({
  environment: NetworkEnv.DEVNET,
  wallets: {
    cosmos: (context: WalletProviderContext) => {
      return new DirectSecp256k1HdWalletProvider(context, {
        mnemonic: process.env.COSMOS_MNEMONIC || "",
      });
    },
  },
});

(async () => {
  const sifAddress = await sdk.wallets.cosmos.connect(sdk.chains.sifchain);
  const sifBalances = await sdk.wallets.cosmos.fetchBalances(
    sdk.chains.sifchain,
    sifAddress,
  );
  const cosmoshubAddress = await sdk.wallets.cosmos.connect(
    sdk.chains.cosmoshub,
  );
  const cosmoshubBalances = await sdk.wallets.cosmos.fetchBalances(
    sdk.chains.cosmoshub,
    cosmoshubAddress,
  );

  const photon = sdk.chains.cosmoshub.lookupAssetOrThrow("uphoton");

  const executable = sdk.bridges.ibc.transfer({
    fromAddress: cosmoshubAddress,
    fromChain: sdk.chains.cosmoshub,
    toAddress: sifAddress,
    toChain: sdk.chains.sifchain,
    assetAmount: AssetAmount(photon, toBaseUnits("1", photon)),
  });

  executable.execute();

  for await (const ev of executable.generator()) {
    console.log("event!", ev);
  }

  const bridgeTx = await executable.awaitResult();
  console.log("bridgeTx", bridgeTx);
  if (bridgeTx) {
    for await (const status of sdk.bridges.ibc.subscribeToTransfer(bridgeTx)) {
      console.log(status);
    }
  }
})();

/*

sdk.liquidity.getPools(): Promise<Pool[]>
sdk.liquidity.getPool(externalAsset: IAsset): Promise<Pool>

type SwapParams = {
  fromAmount: AssetAmount, 
  toAmount: AssetAmount,
  fromPool?: Pool,
  toPool?: Pool,
  slippage: number
}
sdk.liquidity.getSwapEstimate(params: SwapParams): { priceImpact, priceRatio, fee, minimumReceived  }
sdk.liquidity.swap(params: SwapParams): Promise<TransactionStatus>

sdk.liquidity.getAddLiquidityData(nativeAmount: AssetAmount, externalAmount: AssetAmount)
sdk.liquidity.addLiquidity(nativeAmount: AssetAmount, externalAmount: AssetAmount)
sdk.liquidity.getRemoveLiquidityData(nativeAmount: AssetAmount, externalAmount: AssetAmount)
sdk.liquidity.removeLiquidity(nativeAmount: AssetAmount, externalAmount: AssetAmount)

*/
