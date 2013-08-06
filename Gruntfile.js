module.exports = function(grunt) {
    // Oldest supported version of jQuery is used by default
    var jqueryVersion = grunt.option('jquery') || '1.4.4';
    var banner = '/*!\n' +
        'WYMeditor - v<%= pkg.version %> - <%= grunt.template.today("mm/dd/yyyy") %>\n\n' +
        'Home page: <%= pkg.homepage %>\n\n' +
        'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
        'Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        '*/\n\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'src/wymeditor/core.js',
                    'src/wymeditor/editor/*.js',
                    'src/wymeditor/parser/*.js',
                    'src/wymeditor/rangy/*.js'
                ],
                dest: 'dist/jquery.wymeditor.js'
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: 'dist/jquery.wymeditor.min.js'
            },
        },
        copy: {
            dist: {
                files: [
                    {src: [
                        "README.md",
                        "CHANGELOG.md",
                        "AUTHORS",
                        "MIT-license.txt",
                        "GPL-license.txt",
                        "package.json",
                        "Gruntfile.js",
                        "docs/**",
                    ],
                    dest: "dist/wymeditor/"},
                    {src: [
                        "src/wymeditor/iframe/**",
                        "src/wymeditor/lang/**",
                        "src/wymeditor/plugins/**",
                        "src/wymeditor/skins/**"
                    ],
                    dest: "dist/wymeditor/wymeditor/"},
                    {cwd: 'src/', src: ['jquery/**/*'], dest: 'dist/wymeditor/'},
                    {cwd: 'src/', src: ['examples/**/*'], dest: 'dist/wymeditor/'},
                    {cwd: 'dist/', src: ['*'], dest: 'dist/wymeditor/wymeditor'}
                ]
            }
        },
        qunit: {
            all: {
                options: {
                    timeout: 15000,
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
    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('build', ['concat', 'uglify', 'copy']);
    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('default', ['test']);
};
