const { test } = require('uvu');
const assert = require('uvu/assert');

const {
  parseMarkdownTree,
  cleanNodeName,
  calculateDepth,
} = require('../src/core/parser');

test('Parser: Limpieza de comentarios y conectores ASCII', () => {
  const line = '│   ├── redis.go           # Cliente de Redis';

  const clean = cleanNodeName(line);

  assert.is(clean, 'redis.go');
});

test('Parser: Cálculo de profundidad', () => {
  const line1 = 'src/';
  const line2 = '├── components/';
  const line3 = '│   └── Header.jsx';
  const line4 = '│   │   └── Button.jsx';

  /*
   * Los conectores ├── y └── NO representan profundidad.
   *
   * src/                         → 0
   * ├── components/              → 0
   * │   └── Header.jsx           → 1
   * │   │   └── Button.jsx       → 2
   */

  assert.is(calculateDepth(line1), 0);
  assert.is(calculateDepth(line2), 0);
  assert.is(calculateDepth(line3), 1);
  assert.is(calculateDepth(line4), 2);
});

test('Parser: Parseo completo de estructura Markdown', () => {
  const markdown = `
\`\`\`folderTree
app/
├── controllers/
│   └── user.js       // Controlador de usuarios
└── models/
    └── user.js       # Modelo DB
\`\`\`
  `;

  const nodes = parseMarkdownTree(markdown);

  assert.is(nodes.length, 5);

  // app/
  assert.is(nodes[0].name, 'app');
  assert.is(nodes[0].isDirectory, true);
  assert.is(nodes[0].depth, 0);

  // controllers/
  assert.is(nodes[1].name, 'controllers');
  assert.is(nodes[1].isDirectory, true);
  assert.is(nodes[1].depth, 0);

  // user.js
  assert.is(nodes[2].name, 'user.js');
  assert.is(nodes[2].isDirectory, false);
  assert.is(nodes[2].depth, 1);

  // models/
  assert.is(nodes[3].name, 'models');
  assert.is(nodes[3].isDirectory, true);
  assert.is(nodes[3].depth, 0);

  // user.js
  assert.is(nodes[4].name, 'user.js');
  assert.is(nodes[4].isDirectory, false);
  assert.is(nodes[4].depth, 1);
});

test('Parser: Preserva guiones en nombres de archivos y directorios', () => {
  const markdown = `
\`\`\`folderTree
embedding-models/
├── all-MiniLM-L6-v2/
│   ├── model.onnx
│   └── tokenizer.json
├── docker-compose.yml
└── user-controller.go
\`\`\`
  `;

  const nodes = parseMarkdownTree(markdown);

  assert.is(nodes.length, 6);

  assert.is(nodes[0].name, 'embedding-models');
  assert.is(nodes[0].depth, 0);

  assert.is(nodes[1].name, 'all-MiniLM-L6-v2');
  assert.is(nodes[1].depth, 0);

  assert.is(nodes[2].name, 'model.onnx');
  assert.is(nodes[2].depth, 1);

  assert.is(nodes[3].name, 'tokenizer.json');
  assert.is(nodes[3].depth, 1);

  assert.is(nodes[4].name, 'docker-compose.yml');
  assert.is(nodes[4].depth, 0);

  assert.is(nodes[5].name, 'user-controller.go');
  assert.is(nodes[5].depth, 0);
});

test('Parser: Ignora separadores y placeholders', () => {
  const markdown = `
\`\`\`tree
project/
│
├── src/
│   ├── main.go
│   └── ...
│
└── <more files>
\`\`\`
  `;

  const nodes = parseMarkdownTree(markdown);

  assert.is(nodes.length, 3);

  assert.is(nodes[0].name, 'project');
  assert.is(nodes[0].depth, 0);

  assert.is(nodes[1].name, 'src');
  assert.is(nodes[1].depth, 0);

  assert.is(nodes[2].name, 'main.go');
  assert.is(nodes[2].depth, 1);
});

test.run();