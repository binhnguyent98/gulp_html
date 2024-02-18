const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const { src, dest, series, parallel, watch } = require('gulp');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const tailwindConfig = './tailwind.config.js';
const postcss = require('gulp-postcss');
const concat = require("gulp-concat");

const baseDir = 'src';
const outDir = 'dist';

const path = {
  views: '/views',
  pages: '/views/pages/**/*.html',
  assets: {
    styles: '/assets/styles',
    scripts: '/assets/scripts',
    images: '/assets/images',
    fonts: '/assets/fonts',
  },
};

const renderViews = () => {
  return src(baseDir + path.pages)
    .pipe(fileInclude({ prefix: '@', basepath: '@file' }))
    .pipe(dest(outDir))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

const renderStyles = () => {
  return src(baseDir + path.assets.styles + '/style.scss')
    .pipe(
      plumber(function (err) {
        console.log('Styles Task Error');
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([tailwindcss(tailwindConfig), autoprefixer()]))
    .pipe(concat({ path: "style.css" }))
    .pipe(dest(outDir + path.assets.styles))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

const renderScript = () => {
  return src(baseDir + path.assets.scripts + '/**/*.js')
    .pipe(
      plumber(function (err) {
        console.log('Script Task Error');
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(babel())
    .pipe(dest(outDir + path.assets.scripts))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

const renderImage = () => {
  return src(baseDir + path.assets.images + '/**/*').pipe(dest(outDir + path.assets.images));
};

const renderFonts = () => {
  return src(baseDir + path.assets.fonts + '/**/*').pipe(dest(outDir + path.assets.fonts));
};

const browserSyncDev = (done) => {
  browserSync.init({
    server: {
      baseDir: outDir,
    },
    port: 3000,
  });

  done();
};

const build = series(parallel(renderViews, renderStyles, renderScript, renderImage, renderFonts));

const watching = parallel(function () {
  watch(baseDir + path.views, series(renderViews, renderStyles));
  watch([baseDir + path.assets.styles, tailwindConfig], renderStyles);
  watch(baseDir + path.assets.scripts, renderScript);
  watch(baseDir + path.assets.images, renderImage);
  watch(baseDir + path.assets.fonts, renderFonts);
}, browserSyncDev);

exports.build = build;
exports.watch = watching;
