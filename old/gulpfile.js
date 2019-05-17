'use strict';

const gulp = require('gulp');
const help = require('gulp-task-listing');
const bump = require('gulp-bump');
const minimist = require('minimist');

const opts = {};
let argv;

if (process.argv.length > 2) {

    if (['bump-version-repository'].some(task => task === (process.argv[2] || ''))) {

        argv = minimist(process.argv.slice(2), {
            'alias': {
                s: 'set',
                t: 'type',
            },
            'default': { type: 'patch' },
            'string': ['type', 'set'],
        });

        // Create the opts, based on argv.
        opts.type = argv.type;

        if (!argv.set && (opts.type === 'alpha' || opts.type === 'beta')) {
            opts.preid = opts.type;
            opts.type = 'prerelease';
        }

        if (argv.set) {
            opts.version = argv.set;
        }

    }

}

// Generate a nice output of the available tasks within this gulpfile.
gulp.task('help', help);

// The default gulp task, let's run help.
gulp.task('default', () => {
    gulp.run('help');
});

gulp.task('bump-version-repository', () => {

    return gulp
        .src('./package.json')
        .pipe(bump(opts))
        .pipe(gulp.dest('./'));

});

gulp.task('bump-version', ['bump-version-repository']);
