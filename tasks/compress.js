const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const uglifyES = require('uglify-es')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')

/**
 * Using clean-css-cli directly.
 */
const compressCss = () =>
  shell.exec('cleancss -O1 ./src/youtube.css -o ./_dist/youtube.css')

/**
 * Using Uglify-ES on node.js
 */
const compressJs = () => {
  const src = fs.readFileSync(path.resolve('./src/script.js'), 'utf8')
  const dist = path.resolve('./_dist/script.js')
  const options = {
    compress: {
      drop_console: true,
      ecma: 6
    },
    mangle: { toplevel: true }
  }

  const result = uglifyES.minify(src, options)

  // Output compressed file.
  fs.writeFileSync(dist, result.code)
}

/**
 * Using imagemin on node.js
 */
const compressImage = () => {
  return imagemin(['src/icons/**/*'], '_dist/icons', {
    plugins: [
      imageminPngquant({
        quality: '75-85',
        speed: 1,
        verbose: true
      })
    ]
  }).then(files => {
    console.log('Images optimized')
  })
}

/**
 *  Run processes.
 */
;(async () => {
  const processes = await Promise.all([
    compressCss(),
    compressJs(),
    compressImage()
  ])
    .then(x => console.log('Compress: Complete'))
    .catch(err => console.error(err))
})()
