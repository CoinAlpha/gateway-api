"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainIdHelper = void 0;
class ChainIdHelper {
    static parse(chainId) {
        const split = chainId
            .split(ChainIdHelper.VersionFormatRegExp)
            .filter(Boolean);
        if (split.length !== 2) {
            return {
                identifier: chainId,
                version: 0,
            };
        }
        else {
            return { identifier: split[0], version: parseInt(split[1]) };
        }
    }
    static hasChainVersion(chainId) {
        const version = ChainIdHelper.parse(chainId);
        return version.identifier !== chainId;
    }
}
exports.ChainIdHelper = ChainIdHelper;
// VersionFormatRegExp checks if a chainID is in the format required for parsing versions
// The chainID should be in the form: `{identifier}-{version}`
ChainIdHelper.VersionFormatRegExp = /(.+)-([\d]+)/;
//# sourceMappingURL=ChainIdHelper.js.map