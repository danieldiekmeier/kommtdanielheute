var gulp         = require('gulp');
var watch        = require('gulp-watch');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var jshint       = require('gulp-jshint');
var sourcemaps   = require('gulp-sourcemaps');


gulp.task('default', ['sass', 'scripts', 'serve']);


gulp.task('lint', function() {
	return gulp.src('./*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('sass', function() {
	return gulp.src(['./dev/sass/style.sass'])
		.pipe(sourcemaps.init())
		.pipe(sass({indentedSyntax: true}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./public/css'))
		.pipe(reload({ stream:true }));
});

gulp.task('serve', function() {
	browserSync({
		proxy:  'localhost:5000',
		notify: false,
		open:   false,
		port:   3000
	});

	watch(['./templates/*.html'], reload);

	watch(['./dev/sass/*.sass'], function() {
		gulp.start('sass');
	});

});