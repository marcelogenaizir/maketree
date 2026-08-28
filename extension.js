const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const { parseMarkdownTree } = require('./src/core/parser');
const { buildTreeOnDisk } = require('./src/core/builder');
const { scanDirectoryToMarkdown } = require('./src/core/scanner');

/**
 * Método de activación de la extensión en VS Code
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // 1. Comando: Generar carpetas y archivos desde el archivo Markdown activo
  const createFromMarkdown = vscode.commands.registerCommand(
    'maketree.createFromMarkdown',
    async (uri) => {
      try {
        let markdownContent = '';
        let targetFolder = '';

        // Si se ejecuta desde el menú contextual (clic derecho en un archivo .md)
        if (uri && uri.fsPath.endsWith('.md')) {
          markdownContent = fs.readFileSync(uri.fsPath, 'utf-8');
          targetFolder = path.dirname(uri.fsPath);
        } else {
          // Si se ejecuta desde la Paleta de Comandos con un editor abierto
          const activeEditor = vscode.window.activeTextEditor;
          if (!activeEditor) {
            vscode.window.showErrorMessage('MakeTree: Abre un archivo Markdown o selecciónalo en el explorador.');
            return;
          }
          markdownContent = activeEditor.document.getText();
          targetFolder = path.dirname(activeEditor.document.uri.fsPath);
        }

        // Parsear árbol
        const nodes = parseMarkdownTree(markdownContent);
        if (!nodes || nodes.length === 0) {
          vscode.window.showWarningMessage('MakeTree: No se encontró ningún árbol ASCII válido en el archivo.');
          return;
        }

        // Construir en disco
        const createdItems = buildTreeOnDisk(nodes, targetFolder);
        const filesCount = createdItems.filter((i) => !i.isDirectory).length;
        const dirsCount = createdItems.filter((i) => i.isDirectory).length;

        vscode.window.showInformationMessage(
          ` MakeTree: ¡Estructura creada! (${dirsCount} carpetas, ${filesCount} archivos)`
        );

      } catch (error) {
        vscode.window.showErrorMessage(`MakeTree Error: ${error.message}`);
      }
    }
  );

  // 2. Comando: Exportar la carpeta actual a un archivo Markdown
  const exportToMarkdown = vscode.commands.registerCommand(
    'maketree.exportToMarkdown',
    async (uri) => {
      try {
        let sourceDir = '';

        // Si se ejecuta desde el menú contextual sobre una carpeta
        if (uri && uri.fsPath) {
          sourceDir = uri.fsPath;
        } else if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
          // Si se ejecuta desde la Paleta de Comandos en el workspace abierto
          sourceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
          vscode.window.showErrorMessage('MakeTree: Abre una carpeta en el workspace primero.');
          return;
        }

        // Generar el Markdown
        const { fullContent, rootName } = scanDirectoryToMarkdown(sourceDir);

        // Crear un documento sin guardar en el editor para que el usuario revise o guarde
        const document = await vscode.workspace.openTextDocument({
          language: 'markdown',
          content: fullContent,
        });

        await vscode.window.showTextDocument(document);
        vscode.window.showInformationMessage(` MakeTree: Estructura de '${rootName}' lista en el editor.`);

      } catch (error) {
        vscode.window.showErrorMessage(`MakeTree Error: ${error.message}`);
      }
    }
  );

  // Registrar subscripciones
  context.subscriptions.push(createFromMarkdown, exportToMarkdown);
}

/**
 * Método de desactivación
 */
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};