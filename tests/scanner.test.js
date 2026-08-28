const { test } = require('uvu');
const assert = require('uvu/assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { scanDirectory } = require('../src/core/scanner');

test('Scanner: Generar representación de árbol ASCII ignorando carpetas excluidas', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mktree-scanner-test-'));

  try {
    const srcDir = path.join(tmpDir, 'src');
    const nodeModulesDir = path.join(tmpDir, 'node_modules');
    const gitDir = path.join(tmpDir, '.git');

    fs.mkdirSync(srcDir, { recursive: true });
    fs.mkdirSync(nodeModulesDir, { recursive: true });
    fs.mkdirSync(gitDir, { recursive: true });

    fs.writeFileSync(path.join(srcDir, 'index.js'), '// main code');
    fs.writeFileSync(path.join(nodeModulesDir, 'package.json'), '{}');
    fs.writeFileSync(path.join(tmpDir, 'package.json'), '{}');

    const treeResult = scanDirectory(tmpDir);

    assert.ok(treeResult.includes('src/'));
    assert.ok(treeResult.includes('index.js'));
    assert.is(treeResult.includes('node_modules'), false);
    assert.is(treeResult.includes('.git'), false);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test.run();