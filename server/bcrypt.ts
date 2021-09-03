import * as bcrypt from "bcryptjs";

/**
 * Hashes some text asynchronously.
 * @param text The string to hash.
 * @returns A promise resolving with the hashed string.
 */
export function hash(text: string) {
  return bcrypt.hash(text, 10);
}

/**
 * Compares some text with a hash.
 * @param text The plaintext string to check.
 * @param hash The hashed string to check against.
 * @returns A promise resolving with whether the strings match.
 */
export function check(text: string, hash: string) {
  return bcrypt.compare(text, hash);
}
