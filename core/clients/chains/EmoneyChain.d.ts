import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class EmoneyChain extends BaseChain implements Chain {
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(hash: string): string;
}
