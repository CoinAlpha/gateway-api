"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
function debounce(callback, wait) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(() => resolve(callback(...args)), wait);
        });
    };
}
exports.debounce = debounce;
//# sourceMappingURL=debounce.js.map