import {
  Chain,
  Network,
  getChainsService,
  IAssetAmount,
  AssetAmount,
} from "../../entities";
import { BaseChain } from "./_BaseChain";
import { urlJoin } from "url-join-ts";
import { isOriginallySifchainNativeToken } from "../bridges/EthBridge/isOriginallySifchainNativeToken";

export class EthereumChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
  }
  getBlockExplorerUrlForAddress(address: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "address", address);
  }
}
