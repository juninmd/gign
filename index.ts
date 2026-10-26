#!/usr/bin/env node
import generateFile from './src/actions/generateFile.js';

if (process.argv.length !== 3) {
  console.info('[gign] use "gign <path>"');
  process.exit(1);
}

const ok = await generateFile(process.argv[2]);
if (!ok) process.exitCode = 1;
