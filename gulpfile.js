let gulp = require('gulp');

let browserify = require('browserify');

let source = require('vinyl-source-stream');

let tsify = require('tsify');

let sourcemaps = require('gulp-sourcemaps');

let buffer = require('vinyl-buffer');

let watch = require('gulp-watch');

let browserSync = require('browser-sync').create();

let reload = browserSync.reload;

let less = require('gulp-less');

let autoprefixer = require('gulp-autoprefixer');

let csslint = require('gulp-csslint');

let changed = require('gulp-changed');

let plumber = require('gulp-plumber');

let uglify = require('gulp-uglify');

let minifyCss = require('gulp-minify-css');

let rename = require('gulp-rename');

let del = require('del');


let pathSrc = {
    ts: 'src/ts/**.ts',
    less: 'src/less/[^_]**.less'
};

let pathDist= {
    ts: 'dist/js',
    less: 'dist/css'
};


// 编译typescript

const Ts = function () {
    console.log('start typescript')
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/index.ts'],
        cache: {},
        packageCache: {},
        // standalone: 'datePicker'
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['stage-0','es2015'],
        extensions: ['.ts','.js']
    })
    .bundle()
    .pipe(plumber())
    .pipe(source('datePicker.js'))  
    .pipe(buffer())
    
    .pipe(sourcemaps.init({loadMaps: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(pathDist.ts));
};

gulp.task('ts',  Ts);

const ZipCss = () => {
    
    return gulp.src(pathDist.less+'/**.css')
            .pipe(minifyCss())//压缩js
            .pipe(rename({suffix:'.min'}))
            .pipe(gulp.dest(pathDist.less));
}

const ZipJs = () => {
    
    return gulp.src(pathDist.ts+'/**.js')
            .pipe(uglify())//压缩js
            .pipe(rename({suffix:'.min'}))
            .pipe(gulp.dest(pathDist.ts));
}

gulp.task('zipJs',ZipJs);
gulp.task('zipCss',ZipCss);

const Del = () => {
    return del(pathDist.ts+'/**.min.js');
}
gulp.task('Del', Del);

gulp.task('zip', gulp.series('Del', gulp.parallel('zipJs','zipCss')));

const Less = () => {
    return gulp.src(pathSrc.less)
            .pipe(changed(pathDist.less))
            .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(less())
            .pipe(autoprefixer()) //补全前缀
            .pipe(csslint()) //检查语法错误
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(pathDist.less));
}

gulp.task('less', Less);

gulp.task('watch', ()=>{
    watch(pathSrc.ts, (event)=>{
        Ts();
        reload()
    });

    watch(pathSrc.less, (event)=>{
        Less();
        reload()
    })
});

//无刷新
gulp.task('serve', gulp.parallel('watch', () => {
    browserSync.init({
        server: 'dist',
        open: false,
        host: '0.0.0.0'
    });
}));

