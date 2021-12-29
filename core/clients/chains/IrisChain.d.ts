import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class IrisChain extends BaseChain implements Chain {
    getBlockExplorerUrlForAddress(address: string): string;
    getBlockExplorerUrlForTxHash(hash: string): string;
}
