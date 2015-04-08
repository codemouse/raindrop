Del = require 'del'
Gulp = require 'gulp'
GulpCoffee = require 'gulp-coffee'
GulpCoffeelint = require 'gulp-coffeelint'
GulpEslint = require 'gulp-eslint'
GulpUtil = require 'gulp-util'
RunSequence = require 'run-sequence'

Gulp.task 'coffeelint', ->
  Gulp.src(['./**/*.coffee', '!./node_modules/**'])
  .pipe(GulpCoffeelint())
  .pipe(GulpCoffeelint.reporter())

Gulp.task 'eslint', ->
  Gulp.src(['./**/*.js', '!./node_modules/**'])
  .pipe(GulpEslint())
  .pipe(GulpEslint.format())

Gulp.task 'lint', ['coffeelint', 'eslint']

Gulp.task 'clean', (cb) ->
  Del ['./lib'], {force: true}, cb

Gulp.task 'compile', ->
  Gulp.src(['./src/**/*.coffee'])
  .pipe(GulpCoffee(bare: true)).on('error', GulpUtil.log)
  .pipe(Gulp.dest('./lib'))

Gulp.task 'copyJs', ->
  Gulp.src(['./src/**/*.js'], { base: './src' })
  .pipe(Gulp.dest('./lib'))

Gulp.task 'build', ->
  RunSequence 'clean', 'compile', 'copyJs'

Gulp.task 'default', ->
  Gulp.run('lint', 'test')
