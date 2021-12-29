import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class EthereumChain extends BaseChain implements Chain {
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(address: string): string;
}
