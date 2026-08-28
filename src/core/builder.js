const fs = require('fs');
const path = require('path');

/**
 * Recibe la lista de nodos generados por el parser y construye la estructura en disco.
 * 
 * @param {Array<{ name: string, isDirectory: boolean, depth: number }>} nodes - Nodos del árbol.
 * @param {string} targetDir - Directorio de destino donde se creará la estructura.
 * @returns {Array<{ path: string, relativePath: string, isDirectory: boolean }>} Lista de elementos creados.
 */
function buildTreeOnDisk(nodes, targetDir) {
  const createdItems = [];
  const pathStack = [];

  for (const node of nodes) {
    // Mantener la pila de rutas sincronizada con el nivel de profundidad
    pathStack.length = node.depth;
    pathStack.push(node.name);

    const currentPath = path.join(targetDir, ...pathStack);
    const relativePath = path.relative(process.cwd(), currentPath);

    if (node.isDirectory) {
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      createdItems.push({
        path: currentPath,
        relativePath,
        isDirectory: true
      });
    } else {
      // Asegurar que las carpetas padre existan
      const parentDir = path.dirname(currentPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      // Crear archivo solo si no existe para evitar sobrescribir contenido
      if (!fs.existsSync(currentPath)) {
        fs.writeFileSync(currentPath, '');
      }

      createdItems.push({
        path: currentPath,
        relativePath,
        isDirectory: false
      });
    }
  }

  return createdItems;
}

module.exports = {
  buildTreeOnDisk
};