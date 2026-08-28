const { test } = require('uvu');
const assert = require('uvu/assert');
const { parseMarkdownTree, cleanNodeName, calculateDepth } = require('../src/core/parser');

test('Parser: Limpieza de comentarios y conectores ASCII', () => {
  const line = '│   ├── redis.go           # Cliente de Redis';
  const clean = cleanNodeName(line);
  assert.is(clean, 'redis.go');
});

test('Parser: Cálculo de profundidad', () => {
  const line1 = 'src/';
  const line2 = '├── components/';
  const line3 = '│   └── Header.jsx';

  assert.is(calculateDepth(line1), 0);
  assert.is(calculateDepth(line2), 1);
  assert.is(calculateDepth(line3), 2);
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
  assert.is(nodes[0].name, 'app');
  assert.is(nodes[0].isDirectory, true);
  assert.is(nodes[2].name, 'user.js');
  assert.is(nodes[2].isDirectory, false);
  assert.is(nodes[2].depth, 2);
});

test.run();