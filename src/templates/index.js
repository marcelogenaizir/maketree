const defaultTemplate = require('./default');
const reactTemplate = require('./react');
const nodeTemplate = require('./node');
const fastapiTemplate = require('./fastapi');
const goDddTemplate = require('./go-ddd');

const templatesList = [
  defaultTemplate,
  reactTemplate,
  nodeTemplate,
  fastapiTemplate,
  goDddTemplate,
];

/**
 * Busca una plantilla por clave exacta o por alias.
 * @param {string} name - Nombre o alias de la plantilla.
 */
function getTemplate(name = 'default') {
  const normalized = name.toLowerCase();
  return templatesList.find(
    (t) => t.key === normalized || (t.aliases && t.aliases.includes(normalized))
  );
}

/**
 * Devuelve la lista completa de plantillas disponibles con sus metadatos.
 */
function getAvailableTemplates() {
  return templatesList.map((t) => ({
    key: t.key,
    description: t.description,
    aliases: t.aliases || [],
  }));
}

module.exports = {
  getTemplate,
  getAvailableTemplates,
};