import {IBCBridge} from "./IBCBridge";
import {IAsset, AssetAmount} from "../../../entities";
import {SifchainChain, AkashChain} from "../../../clients/chains";
import {getSdkConfig} from "../../../utils/getSdkConfig";
import {NetworkEnv} from "../../../config/getEnv";
import {BridgeParams} from "../BaseBridge";
import {DirectSecp256k1HdWalletProvider} from "../../wallets/cosmos/DirectSecp256k1HdWalletProvider";
import {toBaseUnits} from "../../../utils";

import {Random, Bip39} from "@cosmjs/crypto";
import {runRowanFaucet} from "./testFaucets";
import {AKASH_TESTNET} from "../../../config/chains/akash/akash-testnet";
import {SIFCHAIN_TESTNET} from "../../../config/chains/sifchain/sifchain-testnet";

const createMnemonic = (length: number = 24) => {
  const entropyLength = 4 * Math.floor((11 * length) / 33);
  const entropy = Random.getBytes(entropyLength);
  const mnemonic = Bip39.encode(entropy);
  return mnemonic;
};

let setup = async () => {
  const config = getSdkConfig({
    environment: NetworkEnv.TESTNET,
  });
  const bridge = new IBCBridge(config);

  // @ts-ignore
  SIFCHAIN_TESTNET.keplrChainInfo.gasPriceStep = {
    low: "2500000000000000000",
    medium: "2500000000000000000",
    high: "2500000000000000000",
  };

  const chains = {
    native: new SifchainChain({
      assets: config.assets,
      chainConfig: SIFCHAIN_TESTNET,
    }),
    counterparty: new AkashChain({
      assets: config.assets,
      chainConfig: AKASH_TESTNET,
    }),
  };

  const wallet = new DirectSecp256k1HdWalletProvider(config, {
    mnemonic: createMnemonic().toString(),
  });
  const nativeAddress = await wallet.connect(chains.native);
  const counterpartyAddress = await wallet.connect(chains.counterparty);

  console.log({nativeAddress, counterpartyAddress});

  try {
    await Promise.all([
      runRowanFaucet(nativeAddress),
      // runAkashFaucet(counterpartyAddress),
    ]);
  } catch (error) {
    console.error(error);
  }
  console.log(
    (await wallet.fetchBalances(chains.native, nativeAddress)).map((s) =>
      s.toString(),
    ),
  );
  console.log(
    (await wallet.fetchBalances(chains.counterparty, counterpartyAddress)).map(
      (s) => s.toString(),
    ),
  );

  return {bridge, chains, wallet, nativeAddress, counterpartyAddress};
};

describe("IBCBridge", () => {
  let setupPromise: ReturnType<typeof setup>;
  beforeAll(async () => {
    setupPromise = setup();
  });

  test("it transfers into sifchain", async () => {
    const {wallet, chains, bridge, nativeAddress, counterpartyAddress} =
      await setupPromise;

    const counterpartyAsset = chains.counterparty.lookupAssetOrThrow(
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );
    const decimalAmount = toBaseUnits("0.001", counterpartyAsset);
    const importParams: BridgeParams = {
      fromChain: chains.counterparty,
      toChain: chains.native,
      assetAmount: AssetAmount(counterpartyAsset, decimalAmount),
      fromAddress: counterpartyAddress,
      toAddress: nativeAddress,
    };

    const nativeBalanceOfCounterAsset = await wallet.fetchBalance(
      chains.native,
      nativeAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );

    expect(+nativeBalanceOfCounterAsset.amount.toBigInt().toString()).toEqual(
      0,
    );

    const bridgeTx = await bridge.transfer(wallet, importParams);
    expect(bridgeTx.assetAmount.toString()).toEqual(
      importParams.assetAmount.toString(),
    );
    expect(bridgeTx.fromChain).toBe(importParams.fromChain);
    expect(bridgeTx.toChain).toBe(importParams.toChain);

    const result = await bridge.waitForTransferComplete(wallet, bridgeTx);
    expect(result).toEqual(true);

    const newCounterpartyNativeBalance = await wallet.fetchBalance(
      chains.native,
      nativeAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );
    expect(newCounterpartyNativeBalance.toBigInt().toString()).toEqual(
      decimalAmount,
    );
  });

  test("it transfers out of sifchain", async () => {
    const {wallet, chains, bridge, nativeAddress, counterpartyAddress} =
      await setupPromise;

    const nativeBalanceOfCounterAsset = await wallet.fetchBalance(
      chains.native,
      nativeAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );
    const decimalAmount = nativeBalanceOfCounterAsset.toBigInt().toString();
    const exportParams: BridgeParams = {
      fromChain: chains.native,
      toChain: chains.counterparty,
      assetAmount: nativeBalanceOfCounterAsset,
      fromAddress: nativeAddress,
      toAddress: counterpartyAddress,
    };

    const counterpartyBalance = await wallet.fetchBalance(
      chains.counterparty,
      counterpartyAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );

    const bridgeTx = await bridge.transfer(wallet, exportParams);
    expect(bridgeTx.assetAmount.toString()).toEqual(
      exportParams.assetAmount.toString(),
    );
    expect(bridgeTx.fromChain).toBe(exportParams.fromChain);
    expect(bridgeTx.toChain).toBe(exportParams.toChain);

    const result = await bridge.waitForTransferComplete(wallet, bridgeTx);
    expect(result).toEqual(true);

    const newNativeCounterpartyBalance = await wallet.fetchBalance(
      chains.native,
      nativeAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );
    const newCounterpartyBalance = await wallet.fetchBalance(
      chains.counterparty,
      counterpartyAddress,
      chains.counterparty.chainConfig.nativeAssetSymbol,
    );
    expect(
      newNativeCounterpartyBalance.toBigInt().toString().charAt(0),
    ).toEqual("0");
    expect(newCounterpartyBalance.toString()).toEqual(
      counterpartyBalance.add(decimalAmount).toString(),
    );
  });
});
