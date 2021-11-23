import { Chain, Network, IAssetAmount } from "../../entities";
import { BaseChain } from "./_BaseChain";
import { calculateIBCExportFee } from "../../utils/ibcExportFees";

export class TerraChain extends BaseChain implements Chain {
  getBlockExplorerUrlForAddress(address: string) {
    return this.chainConfig.blockExplorerUrl + `#/address/${address}`;
  }
  getBlockExplorerUrlForTxHash(hash: string) {
    return this.chainConfig.blockExplorerUrl + `#/tx/${hash}`;
  }
}
