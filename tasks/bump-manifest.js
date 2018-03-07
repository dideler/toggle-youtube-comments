const sed = require('shelljs').sed;
const oldVersion = require('../src/manifest.json').version;
const newVersion = require('../package.json').version;

sed('-i', oldVersion, newVersion, 'src/manifest.json');
