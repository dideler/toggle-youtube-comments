const shell = require('shelljs');
const clipboardy = require('clipboardy');

const [oldTag, newTag] = shell.exec('git tag', {silent: true}).tail({'-n': 2}).stdout.trim().split('\n');

const compareText = `Changes: https://github.com/dideler/toggle-youtube-comments/compare/${oldTag}...${newTag}`

// overwriting the lightweight tag with an annotated tag.
shell.exec(`git tag --annotate --force ${newTag} ${newTag}^0 --message "${compareText}"`)

// Copy markdown text.
clipboardy.writeSync(`---\n\n${compareText}`);
