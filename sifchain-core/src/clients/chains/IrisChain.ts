import { Chain, Network, IAssetAmount } from "../../entities";
import { urlJoin } from "url-join-ts";
import { BaseChain } from "./_BaseChain";

export class IrisChain extends BaseChain implements Chain {
  getBlockExplorerUrlForAddress(address: string) {
    return this.chainConfig.blockExplorerUrl + `#/address/${address}`;
  }
  getBlockExplorerUrlForTxHash(hash: string) {
    return this.chainConfig.blockExplorerUrl + `#/tx?txHash=${hash}`;
  }
}
