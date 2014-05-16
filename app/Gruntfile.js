module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            less: {
                files: 'src/css/*.*',
                tasks: ['clean:css']
            }
        },
        clean: {
            build: ['build']
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
        }
    });

    /*********************************************************************************
     __init__ TASK
     *********************************************************************************/

    grunt.registerTask('default', ['less:less', 'watch']);

    grunt.registerTask('build', ['clean:build', 'less:less', 'copy:build', 'cssmin:build']);

};