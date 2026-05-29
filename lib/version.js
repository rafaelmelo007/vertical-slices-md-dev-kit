'use strict';

function showVersion() {
  const { version, name } = require('../package.json');
  console.log(`${name} ${version}`);
}

module.exports = { showVersion };
