const util = require('util');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const fastGlob = require('fast-glob');
const makeDir = require('make-dir');
const uglifyES = require('uglify-es');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const jsonfile = require('jsonfile');

/**
 * Using clean-css-cli directly.
 */
const compressCss = () =>
  shell.exec('cleancss -O1 ./src/youtube.css -o ./_dist/youtube.css', code => {
    if (code === 0) console.log('CSS optimised');
  });

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

  fs.writeFile(dist, result.code, err => {
    if (!err) console.log('JS optimised');
  });
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
    console.log('Images optimised');
  });
};

/**
 * Compress JSON on node.js
 */
const compressJson = async () => {
  const srcPathsArray = await fastGlob('src/**/*.json');

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
    ).then(log => console.log('JSON optimised'));
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
