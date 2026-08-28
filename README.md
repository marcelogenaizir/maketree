# 🌳 MakeTree CLI & VS Code Extension

> **Convert Markdown tree diagrams into real project files instantly — and export existing structures back to Markdown effortlessly.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/)

---

## 🚀 Why MakeTree?

When working with LLMs (ChatGPT, Claude, Gemini, DeepSeek), AI models often output standard ASCII folder structures inside code blocks. Creating these files and folders manually is slow and repetitive.

**MakeTree** acts as the bridge between your AI chat and your file system:

- ⚡ **Zero Token Cost:** Process large projects in <100ms without wasting API tokens or chat limits.
- 🌐 **100% Offline & Agnostic:** Works with any AI model, terminal, or browser setup.
- 📋 **Clipboard Support:** Create folders directly from copied AI responses without creating temporary files.
- 🔄 **Bidirectional:** Create folder hierarchies from Markdown OR document existing projects with a single command.

---

## 📦 Installation

### Option 1: Global CLI via NPM

```bash
npm install -g maketree-extension
```

### Option 2: VS Code Extension

Search for **MakeTree** in the VS Code Extensions Marketplace (`Ctrl + Shift + X`) and click **Install**.

---

## 🛠️ CLI Usage (`mktree`)

MakeTree provides a unified command-line interface (`mktree`) with subcommands:

### 1. `mktree create`

Parses any Markdown file containing a `folderTree`, `text`, `tree`, or generic code block and generates the directory structure on your disk.

```bash
# Generate structure from a local Markdown file
mktree create README.md

# Generate structure directly from clipboard contents
mktree create --clipboard

# Generate structure inside a target directory (e.g., ./src)
mktree create design.md ./src
```

### 2. `mktree export`

Scans a target directory and exports an ASCII tree directly into a Markdown file.

Automatically ignores build and heavy folders (`node_modules`, `.git`, `.vscode`, `dist`, `build`, `.DS_Store`, `Thumbs.db`).

```bash
# Export current directory to tree.md in the current folder
mktree export

# Export a specific subfolder (e.g., ./src) to tree.md
mktree export ./src

# Export a specific subfolder to a custom Markdown file
mktree export ./src my_structure.md
```

### 3. `mktree template`

Generates ready-to-use Markdown architecture templates for rapid project scaffolding.

```bash
# Generate default template
mktree template

# Generate Go Clean Architecture & DDD template
mktree template go-ddd

# Available templates: default, react, node, fastapi, go-ddd (or go)
mktree template react
```

---

## 💡 VS Code Extension Usage

MakeTree integrates natively with Visual Studio Code:

### Command Palette (`Ctrl + Shift + P` / `Cmd + Shift + P`)

- **`MakeTree: Generar carpetas desde Markdown`**
- **`MakeTree: Exportar estructura actual a Markdown`**

### Explorer Context Menu (Right Click)

- **Right-click any `.md` file:** Select *MakeTree: Generar carpetas desde Markdown* to create the folder hierarchy in place.
- **Right-click any folder:** Select *MakeTree: Exportar estructura actual a Markdown* to generate an ASCII tree opened instantly in an unsaved editor document.

---

## ⚙️ CLI Help Menu

Run `mktree --help` or `mktree -h` in your terminal:

```text
  __  __  __ _    _____                 
 |  \/  |/ _| |  |_   _| __ ___  ___ 
 | |\/| | |_| |__/|| || '__/ _ \/ _ \
 | |  | |  _| '  \||| || | |  __/  __/
 |_|  |_|_| |_|_|_||_||_|  \___|\___|

 v1.0.0 - Create & export project trees in Markdown

USAGE:
  $ mktree <command> [arguments] [options]

COMMANDS:
  create [source] [target] Build folders and files on disk from Markdown or clipboard.
                           [source]  Path to a .md file or --clipboard (-c)
                           [target]  Destination directory (default: current directory)

  export [source] [output] Generate a Markdown tree representation from existing files.
                           [source]  Directory to scan (default: current directory)
                           [output]  Output file name (default: tree.md)

  template [name|options]  Scaffold a project structure or list available templates.
                           [name]    Template key (e.g., go-ddd, express, react)
                           [-l, --list] Show catalog of built-in templates (default if no name provided)
                           [-p, --preview, show] [template-name] Show a specific template preview

  templates                Alias to list all available templates.

GLOBAL OPTIONS:
  -h, --help               Display this help text and exit.
  -v, --version            Print CLI version number and exit.

EXAMPLES:
  # Create structure from a Markdown file
  $ mktree create README.md

  # Create structure directly from clipboard (-c or --clipboard)
  $ mktree create -c
  $ mktree create --clipboard ./my-app

  # List all built-in templates
  $ mktree template -l

  # Preview a specific template
  $ mktree template show go-ddd

  # Scaffold a new project using a template
  $ mktree template go-ddd ./my-service

  # Scan current directory and save tree to Markdown
  $ mktree export
  $ mktree export ./src structure.md
```

---

## 🤝 Contributing Custom Templates

Do you have a great project architecture pattern? You can add your own templates!

1. Fork this repository.
2. Add your Markdown tree definition under `src/templates/list/`.
3. Submit a Pull Request at [github.com/marcelogenaizir/maketree](https://github.com/marcelogenaizir/maketree).

All contributions are welcome!

## 📄 License

This project is licensed under the [MIT License](LICENSE).
