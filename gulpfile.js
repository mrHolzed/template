var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat		= require('gulp-concat'),
	uglify		= require('gulp-uglifyjs'),
	cssnano		= require('gulp-cssnano'),
	rename		= require('gulp-rename'),
	del			= require('del'),
	imagemin	= require('gulp-imagemin'),
	pngquant	= require('imagemin-pngquant'),
	cache		= require('gulp-cache'),
	autoprefixer= require('gulp-autoprefixer'),
	jade		= require('gulp-jade');
	connect = require('gulp-connect-php');
	wordpress = require( "wordpress" );

gulp.task('wordpress', function() {
	client = wordpress.createClient({
    url: "test123:8888",
    username: "admin",
    password: "secret"
	});
});

gulp.task('connect', function() {
    connect.server();
});

gulp.task('default', ['connect']);

gulp.task('sass', function() {
	return gulp.src('./sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 15 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: true
		}))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('jade', function() {
	return gulp.src('./**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('./'))
});

gulp.task('scripts', function() {
	return gulp.src([
		'./libs/jquery/dist/jquery.min.js',
		'./libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./js'));
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('./css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./css'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('odist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('./img/**/*')
	.pipe(cache(imagemin({
		intarlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('odist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'wordpress'], function() {
	gulp.watch('./**/*.jade', ['jade']);
	gulp.watch('./sass/**/*.sass', ['sass']);
	gulp.watch('./*.html', browserSync.reload);
	gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'jade', 'scripts'], function() {
	var buildCss = gulp.src([
			'./css/main.css',
			'./css/libs.min.css',
		])
		.pipe(gulp.dest('odist/css'));

	var buildFonts = gulp.src('./fonts/**/*')
		.pipe(gulp.dest('odist/fonts'));

	var buildJs = gulp.src('./js/**/*')
		.pipe(gulp.dest('odist/js'));

	var buildHtml = gulp.src('./*.html')
		.pipe(gulp.dest('odist'));
});
