const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const outDir = tsProject.options.outDir;

gulp.task("copy-graphql-typedefs", function () {
  return gulp.src("src/**/*.graphql").pipe(gulp.dest(outDir));
});

gulp.task("compile-js-files", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(outDir));
});

gulp.task('watch-ts-files', function () {
  gulp.watch('src/**/*.ts').on("change", function (filePath) {
    return gulp.src(filePath, { base: 'src/' }).pipe(tsProject()).js.pipe(gulp.dest(outDir));
  })
})

gulp.task('watch-graphql-files', function () {
  gulp.watch('src/**/*.graphql').on("change", function (filePath) {
    return gulp.src(filePath, { base: 'src/' }).pipe(gulp.dest(outDir));
  });
})

gulp.task('watch', gulp.parallel("watch-ts-files", "watch-graphql-files"));

gulp.task("default", gulp.series(
  "compile-js-files",
  "copy-graphql-typedefs"
));