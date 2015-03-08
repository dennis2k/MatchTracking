var gulp = require('gulp')
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');
src = {
    'coffee': {
        'all': ['controllers/*.coffee','services/*.coffee','models/*.coffee','directives/*.coffee','filters/*.coffee','app.coffee']
    }
}

dist = {
    'css': 'css/',
    'javascript': 'dist/'
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
    return gulp.src(src.coffee.all)
        .pipe(continueOnError(coffee({bare:true})).on('error', gutil.log))
        .pipe(concat('matchtrackeromfg.js'))
        .pipe(gulp.dest(dist.javascript));
});

gulp.task('watch', function () {
    gulp.watch(src.coffee.all, ['build']);
    gulp.watch(src.coffee.app, ['build']);
})
gulp.task('watch', ['build', 'watch']);

gulp.task('default', ['build']);