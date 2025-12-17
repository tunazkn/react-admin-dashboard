// src/utils/validation.ts

// Email için Regex kalıbını sabit olarak tanımlıyoruz
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Bir email adresinin formatının doğru olup olmadığını kontrol eder.
 * @param email Kontrol edilecek email adresi
 * @returns Geçerli ise true, değilse false döner
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
