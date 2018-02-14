const shell = require('shelljs')

// Copy files using shx (for suppport cross-platform)
shell.exec('shx cp -r ./src/_locales ./src/manifest.json ./_dist')
