var gulp = require("gulp");
var stylus = require("gulp-stylus");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
  pages: ["src/*.html"]
};

gulp.task("copy-html", function() {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function() {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/ts/main.ts"],
      cache: {},
      packageCache: {}
    })
      .plugin(tsify)
      .transform("babelify", {
        presets: ["es2015"],
        extensions: [".ts"]
      })
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
  })
);

gulp.task("styles", function() {
  return gulp
    .src("src/css/styles.styl")
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(gulp.dest("dist/css"));
});
