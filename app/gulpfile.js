var gulp = require('gulp')
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

src = {
    coffee: {
        modules : 'src/modules/**/*.coffee',
        core : 'src/core/*.coffee',
        directives : 'src/directives/*.coffee',
        app : 'src/app.coffee'
//        'all': ['controllers/*.coffee','services/*.coffee','models/*.coffee','directives/*.coffee','filters/*.coffee','app.coffee']
    },
    'sass' : 'sass/style.sass'
}

dist = {
    'css': 'asserts/css/',
    'javascript': 'asserts/dist/'
}

// clean stream of onerror
var cleaner = function(stream) {
    stream.listeners('error').forEach(function(item) {
        if(item.name == 'onerror') this.removeListener('error', item);
    }, stream);
};

var continueOnError = function(stream) {
    return stream
        .on('pipe', function(src) {
            cleaner(src);
        })
        .on('newListener', function() {
            cleaner(this);
        });
};

gulp.task('build', function () {
    return gulp.src([src.coffee.core,src.coffee.directives,src.coffee.modules,src.coffee.app])
        .pipe(continueOnError(coffee({bare:true})).on('error', gutil.log))
        .pipe(concat('matchtracker.js'))
        .pipe(gulp.dest(dist.javascript));
});

gulp.task('sass', function () {
    gulp.src(src.sass)
        .pipe(sass({indentedSyntax: true}))
        .pipe(gulp.dest(dist.css));
});

gulp.task('watcher', function () {
    gulp.watch([src.coffee.core,src.coffee.directives,src.coffee.modules,src.coffee.app], ['build']);
    gulp.watch(src.sass, ['sass']);
})
gulp.task('watch', ['build','sass', 'watcher']);

gulp.task('default', ['build','sass']);