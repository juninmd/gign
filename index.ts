#!/usr/bin/env node
import pkg from './package.json' with { type: 'json' };
import generateFile from './src/actions/generateFile.js';

const USAGE = '[gign] use "gign <path>"';
const arg = process.argv[2];

// A flag is not a folder: answer it instead of reporting "Directory does not exist".
if (process.argv.length === 3 && (arg === '-h' || arg === '--help')) {
  console.info(`${USAGE}\n[gign] writes <path>/.gitignore from the project files it finds`);
  process.exit(0);
}
if (process.argv.length === 3 && (arg === '-v' || arg === '--version')) {
  console.info(pkg.version);
  process.exit(0);
}

if (process.argv.length !== 3) {
  console.info(USAGE);
  process.exit(1);
}

const ok = await generateFile(process.argv[2]);
if (!ok) process.exitCode = 1;
