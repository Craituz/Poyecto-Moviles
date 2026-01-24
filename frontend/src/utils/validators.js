import { LIMITS, REGEX, ERROR_MESSAGES } from './constants';

// === VALIDADOR DE NOMBRE ===
export const validateName = (value) => {
  if (!value) return ERROR_MESSAGES.NAME.REQUIRED;
  if (!REGEX.NAME.test(value)) return ERROR_MESSAGES.NAME.INVALID;
  if (value.length < LIMITS.NAME.MIN) return ERROR_MESSAGES.NAME.MIN;
  if (value.length > LIMITS.NAME.MAX) return ERROR_MESSAGES.NAME.MAX;
  return "";
};

// === VALIDADOR DE EMAIL ===
export const validateEmail = (value) => {
  if (!value) return ERROR_MESSAGES.EMAIL.REQUIRED;
  if (!REGEX.GMAIL.test(value)) return ERROR_MESSAGES.EMAIL.INVALID;
  if (value.length > LIMITS.EMAIL.MAX) return ERROR_MESSAGES.EMAIL.MAX;
  return "";
};

// === VALIDADOR DE TELÉFONO ===
export const validatePhone = (value) => {
  if (!value) return ERROR_MESSAGES.PHONE.REQUIRED;
  if (value.length !== LIMITS.PHONE.EXACT) return ERROR_MESSAGES.PHONE.INVALID;
  return "";
};

// === VALIDADOR DE DIRECCIÓN ===
export const validateAddress = (value) => {
  if (!value) return ERROR_MESSAGES.ADDRESS.REQUIRED;
  const wordCount = value.trim().split(/\s+/).length;
  if (wordCount > LIMITS.ADDRESS.MAX_WORDS) return ERROR_MESSAGES.ADDRESS.MAX_WORDS;
  if (value.length > LIMITS.ADDRESS.MAX_CHARS) return ERROR_MESSAGES.ADDRESS.MAX_CHARS;
  return "";
};

// === VALIDADOR DE CONTRASEÑA ===
export const validatePassword = (value) => {
  if (!value) return ERROR_MESSAGES.PASSWORD.REQUIRED;
  if (value.length < LIMITS.PASSWORD.MIN) return ERROR_MESSAGES.PASSWORD.MIN;
  if (value.length > LIMITS.PASSWORD.MAX) return ERROR_MESSAGES.PASSWORD.MAX;
  return "";
};

// === VALIDADOR DE CONFIRMACIÓN DE CONTRASEÑA ===
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return ERROR_MESSAGES.PASSWORD.CONFIRM_REQUIRED;
  if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORD.NO_MATCH;
  return "";
};

// === SANITIZADOR DE TELÉFONO (solo números) ===
export const sanitizePhone = (text) => {
  return text.replace(/[^0-9]/g, '');
};

// === CONTADOR DE PALABRAS ===
export const countWords = (text) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};
