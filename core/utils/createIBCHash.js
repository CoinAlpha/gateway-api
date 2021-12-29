'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createIBCHash = void 0;
exports.createIBCHash = (port, channelId, denom) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const msgUint8 = new TextEncoder().encode(`${port}/${channelId}/${denom}`); // encode as (utf-8) Uint8Array
    if (typeof crypto === 'undefined') {
      global.crypto = require('crypto').webcrypto; // Node.js support
    }
    const hashBuffer = yield crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''); // convert bytes to hex string
    return 'ibc/' + hashHex.toUpperCase();
  });
// @ts-ignore
// window.createIBCHash = exports.createIBCHash;
//# sourceMappingURL=createIBCHash.js.map
