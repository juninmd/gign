#!/usr/bin/env node
import generateFile from './src/actions/generateFile.js';

if (process.argv.length !== 3) {
  console.info('[gign] use "gign <path>"');
  process.exit(1);
}

generateFile(process.argv[2]);
