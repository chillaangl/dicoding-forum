import "@testing-library/jest-dom";
import "whatwg-fetch";

// Polyfill Node/JSDOM
import { TextEncoder, TextDecoder } from "util";

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// Polyfill BroadcastChannel untuk MSW v2
if (typeof global.BroadcastChannel === "undefined") {
  class DummyBroadcastChannel {
    constructor() {}

    postMessage() {}

    close() {}

    addEventListener() {}

    removeEventListener() {}
  }
  global.BroadcastChannel = DummyBroadcastChannel;
}

// Jika ada window.crypto yang diperlukan oleh lib tertentu
if (!global.crypto) {
  try {
    global.crypto = { getRandomValues: (arr) => require("crypto").webcrypto.getRandomValues(arr) };
  } catch (e) {
    // Fallback jika crypto tidak tersedia
    global.crypto = { getRandomValues: (arr) => arr };
  }
}
