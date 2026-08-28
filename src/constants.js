const packageJson = require('../package.json');

module.exports = {
  VERSION: packageJson.version || '1.0.0',
  DEFAULT_IGNORE: [
    'node_modules',
    '.git',
    '.vscode',
    'dist',
    'build',
    '.DS_Store',
    'Thumbs.db',
  ],
};