import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readmePath = path.join(rootDir, 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

if (!readmeContent.includes('<!-- flags -->')) {
  console.error('[check:readme] Error: README.md does not contain the <!-- flags --> marker');
  process.exit(1);
}

if (!readmeContent.includes('### Opções da CLI') || !readmeContent.includes('<path>')) {
  console.error('[check:readme] Error: README.md does not contain the CLI options table');
  process.exit(1);
}

console.log('[check:readme] README.md check passed successfully!');
