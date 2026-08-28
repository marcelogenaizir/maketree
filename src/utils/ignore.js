const { DEFAULT_IGNORE } = require('../constants');

const ignoreSet = new Set(DEFAULT_IGNORE);

/**
 * Determina si un archivo o directorio debe ser ignorado durante el escaneo.
 * 
 * @param {string} itemName - Nombre del archivo o carpeta.
 * @param {string} itemPath - Ruta completa.
 * @returns {boolean} True si debe ignorarse.
 */
function shouldIgnore(itemName, itemPath) {
  // Coincidencia con lista estática predeterminada
  if (ignoreSet.has(itemName)) {
    return true;
  }

  // Omitir carpetas ocultas comunes
  if (itemName.startsWith('.') && itemName !== '.env') {
    return true;
  }

  return false;
}

module.exports = {
  shouldIgnore,
};