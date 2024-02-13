const codepoints = require('./src/assets/pg-icons.json');

module.exports = {
  inputDir: './src/assets/images/svgs',
  outputDir: './src/assets/fonts',
  fontTypes: ['woff', 'woff2'],
  assetTypes: ['html', 'json', 'css'],
  name: 'pg-icons',
  formatOptions: {
    json: {
      indent: 2,
    },
    svg: {
      centerHorizontally: true,
      centerVertically: true,
      normalize: true,
      preserveAspectRatio: true,
    },
  },
  codepoints: codepoints,
  // indicate the directory where the font files will be generated so the generated css example can point to the fonts
  fontsUrl: './fonts',
  pathOptions: {
    html: './src/assets/pg-icons.html',
    css: './src/assets/pg-icons.css',
    json: './src/assets/pg-icons.json',
  }
};