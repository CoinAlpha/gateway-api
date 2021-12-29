"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
function defer() {
    let resolve, reject;
    const promise = new Promise((_1, _2) => {
        resolve = _1;
        reject = _2;
    });
    return {
        promise,
        resolve: (t) => resolve === null || resolve === void 0 ? void 0 : resolve(t),
        reject: (err) => reject === null || reject === void 0 ? void 0 : reject(err),
    };
}
exports.defer = defer;
//# sourceMappingURL=defer.js.map