// === LÍMITES DE CARACTERES ===
export const LIMITS = {
  NAME: { MIN: 3, MAX: 30 },
  EMAIL: { MAX: 30 },
  PHONE: { EXACT: 10 },
  ADDRESS: { MAX_CHARS: 40, MAX_WORDS: 10 },
  PASSWORD: { MIN: 8, MAX: 15 },
};

// === EXPRESIONES REGULARES ===
export const REGEX = {
  NAME: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
  GMAIL: /^[a-zA-Z0-9._%-]+@gmail\.com$/,
  PHONE: /^\d{10}$/,
};

// === MENSAJES DE ERROR ===
export const ERROR_MESSAGES = {
  NAME: {
    REQUIRED: "El nombre es obligatorio",
    INVALID: "Solo letras y espacios",
    MIN: `Mínimo ${LIMITS.NAME.MIN} caracteres`,
    MAX: `Máximo ${LIMITS.NAME.MAX} caracteres`,
  },
  EMAIL: {
    REQUIRED: "El correo es obligatorio",
    INVALID: "Debe ser un correo @gmail.com",
    MAX: `Máximo ${LIMITS.EMAIL.MAX} caracteres`,
  },
  PHONE: {
    REQUIRED: "El teléfono es obligatorio",
    INVALID: `Debe tener exactamente ${LIMITS.PHONE.EXACT} dígitos`,
  },
  ADDRESS: {
    REQUIRED: "La dirección es obligatoria",
    MAX_WORDS: `Máximo ${LIMITS.ADDRESS.MAX_WORDS} palabras`,
    MAX_CHARS: `Máximo ${LIMITS.ADDRESS.MAX_CHARS} caracteres`,
  },
  PASSWORD: {
    REQUIRED: "La contraseña es obligatoria",
    MIN: `Mínimo ${LIMITS.PASSWORD.MIN} caracteres`,
    MAX: `Máximo ${LIMITS.PASSWORD.MAX} caracteres`,
    NO_MATCH: "Las contraseñas no coinciden",
    CONFIRM_REQUIRED: "Debe confirmar la contraseña",
  },
};
