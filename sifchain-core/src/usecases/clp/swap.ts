import { NativeDexClient } from "../../services/utils/SifClient/NativeDexClient";
import {
  Amount,
  Asset,
  AssetAmount,
  ErrorCode,
  getErrorMessage,
  IAsset,
  IAssetAmount,
  Network,
} from "../../entities";
import { Services } from "../../services";
import { ReportTransactionError } from "../utils";
import getKeplrProvider from "../../services/SifService/getKeplrProvider";

export type SwapArgs = Pick<
  Services,
  "bus" | "sif" | "clp" | "ibc" | "tokenRegistry" | "wallet" | "chains"
>;
export function Swap({
  bus,
  sif,
  clp,
  ibc,
  tokenRegistry,
  wallet,
  chains,
}: SwapArgs) {
  return async (
    sentAmount: IAssetAmount,
    receivedAsset: IAsset,
    minimumReceived: IAssetAmount,
  ) => {
    const reportTransactionError = ReportTransactionError(bus);
    const client = await sif.loadNativeDexClient();

    const address = await wallet.keplrProvider.connect(chains.nativeChain);
    if (!address) throw new Error("No from address provided for swap");

    const tx = client.tx.clp.Swap(
      {
        sentAsset: {
          symbol: (await tokenRegistry.findAssetEntryOrThrow(sentAmount.asset))
            .denom,
        },
        receivedAsset: {
          symbol: (await tokenRegistry.findAssetEntryOrThrow(receivedAsset))
            .denom,
        },
        signer: address,
        sentAmount: sentAmount.toBigInt().toString(),
        minReceivingAmount: minimumReceived.toBigInt().toString(),
      },
      address,
    );

    const signed = await wallet.keplrProvider.sign(chains.nativeChain, tx);
    const sent = await wallet.keplrProvider.broadcast(
      chains.nativeChain,
      signed,
    );
    const txStatus = wallet.keplrProvider.parseTxResultToStatus(sent);

    if (txStatus.state !== "accepted") {
      // Edge case where we have run out of native balance and need to represent that
      if (
        txStatus.code === ErrorCode.TX_FAILED_USER_NOT_ENOUGH_BALANCE &&
        sentAmount.symbol === "rowan"
      ) {
        return reportTransactionError({
          ...txStatus,
          code: ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS,
          memo: getErrorMessage(
            ErrorCode.TX_FAILED_NOT_ENOUGH_ROWAN_TO_COVER_GAS,
          ),
        });
      }

      return reportTransactionError(txStatus);
    }

    return txStatus;
  };
}
