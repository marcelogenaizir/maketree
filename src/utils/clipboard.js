const { execSync } = require('child_process');

function getClipboardText() {
  let command = '';

  if (process.platform === 'darwin') {
    command = 'pbpaste';
  } else if (process.platform === 'win32') {
    // Forzamos la consola de PowerShell a usar encoding UTF-8
    command = 'powershell -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-Clipboard"';
  } else {
    command = 'xclip -selection clipboard -o || xsel --clipboard --output';
  }

  try {
    const stdout = execSync(command, { encoding: 'utf-8' });
    return stdout;
  } catch (error) {
    throw new Error('No se pudo leer el contenido del portapapeles.');
  }
}

module.exports = {
  getClipboardText,
};