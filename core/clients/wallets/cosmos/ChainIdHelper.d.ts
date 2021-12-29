export declare class ChainIdHelper {
    static readonly VersionFormatRegExp: RegExp;
    static parse(chainId: string): {
        identifier: string;
        version: number;
    };
    static hasChainVersion(chainId: string): boolean;
}
