"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIteratorSubject = void 0;
const defer_1 = require("./defer");
function createIteratorSubject() {
    const buffer = [];
    let deferred = defer_1.defer();
    let aborted = false;
    function generate() {
        return __asyncGenerator(this, arguments, function* generate_1() {
            while (!aborted) {
                while (buffer.length) {
                    const value = buffer.shift();
                    if (value != null)
                        yield yield __await(value);
                }
                yield __await(deferred.promise);
            }
        });
    }
    function feed(value) {
        if (aborted)
            throw new Error("Cannot feed value after abort!");
        buffer.push(value);
        deferred === null || deferred === void 0 ? void 0 : deferred.resolve();
        deferred = defer_1.defer();
    }
    function end() {
        if (aborted)
            throw new Error("Already aborted");
        aborted = true;
        deferred === null || deferred === void 0 ? void 0 : deferred.resolve();
    }
    return {
        iterator: generate(),
        feed,
        end,
    };
}
exports.createIteratorSubject = createIteratorSubject;
//# sourceMappingURL=iteratorSubject.js.map