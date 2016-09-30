var gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    connect = require("gulp-connect"),
    less = require("gulp-less"),
    autoprefixer = require('gulp-autoprefixer'),
    ejs = require("gulp-ejs"),
    uglify = require('gulp-uglify'),
    ext_replace = require('gulp-ext-replace'),
    cssmin = require('gulp-cssmin'),
    minifyHTML = require('gulp-htmlmin'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    notify = require('gulp-notify'),
    changed = require('gulp-changed'),
    pkg = require("./package.json");
var DEST = 'dist';
var banner =
    "/** \n\
    * jQuery WeUI V" + pkg.version + " \n\
* \n\
* http://lihongxun945.github.io/jquery-weui/\n \
*/\n";

gulp.task('js', function (cb) {

    count = 0;
    var end = function () {
        count++;
        if (count >= 3) cb();
    };

    gulp.src([
        './src/js/city-data.js',
        './src/js/city-picker.js'
    ])
        .pipe(concat({path: 'city-picker.js'}))
        .pipe(gulp.dest('./dist/js/'))
        .on("end", end);

    gulp.src([
        './src/js/swiper.jquery.js',
        './src/js/swiper-wrap.js',
        './src/js/photos.js'
    ])
        .pipe(concat({path: 'swiper.js'}))
        .pipe(gulp.dest('./dist/js/'))
        .on("end", end);

    gulp.src([
        './src/js/jquery-extend.js',
        './src/js/template7.js',
        './src/js/hammer.js',
        './src/js/modal.js',
        './src/js/toast.js',
        './src/js/action.js',
        './src/js/pull-to-refresh.js',
        './src/js/infinite.js',
        './src/js/tab.js',
        './src/js/search-bar.js',
        './src/js/device.js',
        './src/js/picker.js',
        './src/js/select.js',
        './src/js/calendar.js',
        './src/js/datetime-picker.js',
        './src/js/popup.js',
        './src/js/notification.js',
        './src/js/toptip.js'
    ])
        .pipe(concat({path: 'jquery-weui.js'}))
        .pipe(header(banner))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .on("end", end);


});

gulp.task('uglify', ["js"], function () {
    return gulp.src(['./dist/js/*.js', '!./dist/js/*.min.js'])
        .pipe(uglify({
            preserveComments: "license"
        }))
        .pipe(ext_replace('.min.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function () {
    return gulp.src(['./src/less/jquery-weui.less'])
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(header(banner))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('cssmin', ["less"], function () {
    gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css'])
        .pipe(cssmin())
        .pipe(minifyCSS())
        .pipe(header(banner))
        .pipe(ext_replace('.min.css'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('ejs', function () {
    return gulp.src(["./src/*.html", "!./src/_*.html"])
        .pipe(minifyHTML({collapseWhitespace: true}))
        .pipe(ejs({}))
        .pipe(gulp.dest("./dist/"));
});

gulp.task('html', function () {
    return gulp.src(["src/*.html", "src/*.html"])
        .pipe(minifyHTML({collapseWhitespace: true}))
        .pipe(changed(DEST))
        //.pipe(notify({message: '监视html'}))
        .pipe(gulp.dest("./dist/"));
});

gulp.task('copy', function () {
    gulp.src(['./src/lib/**/*'])
        .pipe(gulp.dest('./dist/lib/'));

    gulp.src(['./src/images/*.*'])
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/images/'));

    gulp.src(['./src/css/*.css'])
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('server', function () {
    connect.server();
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
    gulp.watch(['src/*.html','src/js/*.js','src/lib/*.css']).on('change', browserSync.reload);

});

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/*.html');
    gulp.watch('src/css/*.css', ['copy']);
});
gulp.task("default", ['html','uglify', 'cssmin', 'copy', 'ejs']);
