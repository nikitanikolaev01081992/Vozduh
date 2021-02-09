const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");

const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
// const svgstore = require("gulp-svgstore");
// const inject = require("gulp-inject");

const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");

const csso = require("postcss-csso");

// Styles

const styles = () => {
    return gulp
        .src("source/less/styles.less")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less())
        .pipe(postcss([autoprefixer(), csso()]))
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
};

exports.styles = styles;

//Unminified styles

const unminStyles = () => {
    return gulp
        .src("source/less/styles.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([autoprefixer()]))
        .pipe(rename("styles.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
};

exports.unminStyles = unminStyles;

// HTML

const html = () => {
    return gulp
        .src("source/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("build"));
};

exports.html = html;

// Scripts

const scripts = () => {
    return gulp
        .src("source/js/script.js")
        .pipe(uglify())
        .pipe(rename("script.min.js"))
        .pipe(gulp.dest("build/js"))
        .pipe(sync.stream());
};

exports.scripts = scripts;

// Images

const images = () => {
    return gulp
        .src("source/img/**/*.{png,jpg,svg}")
        .pipe(
            imagemin([
                imagemin.mozjpeg({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 3 }),
                imagemin.svgo(),
            ])
        )
        .pipe(gulp.dest("build/img"));
};

exports.images = images;

// WebP
const createWebp = () => {
    return gulp
        .src("source/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

//Videos
const copyVideos = () => {
    return gulp.src("source/video/*.mp4").pipe(gulp.dest("build/video"));
};

exports.copyVideos = copyVideos;

// Sprite

// const sprite = function () {
//   var svgs = gulp
//     .src("source/img/icons/*.svg")
//     .pipe(svgstore({ inlineSvg: true }));

//   function fileContents(filePath, file) {
//     return file.contents.toString();
//   }

//   return gulp
//     .src("build/*.html")
//     .pipe(inject(svgs, { transform: fileContents }))
//     .pipe(gulp.dest("build"));
// };

// exports.sprite = sprite;

// copyFonts

const copyFonts = () => {
    return gulp.src("source/fonts/*.{otf,woff2,woff}").pipe(gulp.dest("build/fonts"));
};

exports.copyFonts = copyFonts;

// Clean

const clean = () => {
    return del("build");
};

// Server

const server = (done) => {
    sync.init({
        server: {
            baseDir: "build",
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
};

exports.server = server;

// Reload

const reload = (done) => {
    sync.reload();
    done();
};

// Watcher

const watcher = () => {
    gulp.watch("source/less/**/*.less", gulp.series(styles));
    gulp.watch("source/js/script.js", gulp.series(scripts, reload));
    gulp.watch("source/img/**/*", gulp.series(images, createWebp, reload));
    //   gulp.watch("source/img/icons/*.svg", gulp.series(sprite, reload));
    gulp.watch("source/*.html", gulp.series(html, reload));
};

// Build

const build = gulp.series(
    clean,
    gulp.parallel(styles, unminStyles, html, scripts, images, createWebp, copyVideos, copyFonts)
    //   sprite
);

exports.build = build;

// Default

exports.default = gulp.series(
    clean,
    gulp.parallel(styles, unminStyles, html, scripts, images, createWebp, copyVideos, copyFonts),
    gulp.series(server, watcher)
);
