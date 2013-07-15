module.exports = function(grunt) {
    var jqueryVersion = grunt.option('jquery') || '1.5.1';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:7070/test/unit/index.html' +
                        '?inPhantomjs=true&jquery=' + jqueryVersion
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 7070,
                    base: './src'
                }
            }
        },
        watch : {
            files : [
                'Gruntfile.js',
                'src/wymeditor/core.js',
                'src/wymeditor/editor/*.js',
                'src/wymeditor/parser/*.js',
                'src/wymeditor/plugins/**/*.js',
                'src/wymeditor/skins/**/*.js',
                'src/wymeditor/lang/**/*.js',
                'src/test/unit/**/*.js'
            ],
            tasks: 'test',
            options: {
                interrupt: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('default', ['test']);
};
