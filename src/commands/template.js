const fs = require('fs');
const path = require('path');
const { getTemplate, getAvailableTemplates } = require('../templates');
const { colors } = require('../utils/colors');

/**
 * Ejecuta el comando 'template' para generar un archivo .md prediseñado.
 * 
 * @param {string} templateName - Nombre o alias de la plantilla.
 */
async function templateCommand(templateName = 'default') {
  const template = getTemplate(templateName);

  if (!template) {
    const available = getAvailableTemplates()
      .map((t) => `${t.key}${t.aliases.length ? ` (${t.aliases.join(', ')})` : ''}`)
      .join(', ');
      
    throw new Error(
      `Plantilla '${templateName}' no encontrada.\nPlantillas disponibles: ${available}`
    );
  }

  const fileName = `${template.key}-architecture.md`;
  const outputPath = path.resolve(process.cwd(), fileName);

  if (fs.existsSync(outputPath)) {
    throw new Error(`El archivo '${fileName}' ya existe en el directorio actual.`);
  }

  fs.writeFileSync(outputPath, template.content, 'utf-8');

  console.log(`\n${colors.green(colors.bold('✅ Plantilla generada con éxito!'))}`);
  console.log(`📋 Plantilla: ${colors.yellow(template.description)}`);
  console.log(`📄 Archivo: ${colors.cyan(fileName)}`);
  console.log(
    colors.dim(`\nPuedes generar las carpetas inmediatamente ejecutando:\n$ mktree create ${fileName}`)
  );
}

module.exports = {
  templateCommand,
};