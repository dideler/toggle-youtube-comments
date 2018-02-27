const util = require('util');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const globby = require('globby');
const makeDir = require('make-dir');
const uglifyES = require('uglify-es');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const jsonfile = require('jsonfile');

/**
 * Using clean-css-cli directly.
 */
const compressCss = () =>
  shell.exec('cleancss -O1 ./src/youtube.css -o ./_dist/youtube.css');

/**
 * Using Uglify-ES on node.js
 */
const compressJs = () => {
  const src = fs.readFileSync(path.resolve('./src/script.js'), 'utf8');
  const dist = path.resolve('./_dist/script.js');
  const options = {
    compress: {
      drop_console: true,
      ecma: 6,
    },
    mangle: { toplevel: true },
  };

  const result = uglifyES.minify(src, options);

  // Output compressed file.
  fs.writeFileSync(dist, result.code);
};

/**
 * Using imagemin on node.js
 */
const compressImage = () => {
  return imagemin(['src/icons/**/*'], '_dist/icons', {
    plugins: [
      imageminPngquant({
        quality: '75-85',
        speed: 1,
        verbose: true,
      }),
    ],
  }).then(files => {
    console.log('Images optimized');
  });
};

/**
 * Compress JSON on node.js
 */
const compressJson = async () => {
  const srcPathsArray = await Promise.all([
    globby('src/_locales/**/messages.json'),
    globby('src/manifest.json'),
  ]).then(arrays => [].concat(...arrays)); // flatten array

  const distPathsArray = await Promise.all(
    srcPathsArray.map(async v => {
      const distPath = v.replace('src/', '_dist/');
      await makeDir(path.dirname(distPath)); // make parent directory of file.
      return path.resolve(distPath); // return absolute path.
    })
  );

  // Promisify
  const promiseJsonRead = util.promisify(jsonfile.readFile);
  const promiseJsonWrite = util.promisify(jsonfile.writeFile);

  const readFiles = async filePaths => {
    const jsonContentArray = filePaths.map(filePath => promiseJsonRead(filePath));
    return Promise.all(jsonContentArray);
  };

  const writeFiles = async (distPaths, contents) => {
    await Promise.all(
      contents.map((content, i) => {
        const distPath = distPaths[i];
        const write = promiseJsonWrite(distPath, content, {
          replacer: null,
          spaces: 0,
        });
      })
    ).then(log => console.log('JSON compressed'));
  };

  const jsonContents = await readFiles(srcPathsArray);

  const write = await writeFiles(distPathsArray, jsonContents);
};

/**
 *  Run processes.
 */
(async () => {
  const processes = await Promise.all([
    compressCss(),
    compressJs(),
    compressImage(),
    compressJson(),
  ])
    .then(x => console.log('Compress: Completed'))
    .catch(err => console.error(err));
})();
