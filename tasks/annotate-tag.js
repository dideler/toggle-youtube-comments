const shell = require('shelljs');
const clipboardy = require('clipboardy');

const [oldTag, newTag] = shell.exec('git tag', {silent: true}).tail({'-n': 2}).stdout.trim().split('\n');

const compareText = `Changes: https://github.com/dideler/toggle-youtube-comments/compare/${oldTag}...${newTag}`

const copyReleaseNoteFooter = () => {
  clipboardy
    .write(`---\n\n${compareText}`)
    .then(() =>
      console.log(
        '📋 Copied the release note footer to your clipboard.\n',
        `=> "${compareText}"`
      )
    );
};

// Copy markdown text.
clipboardy.writeSync(`---\n\n${compareText}`);
