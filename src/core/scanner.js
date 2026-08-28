const fs = require('fs');
const path = require('path');
const { shouldIgnore } = require('../utils/ignore');

/**
 * Escanea recursivamente un directorio y construye la representación ASCII del árbol.
 * 
 * @param {string} dirPath - Ruta absoluta del directorio a escanear.
 * @param {string} prefix - Prefijo de indentación para recursión interna.
 * @returns {string} Texto formateado con la estructura ASCII.
 */
function buildTreeText(dirPath, prefix = '') {
  let result = '';
  let items = [];

  try {
    items = fs.readdirSync(dirPath);
  } catch (err) {
    return result;
  }

  // Filtrar carpetas y archivos ignorados (node_modules, .git, etc.)
  items = items.filter((item) => !shouldIgnore(item, path.join(dirPath, item)));

  // Ordenar: Directorios primero (alfabéticamente), luego archivos (alfabéticamente)
  items.sort((a, b) => {
    const aPath = path.join(dirPath, a);
    const bPath = path.join(dirPath, b);
    const aIsDir = fs.statSync(aPath).isDirectory();
    const bIsDir = fs.statSync(bPath).isDirectory();

    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const itemPath = path.join(dirPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    const connector = isLast ? '└── ' : '├── ';
    const displayName = isDirectory ? `${item}/` : item;

    result += `${prefix}${connector}${displayName}\n`;

    if (isDirectory) {
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      result += buildTreeText(itemPath, childPrefix);
    }
  });

  return result;
}

/**
 * Escanea un directorio y devuelve el contenido completo en bloque Markdown folderTree.
 * 
 * @param {string} sourceDir - Directorio de origen a escanear.
 * @returns {{ fullContent: string, treeBody: string, rootName: string }}
 */
function scanDirectoryToMarkdown(sourceDir) {
  const rootName = path.basename(sourceDir) + '/';
  const treeBody = buildTreeText(sourceDir);

  const fullContent = `# Project Structure\n\n\`\`\`folderTree\n${rootName}\n${treeBody.trimEnd()}\n\`\`\`\n`;

  return {
    rootName,
    treeBody,
    fullContent,
  };
}

module.exports = {
  buildTreeText,
  scanDirectoryToMarkdown,
  scanDirectory: buildTreeText,
};