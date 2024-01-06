const crypto = require('crypto');

module.exports = async function (encryptedPayload, decryptKey) {
  const cipherBytes = new Uint8Array(
    atob(encryptedPayload)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const encodedKey = new TextEncoder().encode(decryptKey);
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
  const decryptedPayload = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    cipherBytes
  );
  return JSON.parse(new TextDecoder().decode(decryptedPayload));
};
