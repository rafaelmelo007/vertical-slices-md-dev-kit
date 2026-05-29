#!/usr/bin/env node
'use strict';

const { init } = require('../lib/init');
const { addFeature } = require('../lib/add-feature');
const { showVersion } = require('../lib/version');

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'init':
    init(args).catch(err => { console.error(err.message); process.exit(1); });
    break;
  case 'add-feature':
    addFeature(args).catch(err => { console.error(err.message); process.exit(1); });
    break;
  case 'version':
  case '--version':
  case '-v':
    showVersion();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${cmd}\n`);
    printHelp();
    process.exit(1);
}

function printHelp() {
  console.log(`
vskit — vertical-slices-md-dev-kit CLI

Usage:
  npx @rafaelmelo007/vskit init             Bootstrap the framework in the current repo
  npx @rafaelmelo007/vskit add-feature      Scaffold a new feature slice
  npx @rafaelmelo007/vskit version          Show the installed version

Options:
  -h, --help     Show this help
  -v, --version  Show version

Docs: https://github.com/rafaelmelo007/vertical-slices-md-dev-kit
`.trim());
}
