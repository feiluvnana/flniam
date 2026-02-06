import { randomBytes } from "node:crypto";

export class Generators {
  static id(prefix: string): string {
    const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let result = "";
    let timestamp = Date.now();
    for (let i = 0; i < 7; i++) {
      result = ALPHABET[timestamp & 63] + result;
      timestamp >>>= 6;
    }
    const bytes = randomBytes(14);
    for (let i = 0; i < 10; i++) {
      result += ALPHABET[bytes[i] & 63];
    }
    return `${prefix}_${result}`;
  }
}
