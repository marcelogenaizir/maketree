#!/usr/bin/env node

const path = require('path');
const { createCommand } = require('../src/commands/create');
const { exportCommand } = require('../src/commands/export');
const { templateCommand } = require('../src/commands/template');
const { getAvailableTemplates, getTemplate } = require('../src/templates');
const { colors } = require('../src/utils/colors');
const { VERSION } = require('../src/constants');

// Capturar argumentos pasados por la terminal
const args = process.argv.slice(2);
const command = args[0];

/**
 * Muestra en pantalla el árbol Markdown de una plantilla específica
 */
function showTemplatePreview(templateName) {

  const tpl = getTemplate(templateName);

  if (!tpl) {
    console.error(colors.red(`\n✖ Error: Template "${templateName}" not found.`));
    console.log(colors.dim('  Run "mktree templates" to see all available templates.\n'));
    process.exit(1);
  }
  const treeContent = tpl.content || tpl.tree || tpl.template || '';

  console.log(`\n${colors.yellow('TEMPLATE PREVIEW:')} ${colors.green(tpl.key)}`);
  console.log(`${colors.dim(tpl.description || '')}\n`);
  console.log(colors.cyan(treeContent));
  console.log(`\n${colors.yellow('TO SCAFFOLD THIS TEMPLATE:')}`);
  console.log(` $ ${colors.green(`mktree template ${tpl.key} [destination]`)}\n`);
}

/**
 * Muestra el listado de templates disponible en pantalla
 */
function showTemplatesList() {
  console.log(`\n${colors.yellow('AVAILABLE TEMPLATES:')}\n`);

  const templates = getAvailableTemplates();
  templates.forEach((tpl) => {
    const key = colors.green(tpl.key.padEnd(16));
    const desc = colors.dim(tpl.description || '');
    console.log(`  ${key} ${desc}`);
  });

  console.log(`\n${colors.yellow('USAGE:')}`);
  console.log(`  $ ${colors.green('mktree template <template-name> [dst]')}\n`);
}

/**
 * Muestra el menú de ayuda interactivo en pantalla
 */
function showHelp() {
  console.log(`
${colors.cyan(`
             _    _
  _ __ ___  | | _| |_ _ __ ___  ___ 
 | '_ \` _ \\ | |/ / __| '__/ _ \\/ _ \\
 | | | | | ||   <| |_| | |  __/  __/
 |_| |_| |_||_|\\_\\\\__|_|  \\___|\\___|
`)}

 ${colors.dim(`v${VERSION} - Create & export project trees in Markdown`)}

${colors.yellow('USAGE:')}
  $ ${colors.green('mktree')} <command> [arguments] [options]

${colors.yellow('COMMANDS:')}
  ${colors.green('create')} [source] [target] Build folders and files on disk from Markdown or clipboard.
                           ${colors.dim('[source]  Path to a .md file or --clipboard (-c)')}
                           ${colors.dim('[target]  Destination directory (default: current directory)')}

  ${colors.green('export')} [source] [output] Generate a Markdown tree representation from existing files.
                           ${colors.dim('[source]  Directory to scan (default: current directory)')}
                           ${colors.dim('[output]  Output file name (default: tree.md)')}

  ${colors.green('template')} [name|options]  Scaffold a project structure or list available templates.
                           ${colors.dim('[name]    Template key (e.g., go-ddd, express, react)')}
                           ${colors.dim('[-l, --list] Show catalog of built-in templates (default if no name provided)')}
                           ${colors.dim('[-p, --preview, show] [template-key] Show a specific template preview')}

  ${colors.green('templates')}                Alias to list all available templates.

${colors.yellow('GLOBAL OPTIONS:')}
  ${colors.green('-h, --help')}               Display this help text and exit.
  ${colors.green('-v, --version')}            Print CLI version number and exit.

${colors.yellow('EXAMPLES:')}
  ${colors.dim('# Create structure from a Markdown file')}
  $ ${colors.green('mktree create README.md')}

  ${colors.dim('# Create structure directly from clipboard (-c or --clipboard)')}
  $ ${colors.green('mktree create -c')}
  $ ${colors.green('mktree create --clipboard ./my-app')}

  ${colors.dim('# List all built-in templates')}
  $ ${colors.green('mktree template -l')}

  ${colors.dim('# Preview a specific template')}
  $ ${colors.green('mktree template show go-ddd')}

  ${colors.dim('# Scaffold a new project using a template')}
  $ ${colors.green('mktree template go-ddd ./my-service')}

  ${colors.dim('# Scan current directory and save tree to Markdown')}
  $ ${colors.green('mktree export')}
  $ ${colors.green('mktree export ./src structure.md')}

  ${colors.yellow('COMMUNITY & CONTRIBUTIONS:')}
  ${colors.dim('Want to share your own custom tree templates?')}
  Submit a PR or open an issue at: ${colors.cyan('https://github.com/marcelogenaizir/maketree')}

`);
}

/**
 * Función principal para procesar los comandos de la CLI
 */
async function run() {
  // Sin argumentos o banderas de ayuda
  if (!command || command === '-h' || command === '--help') {
    showHelp();
    process.exit(0);
  }

  // Bandera de versión
  if (command === '-v' || command === '--version') {
    console.log(`maketree v${VERSION}`);
    process.exit(0);
  }

  try {
    switch (command) {
      case 'create': {
        const source = args[1];
        const destination = args[2] ? path.resolve(args[2]) : process.cwd();

        if (!source) {
          console.error(colors.red('✖ Error: Missing source. Provide a Markdown file path or --clipboard flag.'));
          console.log(colors.dim('  Example: mktree create README.md'));
          process.exit(1);
        }

        await createCommand(source, destination);
        break;
      }

      case 'export': {
        const sourceDir = args[1] && !args[1].endsWith('.md') ? path.resolve(args[1]) : process.cwd();
        const outputFile = args[2] || (args[1] && args[1].endsWith('.md') ? args[1] : 'tree.md');

        await exportCommand(sourceDir, outputFile);
        break;
      }
      case 'template': {
        const subArg = args[1];
        const nextArg = args[2];

        // 1. Mostrar lista general: mktree template, mktree template -l, mktree template --list
        if (!subArg || subArg === '-l' || subArg === '--list') {
          showTemplatesList();
          break;
        }

        // 2. Previsualizar un template específico: mktree template show <name> o mktree template -p <name>
        if (subArg === 'show' || subArg === '-p' || subArg === '--preview') {
          if (!nextArg) {
            console.error(colors.red('✖ Error: Missing template name for preview.'));
            console.log(colors.dim('  Example: mktree template show go-ddd'));
            process.exit(1);
          }
          showTemplatePreview(nextArg);
          break;
        }

        // 3. Crear el template en disco: mktree template go-ddd [dst]
        const templateName = subArg;
        const destination = nextArg ? path.resolve(nextArg) : process.cwd();
        await templateCommand(templateName, destination);
        break;
      }

      default:
        console.error(colors.red(`✖ Error: Unknown command "${command}"`));
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(colors.red(`\n✖ An error occurred during execution:`));
    console.error(colors.dim(error.message));
    process.exit(1);
  }
}

run();