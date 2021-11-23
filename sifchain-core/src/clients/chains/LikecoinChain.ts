import {
  Chain,
  Network,
  AssetAmount,
  IAssetAmount,
  getChainsService,
} from "../../entities";
import { BaseChain } from "./_BaseChain";
import { urlJoin } from "url-join-ts";

export class LikecoinChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "transactions", hash);
  }
  getBlockExplorerUrlForAddress(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "accounts", hash);
  }
}
