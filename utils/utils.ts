import { redirect } from "next/navigation";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Load from .env
const IV_LENGTH = 16; // AES block size is 16 bytes

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "ENCRYPTION_KEY is not set or is not a valid 64-character hexadecimal string."
  );
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Encrypts a given text using AES-256-CBC.
 * @param text The text to encrypt.
 * @returns The encrypted string in base64 format.
 */
export function encrypt(text: string): string {
  const algorithm: crypto.CipherGCMTypes = "aes-256-gcm";

  const key: crypto.CipherKey = Uint8Array.from(Buffer.from(ENCRYPTION_KEY, "hex"));
  const iv: crypto.BinaryLike = Uint8Array.from(crypto.randomBytes(IV_LENGTH));

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Combine IV, AuthTag, and Ciphertext into a single string
  return [
    Buffer.from(iv).toString("base64"),
    authTag.toString("base64"),
    encrypted,
  ].join(":");
}

/**
 * Decrypts a given encrypted string using AES-256-CBC.
 * @param encryptedText The encrypted text in base64 format.
 * @returns The decrypted string.
 */
export function decrypt(encrypted: string): string {
  const algorithm: crypto.CipherGCMTypes = "aes-256-gcm";

  // Split the encrypted string into its components
  const [iv, authTag, ciphertext] = encrypted.split(":");

  if (!iv || !authTag || !ciphertext) {
    throw new Error("Invalid encrypted format");
  }

  const key: crypto.CipherKey = Uint8Array.from(Buffer.from(ENCRYPTION_KEY, "hex"));
  const ivArray = Uint8Array.from(Buffer.from(iv, "base64"));
  const authTagArray = Uint8Array.from(Buffer.from(authTag, "base64"));

  const decipher = crypto.createDecipheriv(algorithm, key, ivArray);

  decipher.setAuthTag(authTagArray);

  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

