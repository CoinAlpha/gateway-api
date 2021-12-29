import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
export declare class CryptoOrgChain extends BaseChain implements Chain {
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(address: string): string;
}
