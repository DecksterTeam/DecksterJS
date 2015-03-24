var gulp = require('gulp');
var template = require('/Users/fhawkes/IdeaProjects/gtemplates');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');
var folders = require('gulp-folders');
var yuidoc = require('gulp-yuidoc');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var bowerFiles = require('main-bower-files');
var merge = require('gulp-merge');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var runSequence = require('run-sequence');
var changelog = require('conventional-changelog');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');
var moment = require('moment');
var rimraf = require('gulp-rimraf');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var pkg = require('./package.json');
var fs = require('fs');
var karma = require('gulp-karma')({
  configFile: 'karma.conf.js'
});

var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
  '<%= date %>\n' +
  '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
  '* Copyright (c) <%= year %> <%= pkg.author.name %>;' +
  ' Licensed MIT */\n';

var date = moment().format('YYYY-MM-DD');
var year = new Date().getFullYear();


var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

var updatePackageJson = function() {
  pkg = getPackageJson();
};

// function used to bump
var inc = function(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'));
};

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
    .pipe(rimraf());
});

// Main tasks
gulp.task('main-templates', function () {
  return gulp.src('src/main/templates/**/*.html')
    .pipe(plumber())
    .pipe(template({
      namespace: 'Deckster.Templates',
      name: function (file) {
        return file.relative.replace(/(.*\/templates\/|.html)/g, '');
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('src/main/scripts'));
});

gulp.task('main-lint', function () {
  return gulp.src(path.join('src/main/scripts/**/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('main-sass', function () {
  updatePackageJson();
  return gulp.src('src/main/styles/**/*.scss')
    .pipe(sass())
    .pipe(header(banner, {pkg: pkg, date: date, year: year}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/main/styles'))
    .pipe(rename('jquery.' + pkg.name + '.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(minifycss())
    .pipe(rename('jquery.' + pkg.name + '.min.css'))
    .pipe(gulp.dest('dist/'));
});

var srcFiles = ['./src/main/scripts/utils.js', './src/main/scripts/card.js', './src/main/scripts/' + pkg.name + '.js', './src/main/scripts/templates.js'];

gulp.task('main-js', function () {
  updatePackageJson();
  return gulp.src(srcFiles)
    .pipe(concat('jquery.' + pkg.name + '.js'))
    .pipe(header(banner, {pkg: pkg, date: date, year: year}))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg, date: date, year: year}))
    .pipe(rename('jquery.' + pkg.name + '.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-main', function () {
  return runSequence('main-lint', 'main-templates', 'main-sass', 'main-js');
});



// Cards tasks
gulp.task('card-templates', folders('src/cards', function (folder) {
  return gulp.src(path.join('src/cards', folder, 'templates/**/*.html'))
    .pipe(plumber())
    .pipe(template({
      namespace: 'Deckster.Templates',
      name: function (file) {
        return file.relative.replace(/(.*\/templates\/|.html)/g, '');
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(path.join('src/cards', folder, 'scripts')));
}));

gulp.task('card-sass', folders('src/cards', function (folder) {
  return gulp.src(path.join('src/cards', folder, 'styles/**/*.scss'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename(folder + '.css'))
    .pipe(gulp.dest(path.join('dist/cards', folder)))
    .pipe(minifycss())
    .pipe(rename(folder + '.min.css'))
    .pipe(gulp.dest(path.join('dist/cards', folder)));
}));

gulp.task('card-vendors', folders('src/cards', function (folder) {
  return merge(
    gulp.src(bowerFiles({
      paths: path.join('src/cards', folder)
    })),
      gulp.src(path.join('src/cards', folder, 'vendor/*'))
  ).pipe(gulp.dest(path.join('dist/cards', folder, 'vendor')));
}));

gulp.task('card-lint', folders('src/cards', function (folder) {
  return gulp.src(path.join('src/cards', folder, 'scripts/**/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
}));

gulp.task('card-js', folders('src/cards', function (folder) {
  return gulp.src(path.join('src/cards', folder, 'scripts/**/*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest(path.join('dist/cards', folder)))
    .pipe(uglify())
    .pipe(rename(folder + '.min.js'))
    .pipe(gulp.dest(path.join('dist/cards', folder)))
}));

gulp.task('build-cards', function () {
  return runSequence('card-lint', 'card-templates', 'card-sass', 'card-vendors', 'card-js');
});


// Main tasks
gulp.task('build', function() {
  return runSequence('clean', 'build-cards', 'build-main');
});

gulp.task('test', function () {
  return karma.once();
});

gulp.task('karma-watch', function() {
  return karma.start({
    autoWatch: true
  });
});

gulp.task('serve', ['build'], function() {

  browserSync({
    server: "./"
  });

  gulp.watch("src/main/styles/**/*.scss", ['main-sass', reload]);
  gulp.watch("src/cards/**/styles/**/*.scss", ['card-sass', reload]);

  gulp.watch('src/main/templates/**/*.html', ['main-templates']);
  gulp.watch('src/cards/**/templates/**/*.html', ['card-templates']);

  gulp.watch('src/main/scripts/**/*.js', ['main-js', reload]);
  gulp.watch('src/cards/**/scripts/**/*.js', ['card-js', reload]);

  gulp.watch("./index.html").on('change', reload);
});


gulp.task('default', function () {
  return runSequence(['karma-watch', 'serve']);
});

gulp.task('docs', function() {
  updatePackageJson();
  return gulp.src('./src/main/scripts/*.js')
    .pipe(yuidoc({
      project: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        url: pkg.homepage
      }
    }))
    .pipe(gulp.dest('gh-pages/docs/'));
});

gulp.task('changelog', function(cb) {
  updatePackageJson();
  return changelog({
    version: pkg.version
  }, function(err, log) {
    if(err) return cb(err);
    fs.writeFile('./CHANGELOG.md', log, cb);
  });
});

gulp.task('tag-and-commit', function () {
  updatePackageJson();
  return gulp.src(['./dist', './src', 'bower.json', 'package.json', 'CHANGELOG.md'])
    // commit the changed version number
    .pipe(git.commit('Release v' + pkg.version))

    // read only one file to get the version number
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tagVersion());
});

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('major', function() { return inc('major'); });

gulp.task('release', function() {
  return runSequence('build', 'patch', 'build', 'docs', 'changelog', 'tag-and-commit');
});

gulp.task('release-minor', function() {
  return runSequence('build', 'feature', 'build', 'docs', 'changelog', 'tag-and-commit');
});

gulp.task('release-major', function() {
  return runSequence('build', 'major', 'build', 'docs', 'changelog', 'tag-and-commit');
});





