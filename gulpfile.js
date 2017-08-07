/* jshint esversion: 6 */
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const prefixer = require('gulp-autoprefixer');

gulp.task('default', ['sass', 'front-end-scripts', 'model-scripts', 'config-scripts', 'views-scripts', 'back-end-scripts', 'controller-scripts'], function () {
	console.log('Gulping... Don\'t modify your dist files, or they won\'t be saved!');
	gulp.watch('src/public/**/*.scss', ['sass']); //Frontend Sass
	gulp.watch('src/public/**/*.js', ['front-end-scripts']);
	gulp.watch('src/views/**/*.ejs', ['views-scripts']);
	//Client-side JS and Templates
	gulp.watch('src/models/**/*.js', ['model-scripts']); //Model Scripts
	gulp.watch('src/config/**/*.js', ['config-scripts']);
	gulp.watch('src/controllers/**/*.js', ['controller-scripts']);
	gulp.watch('src/*.js', ['back-end-scripts']); //Root-level Backend Scripts
});

gulp.task('sass', function() {
	return gulp.src('src/public/styles/*.scss')
	.pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(prefixer('last 2 versions', '>1%', 'ie 8', 'Android 2', 'Firefox ESR'))
	.pipe(gulp.dest('dist/public/styles'))
	.pipe(reload({stream: true}));
});

gulp.task('nodemon', function(cb) {
	var called = false;
	return nodemon({ script: 'src/server.js' })
		.on('start', function() {
			if(!called) {
				called = true;
				cb();
			}
		})
		.on('restart', function() {
			setTimeout(function() {
				reload({ stream: false });
			}, 1000);
		});
});

// 	gulp.task('default', ['develop', 'front-end-scripts', 'model-scripts', 'views-scripts', 'back-end-scripts', 'sass'], function() {
// 		console.log('Gulping... Don\'t modify your dist files, or it won\'t be saved!');
// 		gulp.watch('src/public/**/*.js');
// 		gulp.watch('src/models/**/*.js');
// 		gulp.watch('src/views/**/*.js');
// 		gulp.watch('src/*.js');
// 		gulp.watch('src/public/**/*.sass');
// 	});

// 	gulp.task('develop', function() {
// 		let stream = nodemon({ 
// 			script: 'src/server.js',
// 			ext: 'html js',
// 		});
// 		stream.on('start', function() { console.log('Started!');
// 			 })
// 					.on('crash', function() { console.error('APP CRASHED\n');
// 						stream.emit('restart', 100);
// 					});
// });

gulp.task('front-end-scripts', function() {
	return gulp.src('src/public/scripts/*.js')
						.pipe(babel({ presets: ['es2015'] }))
						.pipe(gulp.dest('dist/public/scripts/'));
});

gulp.task('model-scripts', function() {
	return gulp.src('src/models/**/*.js')
						 .pipe(gulp.dest('dist/models/'));
});

gulp.task('config-scripts', function() {
	return gulp.src('src/config/**/*.js')
						.pipe(gulp.dest('dist/config/'));
});

gulp.task('controller-scripts', function() {
	return gulp.src('src/controllers/**/*.js')
						.pipe(gulp.dest('dist/controllers/'));
});


gulp.task('views-scripts', function() {
	return gulp.src('src/views/**/*.ejs')
						 .pipe(gulp.dest('dist/views/'));
});

gulp.task('back-end-scripts', function() {
	return gulp.src('src/*.js')
						 .pipe(gulp.dest('dist/'));
});

// gulp.task('sass', function() {
// 	return gulp.src('src/public/styles/*.scss')
// 						.pipe(sass({ outputStyle: 'compressed' }).on('error',sass.logError))
// 						.pipe(gulp.dest('dist/public/styles'))
// 						.pipe(browserSync.reload({
// 							stream: true
// 						}));
// });
