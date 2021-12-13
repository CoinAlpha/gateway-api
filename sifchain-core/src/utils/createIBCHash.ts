export const createIBCHash = async (
  port: string,
  channelId: string,
  denom: string,
) => {
  const msgUint8 = new TextEncoder().encode(`${port}/${channelId}/${denom}`); // encode as (utf-8) Uint8Array

  if (typeof crypto === "undefined") {
    global.crypto = require("crypto").webcrypto; // Node.js support
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return "ibc/" + hashHex.toUpperCase();
};
