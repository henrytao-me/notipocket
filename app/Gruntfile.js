module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            less: {
                files: 'src/less/**/*.*',
                tasks: ['clean:css', 'less:less']
            },
            env: {
                files: 'env/dev.js',
                tasks: ['copy:env_dev']
            }
        },
        clean: {
            build: ['build'],
            css: ['src/css']
        },
        less: {
            less: {
                files: [{
                    expand: true,
                    cwd: 'src/less',
                    src: ['**/*.less'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.*', '!less/**/*.less'],
                    dest: 'build'
                }]
            },
            env_dev: {
                src: 'env/dev.js',
                dest: 'src/js/env.js'
            },
            env_build: {
                src: 'env/build.js',
                dest: 'build/js/env.js'
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['**/*.css'],
                    dest: 'build/css',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'build/js',
                    src: ['**/*.js', '!**/origin/*.js'],
                    dest: 'build/js'
                }]
            }
        }
    });

    /*********************************************************************************
     __init__ TASK
     *********************************************************************************/

    grunt.registerTask('default', ['clean:css', 'less:less', 'copy:env_dev', 'watch']);

    grunt.registerTask('build', ['clean:build', 'clean:css', 'less:less', 'copy:build', 'copy:env_build', 'cssmin:build', 'uglify:build']);

};