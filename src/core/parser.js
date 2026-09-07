/**
 * Expresión regular para detectar bloques de código en Markdown.
 *
 * Soporta:
 *   ```folderTree
 *   ```tree
 *   ```text
 *   ```plaintext
 *   ```txt
 *   ``` 
 *
 * También permite bloques genéricos de código, como los que
 * ChatGPT puede generar sin especificar lenguaje.
 */
const CODE_BLOCK_REGEX =
  /```(?:folderTree|tree|text|plaintext|txt)?\s*([\s\S]*?)```/gi;

/**
 * Expresiones utilizadas para reconocer conectores de árboles.
 */
const CONNECTOR_REGEX = /^(.*?)(?:├──|└──|│--|\|--|`--|└─|├─)\s*/;

/**
 * Elimina comentarios inline (# o //) y limpia espacios especiales.
 *
 * @param {string} line - Línea original.
 * @returns {string} Línea sin comentarios y sanitizada.
 */
function sanitizeLine(line) {
  // Normalizar espacios de no separación (NBSP)
  let clean = line.replace(/\u00a0/g, ' ');

  /*
   * Remover comentarios al final de la línea.
   *
   * IMPORTANTE:
   * No eliminamos '#' cuando la línea completa comienza con '#',
   * porque puede ser un título Markdown.
   */
  if (!clean.trim().startsWith('#')) {
    clean = clean.split('#')[0].split('//')[0];
  }

  return clean.trimEnd();
}

/**
 * Elimina caracteres de dibujo de árboles sin destruir
 * caracteres válidos de los nombres.
 *
 * IMPORTANTE:
 *
 * NO eliminamos "-".
 *
 * Esto permite conservar correctamente:
 *
 *   embedding-models
 *   all-MiniLM-L6-v2
 *   docker-compose.yml
 *   user-controller.go
 *
 * @param {string} line - Línea original.
 * @returns {string} Nombre limpio del nodo.
 */
function cleanNodeName(line) {
  const sanitized = sanitizeLine(line);

  return sanitized
    // Caracteres inválidos/control.
    .replace(/[\uFFFD\u0000-\u001F\u007F-\u009F]/g, '')

    // Caracteres utilizados para dibujar árboles.
    // NO incluye "-".
    .replace(/[│├└─]/g, '')

    // Conectores ASCII.
    .replace(/^\s*(?:\|--|`--|├--|└--)\s*/, '')

    .trim();
}

/**
 * Extrae la parte de indentación de una línea.
 *
 * Ejemplos:
 *
 *   ├── app/
 *   │   ├── embedding/
 *   │   │   └── model.go
 *
 * devuelve respectivamente:
 *
 *   ""
 *   "│   "
 *   "│   │   "
 *
 * También soporta árboles ASCII:
 *
 *   |-- app/
 *   |   |-- src/
 *   |   `-- main.go
 *
 * @param {string} line
 * @returns {string}
 */
function extractIndentation(line) {
  const sanitized = sanitizeLine(line);

  /*
   * Buscar el primer conector.
   */
  const connectorMatch = sanitized.match(
    /(?:├──|└──|│--|\|--|`--|├─|└─)/
  );

  if (connectorMatch) {
    return sanitized.substring(0, connectorMatch.index);
  }

  /*
   * Si no existe conector, todo el prefijo de espacios/tabs
   * se considera indentación.
   */
  const match = sanitized.match(/^[\t ]*/);

  return match ? match[0] : '';
}

/**
 * Calcula la profundidad de un árbol.
 *
 * Soporta:
 *
 * Unicode:
 *
 *   project/
 *   ├── app/
 *   │   ├── controllers/
 *   │   │   └── user.go
 *
 * ASCII:
 *
 *   project/
 *   |-- app/
 *   |   |-- controllers/
 *   |   `-- user.go
 *
 * Solamente espacios:
 *
 *   project/
 *       app/
 *           main.go
 *
 * IMPORTANTE:
 *
 * ├── y └── son conectores, NO niveles.
 *
 * @param {string} line - Línea del árbol.
 * @returns {number} Nivel de profundidad.
 */
function calculateDepth(line) {
  const sanitized = sanitizeLine(line);

  if (!sanitized.trim()) {
    return 0;
  }

  const indentation = extractIndentation(sanitized);

  if (!indentation) {
    return 0;
  }

  let depth = 0;

  /*
   * Formato Unicode:
   *
   *   │   = 1 nivel
   *
   * Formato de cuatro espacios:
   *
   *       = 1 nivel
   *
   * Tab:
   *
   *   \t = 1 nivel
   */
  for (let i = 0; i < indentation.length;) {
    if (indentation.startsWith('│   ', i)) {
      depth++;
      i += 4;
      continue;
    }

    if (indentation.startsWith('    ', i)) {
      depth++;
      i += 4;
      continue;
    }

    if (indentation.startsWith('|   ', i)) {
      depth++;
      i += 4;
      continue;
    }

    if (indentation[i] === '\t') {
      depth++;
      i++;
      continue;
    }

    /*
     * Un "│" aislado puede aparecer como línea vertical
     * de separación.
     */
    if (indentation[i] === '│' || indentation[i] === '|') {
      i++;
      continue;
    }

    i++;
  }

  return depth;
}

/**
 * Extrae el bloque de texto del árbol dentro de un Markdown.
 *
 * Si existe un bloque de código, utiliza el primer bloque.
 *
 * Si no existe, intenta interpretar todo el contenido como árbol.
 *
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
 * Determina si una línea representa solamente un separador
 * visual del árbol.
 *
 * Ejemplo:
 *
 *   │
 *
 *   |
 *
 *   ├────────────
 *
 * @param {string} line
 * @returns {boolean}
 */
function isTreeSeparator(line) {
  const clean = line.trim();

  if (!clean) {
    return true;
  }

  return (
    clean === '│' ||
    clean === '|' ||
    /^├─+$/.test(clean) ||
    /^└─+$/.test(clean) ||
    /^\|[-]+$/.test(clean)
  );
}

/**
 * Determina si una línea es un placeholder.
 *
 * ChatGPT puede generar:
 *
 *   └── ...
 *   └── etc.
 *   └── <more files>
 *
 * Estos elementos no representan archivos reales.
 *
 * @param {string} name
 * @returns {boolean}
 */
function isPlaceholder(name) {
  const normalized = name.trim().toLowerCase();

  return (
    normalized === '...' ||
    normalized === '…' ||
    normalized === 'etc.' ||
    normalized === 'etc' ||
    normalized === '<more files>' ||
    normalized === '<more>' ||
    normalized === '[...]'
  );
}

/**
 * Determina si un nodo es un directorio.
 *
 * Reglas:
 *
 *   app/                   → directory
 *   src/                   → directory
 *   embedding-models/     → directory
 *   all-MiniLM-L6-v2/     → directory
 *
 *   model.go               → file
 *   docker-compose.yml     → file
 *   README.md              → file
 *
 * Para nombres sin extensión:
 *
 *   Dockerfile
 *   Makefile
 *   LICENSE
 *
 * mantenemos la regla histórica del parser:
 * "sin extensión" => directorio.
 *
 * @param {string} name
 * @returns {boolean}
 */
function isDirectoryName(name) {
  return (
    name.endsWith('/') ||
    (!name.includes('.') && !name.startsWith('.'))
  );
}

/**
 * Parsea el contenido de un Markdown y genera un array estructurado
 * de nodos.
 *
 * @param {string} markdownContent
 *
 * @returns {Array<{
 *   name: string,
 *   isDirectory: boolean,
 *   depth: number,
 *   raw: string
 * }>}
 */
function parseMarkdownTree(markdownContent) {
  const treeText = extractTreeText(markdownContent);
  const lines = treeText.split(/\r?\n/);

  const nodes = [];

  for (const rawLine of lines) {
    /*
     * Ignorar separadores visuales.
     */
    if (isTreeSeparator(rawLine)) {
      continue;
    }

    const line = sanitizeLine(rawLine);

    /*
     * Obtener nombre limpio.
     */
    const name = cleanNodeName(line);

    /*
     * Ignorar líneas vacías.
     */
    if (!name) {
      continue;
    }

    /*
     * Ignorar títulos/comentarios Markdown.
     */
    if (name.startsWith('#')) {
      continue;
    }

    /*
     * Ignorar placeholders generados por ChatGPT.
     */
    if (isPlaceholder(name)) {
      continue;
    }

    /*
     * Determinar tipo de nodo.
     */
    const isDirectory = isDirectoryName(name);

    /*
     * El "/" final no forma parte del nombre real.
     */
    const cleanNameWithoutSlash = name.replace(/\/$/, '');

    /*
     * Calcular profundidad utilizando la línea original
     * sanitizada, no el nombre limpio.
     */
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