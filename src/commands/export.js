const fs = require('fs');
const path = require('path');
const { scanDirectoryToMarkdown } = require('../core/scanner');
const { colors } = require('../utils/colors');

/**
 * Ejecuta el comando 'export' de MakeTree.
 * 
 * @param {string} sourceDir - Directorio de origen a escanear.
 * @param {string} outputFile - Nombre o ruta del archivo .md de salida.
 */
async function exportCommand(sourceDir = process.cwd(), outputFile = 'tree.md') {
  const resolvedSourcePath = path.resolve(process.cwd(), sourceDir);

  if (!fs.existsSync(resolvedSourcePath)) {
    throw new Error(`El directorio especificado no existe: '${sourceDir}'`);
  }

  const stats = fs.statSync(resolvedSourcePath);
  if (!stats.isDirectory()) {
    throw new Error(`La ruta especificada no es un directorio: '${sourceDir}'`);
  }

  console.log(`\n🔍 Escaneando estructura en: ${colors.yellow(resolvedSourcePath)}...`);

  // 1. Escanear el directorio y construir la cadena Markdown
  const { fullContent, rootName } = scanDirectoryToMarkdown(resolvedSourcePath);

  // 2. Determinar la ruta de salida final
  const outputPath = path.isAbsolute(outputFile)
    ? outputFile
    : path.resolve(process.cwd(), outputFile);

  // 3. Escribir el archivo Markdown en disco
  fs.writeFileSync(outputPath, fullContent, 'utf-8');

  const relativeOutputPath = path.relative(process.cwd(), outputPath);

  console.log(`\n${colors.green(colors.bold('✅ ¡Estructura exportada exitosamente!'))}`);
  console.log(`📂 Raíz escaneada: ${colors.cyan(rootName)}`);
  console.log(`📄 Archivo generado: ${colors.cyan(relativeOutputPath || outputFile)}`);
}

module.exports = {
  exportCommand
};