import getKeplrProvider from "../../services/SifService/getKeplrProvider";
import { IAsset } from "../../entities";
import { Services } from "../../services";

type PickBus = Pick<Services["bus"], "dispatch">;
type PickSif = Pick<
  Services["sif"],
  "getState" | "signAndBroadcast" | "loadNativeDexClient" | "unSignedClient"
>;
type PickClp = Pick<Services["clp"], "removeLiquidity">;

type RemoveLiquidityServices = {
  bus: PickBus;
  sif: PickSif;
  clp: PickClp;
  tokenRegistry: Services["tokenRegistry"];
  wallet: Services["wallet"];
  chains: Services["chains"];
};

export function RemoveLiquidity({
  bus,
  sif,
  clp,
  tokenRegistry,
  wallet,
  chains,
}: RemoveLiquidityServices) {
  return async (asset: IAsset, wBasisPoints: string, asymmetry: string) => {
    const client = await sif.loadNativeDexClient();
    const externalAssetEntry = await tokenRegistry.findAssetEntryOrThrow(asset);
    const txDraft = client.tx.clp.RemoveLiquidity(
      {
        asymmetry,
        wBasisPoints,
        externalAsset: {
          symbol: externalAssetEntry.denom,
        },
        /*
         @mccallofthewild - This usecase (if we don't kill it altogether in lieu 
         of an all-powerful `NativeDexClient`) should really take in an address argument instead
         of reading state here. Leaving it now to speed up ledger implementation
        */
        signer: sif.getState().address,
      },
      sif.getState().address,
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
      bus.dispatch({
        type: "TransactionErrorEvent",
        payload: {
          txStatus,
          message: txStatus.memo || "There was an error removing liquidity",
        },
      });
    }

    return txStatus;
  };
}
