// src/utils/colors.js

/**
 * Detecta si la terminal soporta color
 */
const supportsColor =
  process.stdout.isTTY &&
  !process.env.NO_COLOR &&
  process.env.TERM !== 'dumb';

/**
 * Envuelve el texto con los códigos de escape ANSI si los colores están soportados
 * @param {string} open - Código de inicio ANSI
 * @param {string} close - Código de cierre ANSI
 * @returns {Function} Función formateadora de texto
 */
function format(open, close) {
  return (text) => (supportsColor ? `${open}${text}${close}` : text);
}

const colors = {
  // Estilos
  bold: format('\x1b[1m', '\x1b[22m'),
  dim: format('\x1b[2m', '\x1b[22m'),
  italic: format('\x1b[3m', '\x1b[23m'),
  underline: format('\x1b[4m', '\x1b[24m'),

  // Colores de texto principales
  red: format('\x1b[31m', '\x1b[39m'),
  green: format('\x1b[32m', '\x1b[39m'),
  yellow: format('\x1b[33m', '\x1b[39m'),
  blue: format('\x1b[34m', '\x1b[39m'),
  magenta: format('\x1b[35m', '\x1b[39m'),
  cyan: format('\x1b[36m', '\x1b[39m'),
  white: format('\x1b[37m', '\x1b[39m'),
  gray: format('\x1b[90m', '\x1b[39m'),

  // Fondos
  bgRed: format('\x1b[41m', '\x1b[49m'),
  bgGreen: format('\x1b[42m', '\x1b[49m'),
  bgYellow: format('\x1b[43m', '\x1b[49m'),
  bgBlue: format('\x1b[44m', '\x1b[49m'),
};

module.exports = { colors };