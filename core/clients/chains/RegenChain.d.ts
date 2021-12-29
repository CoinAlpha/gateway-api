import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class RegenChain extends BaseChain implements Chain {
    getBlockExplorerUrlForTxHash(hash: string): string;
}
