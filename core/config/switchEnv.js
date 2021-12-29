'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.switchEnv = void 0;
// Designed to be run in the browser
const query_string_1 = __importDefault(require('query-string'));
const AppCookies_1 = require('./AppCookies');
const getEnv_1 = require('./getEnv');
function switchEnv({ location = '', cookies = AppCookies_1.AppCookies() }) {
  const parsed = query_string_1.default.parse(location.search);
  const env = parsed['_env'];
  if (typeof env === 'undefined' || env === null || Array.isArray(env)) {
    return;
  }
  if (getEnv_1.isNetworkEnvSymbol(env)) {
    cookies.setEnv(env);
    location.href = '/';
  }
  if (env === '_') {
    cookies.clearEnv();
    location.href = '/';
  }
}
exports.switchEnv = switchEnv;
//# sourceMappingURL=switchEnv.js.map
