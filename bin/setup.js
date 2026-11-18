const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const binDir = path.join(root, 'node_modules', '.bin');

try {
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }
  const src = path.join(root, 'bin', 'gunicorn');
  const dest = path.join(binDir, 'gunicorn');
  fs.copyFileSync(src, dest);
  try {
    fs.chmodSync(dest, 0o755);
    fs.chmodSync(src, 0o755);
  } catch (e) {}
  console.log('Successfully installed gunicorn shim to', dest);
} catch (err) {
  console.warn('Shim setup notice:', err.message);
}
