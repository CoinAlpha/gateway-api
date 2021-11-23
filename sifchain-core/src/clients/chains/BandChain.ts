import {
  Chain,
  Network,
  AssetAmount,
  IAssetAmount,
  getChainsService,
} from "../../entities";
import { BaseChain } from "./_BaseChain";
import { urlJoin } from "url-join-ts";
import { calculateIBCExportFee } from "../../utils/ibcExportFees";

export class BandChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
  }
}
