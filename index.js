#!/usr/bin/env node
const generateFile = require('./src/actions/generateFile');

if (process.argv.length != 3) {
    console.info('[gign] use "gign <path>"')
    return;
}

generateFile(process.argv[2]);