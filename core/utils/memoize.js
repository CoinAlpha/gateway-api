"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeSuccessfulPromise = exports.memoize = void 0;
function memoize(func, resolver) {
    if (typeof func != "function" ||
        (resolver != null && typeof resolver != "function")) {
        throw new TypeError("Invalid memo");
    }
    const cache = new Map();
    let memoized = (...args) => {
        let fn = (...args) => {
            const key = resolver ? resolver(...args) : args[0];
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func(...args);
            cache.set(key, result);
            return result;
        };
        memoized = fn;
        return fn(...args);
    };
    return memoized;
}
exports.memoize = memoize;
function memoizeSuccessfulPromise(func, resolver) {
    if (typeof func != "function" ||
        (resolver != null && typeof resolver != "function")) {
        throw new TypeError("Invalid memo");
    }
    const cache = new Map();
    let memoized = (...args) => {
        let fn = (...args) => {
            const key = resolver ? resolver(...args) : args[0];
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func(...args);
            cache.set(key, result);
            if (result === null || result === void 0 ? void 0 : result.catch) {
                result.catch((error) => {
                    cache.delete(key);
                    return Promise.reject(error);
                });
            }
            return result;
        };
        memoized = fn;
        return fn(...args);
    };
    return memoized;
}
exports.memoizeSuccessfulPromise = memoizeSuccessfulPromise;
//# sourceMappingURL=memoize.js.map