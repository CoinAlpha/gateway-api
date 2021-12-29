import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class PersistenceChain extends BaseChain implements Chain {
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(address: string): string;
}
