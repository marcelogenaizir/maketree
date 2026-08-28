const fs = require('fs');
const path = require('path');
const { parseMarkdownTree } = require('../core/parser');
const { buildTreeOnDisk } = require('../core/builder');
const { getClipboardText } = require('../utils/clipboard');
const { colors } = require('../utils/colors');

/**
 * Ejecuta el comando 'create' de MakeTree.
 * 
 * @param {string} source - Ruta al archivo .md o la bandera '--clipboard'.
 * @param {string} destination - Directorio de destino donde se creará la estructura.
 */
async function createCommand(source, destination) {
  let markdownContent = '';

  // 1. Obtener contenido Markdown (Archivo o Portapapeles)
  if (source === '--clipboard' || source === '-c') {
    console.log(colors.cyan('📋 Leyendo estructura desde el portapapeles...'));
    markdownContent = await getClipboardText();

    if (!markdownContent.trim()) {
      throw new Error('El portapapeles está vacío o no contiene texto válido.');
    }
  } else {
    const filePath = path.resolve(process.cwd(), source);

    if (!fs.existsSync(filePath)) {
      throw new Error(`No se encontró el archivo de origen: '${source}'`);
    }

    markdownContent = fs.readFileSync(filePath, 'utf-8');
  }

  // 2. Parsear el árbol desde el Markdown
  const nodes = parseMarkdownTree(markdownContent);

  if (!nodes || nodes.length === 0) {
    throw new Error('No se encontró ninguna estructura de árbol válida en el contenido proporcionado.');
  }

  console.log(`\n🚀 Generando estructura en: ${colors.yellow(destination)}\n`);

  // 3. Crear carpetas y archivos en disco
  const createdItems = buildTreeOnDisk(nodes, destination);

  // 4. Reporte en consola
  let filesCount = 0;
  let dirsCount = 0;

  createdItems.forEach((item) => {
    if (item.isDirectory) {
      dirsCount++;
      console.log(`${colors.blue('📁 Carpeta:')} ${item.relativePath}`);
    } else {
      filesCount++;
      console.log(`${colors.green('📄 Archivo:')} ${item.relativePath}`);
    }
  });

  console.log(`\n${colors.green(colors.bold('✅ ¡Estructura creada exitosamente!'))}`);
  console.log(colors.dim(`   Resumen: ${dirsCount} carpetas, ${filesCount} archivos.`));
}

module.exports = {
  createCommand
};