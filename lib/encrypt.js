const crypto = require('crypto');

module.exports = async function (payload, encryptKey) {
  const encodedKey = new TextEncoder().encode(encryptKey);
  const keyBytes = new Uint8Array(32);
  keyBytes.set(encodedKey.slice(0, 32), 0);
  const ivBuffer = await crypto.subtle.digest("SHA-256", encodedKey);
  const iv = ivBuffer.slice(0, 16);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedPayload
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(cipher)));
};
