var gulp = require('gulp'),
    run = require('gulp-run');

gulp.task('gh-pages', function(cb) {

  var commands = [
    'git commit -amf',
    'rm -r dist/',
    'broccoli build dist',
    'git checkout gh-pages',
    'cp dist/widget.* .',
    'git commit -am"Update"'
  ];

  run(commands.join(';')).exec();
});
