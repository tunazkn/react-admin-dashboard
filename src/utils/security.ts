// src/utils/security.ts

/**
 * Girilen metni SHA-256 algoritması ile şifreler (Hashler).
 * Bu işlem asenkron olduğu için Promise döner.
 */

export const hashPassword = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};