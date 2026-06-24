/**
 * ChakriFill - Local Encryption & Security Engine
 * Implements native, dependency-free AES-GCM 256-bit client-side encryption
 * for user profile data before saving to disk.
 */

window.ChakriFillSecurity = window.ChakriFillSecurity || {
  /**
   * Retrieves or generates a persistent, installation-unique 256-bit encryption key.
   */
  getOrCreateKey: async function() {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get("sys_sec_key");
      if (data.sys_sec_key) {
        return data.sys_sec_key;
      }
      // Generate a new 256-bit random hex key
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const keyHex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
      await chrome.storage.local.set({ "sys_sec_key": keyHex });
      return keyHex;
    } else {
      // Local storage fallback for dev/testing environment
      let keyHex = localStorage.getItem("sys_sec_key");
      if (!keyHex) {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        keyHex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem("sys_sec_key", keyHex);
      }
      return keyHex;
    }
  },

  /**
   * Derive a WebCrypto CryptoKey from a hex string key
   */
  getCryptoKey: async function(hexKey) {
    const rawKey = new Uint8Array(hexKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  },

  /**
   * Encrypts plaintext string to Base64 using AES-GCM 256-bit
   */
  encrypt: async function(plaintext, hexKey) {
    if (!plaintext) return "";
    try {
      const key = await this.getCryptoKey(hexKey);
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit random IV
      const encodedText = new TextEncoder().encode(plaintext);
      
      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedText
      );

      // Pack IV and ciphertext together
      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertext), iv.length);

      // Convert to binary string, then base64
      let binary = "";
      for (let i = 0; i < combined.byteLength; i++) {
        binary += String.fromCharCode(combined[i]);
      }
      return btoa(binary);
    } catch (e) {
      console.error("ChakriFill: Encryption failed:", e);
      return plaintext; // Fallback to raw plaintext on crypto failure to prevent data loss
    }
  },

  /**
   * Decrypts AES-GCM 256-bit Base64 ciphertext back to plaintext string
   */
  decrypt: async function(ciphertextBase64, hexKey) {
    if (!ciphertextBase64) return "";
    try {
      const key = await this.getCryptoKey(hexKey);
      const binary = atob(ciphertextBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error("ChakriFill: Decryption failed:", e);
      return null;
    }
  },

  /**
   * Encrypts a full profiles collection object
   */
  encryptProfiles: async function(profilesObj, hexKey) {
    if (!profilesObj) return null;
    const jsonStr = JSON.stringify(profilesObj);
    return await this.encrypt(jsonStr, hexKey);
  },

  /**
   * Decrypts a profiles collection object with automatic legacy fallback migration
   */
  decryptProfiles: async function(encryptedData, hexKey) {
    if (!encryptedData) return { "Default": {} };
    
    // If it's already a parsed object (legacy unencrypted storage), migrate/return as-is
    if (typeof encryptedData === "object") {
      return encryptedData;
    }

    try {
      const decryptedStr = await this.decrypt(encryptedData, hexKey);
      if (!decryptedStr) return { "Default": {} };
      return JSON.parse(decryptedStr);
    } catch (e) {
      console.error("ChakriFill: Failed parsing decrypted profiles:", e);
      return { "Default": {} };
    }
  },

  /**
   * Encrypts a single active profile object
   */
  encryptSingleProfile: async function(profileObj, hexKey) {
    if (!profileObj) return null;
    const jsonStr = JSON.stringify(profileObj);
    return await this.encrypt(jsonStr, hexKey);
  },

  /**
   * Decrypts a single profile object with automatic legacy fallback migration
   */
  decryptSingleProfile: async function(encryptedData, hexKey) {
    if (!encryptedData) return {};
    
    // If it's already a parsed object, migrate/return as-is
    if (typeof encryptedData === "object") {
      return encryptedData;
    }

    try {
      const decryptedStr = await this.decrypt(encryptedData, hexKey);
      if (!decryptedStr) return {};
      return JSON.parse(decryptedStr);
    } catch (e) {
      console.error("ChakriFill: Failed parsing decrypted profile:", e);
      return {};
    }
  }
};
