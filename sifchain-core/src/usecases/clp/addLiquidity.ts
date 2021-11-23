import {
  ErrorCode,
  getErrorMessage,
  IAssetAmount,
  Asset,
} from "../../entities";
import { Services } from "../../services";
import { Store } from "../../store";
import { PoolStore } from "../../store/pools";
import { ReportTransactionError } from "../utils";
import { createPoolKey } from "../../utils";
import { NativeDexClient } from "../../services/utils/SifClient/NativeDexClient";
import getKeplrProvider from "../../services/SifService/getKeplrProvider";

type PickBus = Pick<Services["bus"], "dispatch">;
type PickSif = Pick<
  Services["sif"],
  "getState" | "signAndBroadcast" | "unSignedClient" | "loadNativeDexClient"
>;
type PickClp = Pick<Services["clp"], "addLiquidity" | "createPool">;

function findPool(
  pools: PoolStore,
  nativeSymbol: string,
  externalSymbol: string,
) {
  return pools[createPoolKey(nativeSymbol, externalSymbol)] ?? null;
}

type AddLiquidityServices = {
  bus: PickBus;
  sif: PickSif;
  clp: PickClp;
  ibc: Services["ibc"];
  wallet: Services["wallet"];
  tokenRegistry: Services["tokenRegistry"];
  chains: Services["chains"];
};

type AddLiquidityStore = Pick<Store, "pools">;

export function AddLiquidity(
  { bus, clp, sif, ibc, tokenRegistry, wallet, chains }: AddLiquidityServices,
  store: AddLiquidityStore,
) {
  return async (
    nativeAssetAmount: IAssetAmount,
    externalAssetAmount: IAssetAmount,
  ) => {
    const client = await sif.loadNativeDexClient();
    const address = await wallet.keplrProvider.connect(chains.nativeChain);
    const externalAssetEntry = await tokenRegistry.findAssetEntryOrThrow(
      externalAssetAmount.asset,
    );
    const hasPool = !!findPool(
      store.pools,
      nativeAssetAmount.asset.symbol,
      externalAssetAmount.asset.symbol,
    );
    const reportTransactionError = ReportTransactionError(bus);
    const state = sif.getState();
    if (!state.address) throw "No from address provided for swap";

    const txDraft = hasPool
      ? client.tx.clp.AddLiquidity(
          {
            externalAsset: {
              symbol: externalAssetEntry.denom,
            },
            externalAssetAmount: externalAssetAmount.toBigInt().toString(),
            nativeAssetAmount: nativeAssetAmount.toBigInt().toString(),
            signer: address,
          },
          address,
        )
      : client.tx.clp.CreatePool(
          {
            externalAsset: {
              symbol: externalAssetEntry.denom,
            },
            externalAssetAmount: externalAssetAmount.toBigInt().toString(),
            nativeAssetAmount: nativeAssetAmount.toBigInt().toString(),
            signer: address,
          },
          address,
        );

    const signedTx = await wallet.keplrProvider.sign(
      chains.nativeChain,
      txDraft,
    );
    const sentTx = await wallet.keplrProvider.broadcast(
      chains.nativeChain,
      signedTx,
    );
    const txStatus = client.parseTxResult(sentTx);
    if (txStatus.state !== "accepted") {
      // Edge case where we have run out of native balance and need to represent that
      if (txStatus.code === ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE) {
        return reportTransactionError({
          ...txStatus,
          code: ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS,
          memo: getErrorMessage(
            ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS,
          ),
        });
      }
    }
    return txStatus;
  };
}
