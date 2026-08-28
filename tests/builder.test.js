const { test } = require('uvu');
const assert = require('uvu/assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { buildTreeOnDisk } = require('../src/core/builder');

test('Builder: Crear carpetas y archivos en disco', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mktree-test-'));

  const nodes = [
    { name: 'src', isDirectory: true, depth: 0 },
    { name: 'utils', isDirectory: true, depth: 1 },
    { name: 'logger.js', isDirectory: false, depth: 2 },
  ];

  buildTreeOnDisk(nodes, tmpDir);

  const createdFile = path.join(tmpDir, 'src', 'utils', 'logger.js');
  assert.is(fs.existsSync(createdFile), true);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test.run();