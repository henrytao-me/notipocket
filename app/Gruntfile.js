module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            less: {
                files: 'src/less/**/*.*',
                tasks: ['clean:css', 'less:less']
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

    grunt.registerTask('default', ['clean:css', 'less:less', 'watch']);

    grunt.registerTask('build', ['clean:build', 'clean:css', 'less:less', 'copy:build', 'cssmin:build', 'uglify:build']);

};