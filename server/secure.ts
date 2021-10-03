import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const SECURITY_KEY = crypto.randomBytes(32);
const IV_BYTES = 16;
const IV_HEX_LEN = (IV_BYTES * 2) as 32;

/**
 * Encrypts a string. Uses a global key and a one-time initialization vector.
 * @param message The message to be encrypted.
 * @returns An encrypted version of {@linkcode message}.
 */
export function encrypt(message: string) {
  let initVector = crypto.randomBytes(IV_BYTES);
  let cipher = crypto.createCipheriv(ALGORITHM, SECURITY_KEY, initVector);

  let encrypted = cipher.update(message, "utf-8", "hex");
  encrypted += cipher.final("hex");
  encrypted = initVector.toString("hex") + encrypted;

  return encrypted;
}

/**
 * Decrypts a string encoded with {@linkcode encrypt}. Uses a global key and a one-time initialization vector.
 * @param message The message to be decrypted.
 * @returns An decrypted version of {@linkcode message}.
 */
export function decrypt(message: string) {
  let initVector = Buffer.from(message.substr(0, IV_HEX_LEN), "hex");
  let decipher = crypto.createDecipheriv(ALGORITHM, SECURITY_KEY, initVector);

  let decrypted = decipher.update(message.substr(IV_HEX_LEN), "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}

/**
 * Hashes a string.
 * @param message The message to be hashed.
 * @returns A hashed form of {@linkcode message}.
 */
export function hash(message: string) {
  try {
    let salt = crypto.randomBytes(IV_BYTES);
    let hash = crypto
      .createHash("sha256")
      .update(salt)
      .update(message)
      .digest("hex");

    return salt.toString("hex") + hash;
  } catch {
    return null;
  }
}

/**
 * Checks if a plaintext message matches a hash.
 * @param message The message that will be compared.
 * @param hashed The hash to compare against.
 * @returns A boolean indicating whether the hashes match.
 */
export function checkHash(message: string, hashed: string) {
  try {
    let salt = hashed.substr(0, IV_HEX_LEN);
    let hash = crypto
      .createHash("sha256")
      .update(salt, "hex")
      .update(message)
      .digest("hex");

    return hash == hashed.substr(IV_HEX_LEN);
  } catch {
    return false;
  }
}
