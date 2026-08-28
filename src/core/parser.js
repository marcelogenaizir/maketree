/**
 * Expresión regular para detectar bloques de código en Markdown.
 * Soporta etiquetas: folderTree, tree, text o bloques genéricos sin lenguaje.
 */
const CODE_BLOCK_REGEX = /```(?:folderTree|tree|text)?\s*([\s\S]*?)```/gi;

/**
 * Elimina comentarios inline (# o //) y limpia espacios especiales.
 * @param {string} line - Línea original.
 * @returns {string} Línea sin comentarios y sanitizada.
 */
function sanitizeLine(line) {
  // 1. Normalizar espacios de no separación (nbsp \u00A0) a espacios estándar
  let clean = line.replace(/\u00a0/g, ' ');

  // 2. Remover comentarios al final de la línea (# o //)
  // Nota: Preserva el '#' si la línea completa es solo un título Markdown
  if (!clean.trim().startsWith('#')) {
    clean = clean.split('#')[0].split('//')[0];
  }

  return clean.trimEnd();
}

/**
 * Elimina caracteres de dibujo ASCII/Unicode y extrae el nombre y la indentación.
 * @param {string} line - Línea de texto sanitizada.
 * @returns {string} Nombre limpio del archivo/directorio.
 */
function cleanNodeName(line) {
  const sanitized = sanitizeLine(line);

  return sanitized
    .replace(/[\uFFFD\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[│├└─|-]/g, '')
    .trim();
}

/**
 * Calcula la profundidad del nodo basándose en la sangría y estructura de la línea.
 * @param {string} line - Línea sanitizada.
 * @returns {number} Nivel de profundidad (0 es la raíz).
 */
function calculateDepth(line) {
  const sanitized = sanitizeLine(line);
  const cleanName = cleanNodeName(sanitized);
  if (!cleanName) return 0;

  const prefix = sanitized.substring(0, sanitized.indexOf(cleanName));

  // Cuenta patrones comunes de indentación en diagramas ASCII (4 espacios, │   , ├──, etc.)
  const indentMatches = prefix.match(/(│\s{3}|\s{4}|\t|├──|└──|\|--)/g);
  return indentMatches ? indentMatches.length : 0;
}

/**
 * Extrae el bloque de texto del árbol dentro de un archivo Markdown.
 * @param {string} markdownContent - Contenido raw del archivo .md
 * @returns {string} String con las líneas del árbol extraído.
 */
function extractTreeText(markdownContent) {
  const matches = [...markdownContent.matchAll(CODE_BLOCK_REGEX)];

  if (matches.length > 0) {
    return matches[0][1].trim();
  }

  return markdownContent.trim();
}

/**
 * Parsea el contenido de un Markdown y genera un array estructurado de nodos.
 * 
 * @param {string} markdownContent - Texto completo del archivo Markdown.
 * @returns {Array<{ name: string, isDirectory: boolean, depth: number, raw: string }>}
 */
function parseMarkdownTree(markdownContent) {
  const treeText = extractTreeText(markdownContent);
  const lines = treeText.split('\n');

  const nodes = [];

  for (const rawLine of lines) {
    const line = sanitizeLine(rawLine);
    const name = cleanNodeName(line);

    // Ignorar líneas vacías o títulos/comentarios de línea completa
    if (!name || name.startsWith('#')) continue;

    // Un nodo es directorio si termina en '/', o no tiene extensión de archivo
    const isDirectory = name.endsWith('/') || (!name.includes('.') && !name.startsWith('.'));
    const cleanNameWithoutSlash = name.replace(/\/$/, '');
    const depth = calculateDepth(line);

    nodes.push({
      name: cleanNameWithoutSlash,
      isDirectory,
      depth,
      raw: rawLine,
    });
  }

  return nodes;
}

module.exports = {
  parseMarkdownTree,
  cleanNodeName,
  calculateDepth,
  extractTreeText,
};