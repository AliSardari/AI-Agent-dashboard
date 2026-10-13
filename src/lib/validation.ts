import type { TranslationKey } from "../i18n/translations";

/**
 * Validators return a TranslationKey for the error message, or null when the
 * value is valid — so error strings stay bilingual and type-checked.
 */
export type FieldError = TranslationKey | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function validateRequired(
  value: string,
  error: TranslationKey = "auth.error.required",
): FieldError {
  return value.trim() ? null : error;
}

export function validateEmail(value: string): FieldError {
  const empty = validateRequired(value);
  if (empty) return empty;
  return isValidEmail(value) ? null : "auth.error.email";
}

export function validatePassword(value: string): FieldError {
  if (!value) return "auth.error.required";
  return value.length >= 8 ? null : "auth.error.password";
}

/** 0..3 — used by the strength meter on the sign-up form. */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score += 1;
  return Math.min(3, score) as 0 | 1 | 2 | 3;
}
