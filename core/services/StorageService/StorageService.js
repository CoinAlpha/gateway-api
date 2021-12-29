"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStorageService(ctx) {
    let storageAllowed = true;
    try {
        window.localStorage.setItem("__siftest", "true");
        window.localStorage.removeItem("__siftest");
    }
    catch (error) {
        storageAllowed = false;
    }
    if (storageAllowed) {
        return {
            getJSONItem(key) {
                try {
                    const res = JSON.parse(window.localStorage.getItem(key) || "'EMPTY_'");
                    if (res === "EMPTY_")
                        return undefined;
                    return res;
                }
                catch (error) {
                    return undefined;
                }
            },
            setJSONItem(key, value) {
                window.localStorage.setItem(key, JSON.stringify(value));
            },
            getItem: (key) => {
                return window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
                window.localStorage.setItem(key, value);
            },
        };
    }
    else {
        let storage = new Map();
        return {
            getJSONItem(key) {
                if (!storage.has(key))
                    return undefined;
                const res = JSON.parse(storage.get(key));
                return res;
            },
            setJSONItem(key, value) {
                storage.set(key, JSON.stringify(value));
            },
            getItem: (key) => {
                return String(storage.get(key));
            },
            setItem: (key, value) => {
                storage.set(key, value);
            },
        };
    }
}
exports.default = createStorageService;
//# sourceMappingURL=StorageService.js.map