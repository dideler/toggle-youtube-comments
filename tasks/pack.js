const shell = require('shelljs');
const moment = require('moment');

const timeStamp = moment().format('YYYY-MM-DD_HHmm');
const fileName = `${timeStamp}-toggle-youtube-comments`;

shell.exec(`zip -9 -r _packages/${fileName}.zip ./_dist/*`);
