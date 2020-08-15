var gulp = require('gulp'), 
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify =  require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant')

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scss', function(){
    return gulp.src('app/scss/main.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }))
})

gulp.task('code', function(){
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
})

gulp.task('css-min',  function(){
    return gulp.src('app/css/*.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
})

gulp.task('img', function(){
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interleced: true,
            progressive: true,
            svgoPludins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
})


gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch('app/*.html', gulp.parallel('code'))
    gulp.watch(['app/js/index.js', 'app/libs/**/*.js'], gulp.parallel('scripts'))
})

gulp.task('scripts', function(){
    return// gulp.src(''
    //     // 'app/libs/jquery/dist/jquery.min.js',
    // , {allowEmpty: true})
    // .pipe(concat('libs.min.js'))
    // .pipe(uglify())
    // .pipe(gulp.dest('app/js'))
    //.pipe(browserSync.reload({ stream: true }))
})


gulp.task('clean', async function(){
    return del.sync('dist')
})


gulp.task('prebuild', async function(){

    let buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'))
    
    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
    
})

gulp.task('default', gulp.parallel('scss', 'scripts', 'browser-sync', 'watch'))
gulp.task('build', gulp.parallel('prebuild', 'css-min', 'clean', 'scripts' ))
