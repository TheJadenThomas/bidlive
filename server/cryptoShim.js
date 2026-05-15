const { webcrypto } = require('node:crypto');

globalThis.crypto = webcrypto;
