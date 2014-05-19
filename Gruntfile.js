/*jslint node: true, es3: false, maxlen: 88 */
'use strict';
var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Oldest supported version of jQuery is used by default
    var jqueryVersion = grunt.option("jquery") || "1.4.4",
        yeomanConfig = {
            app: 'src',
            dist: 'dist'
        },
        unitTestPort = 9001;

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        yeoman: yeomanConfig,
        meta: {
            banner: "/*!\n" +
                "WYMeditor - v<%= pkg.version %>\n\n" +
                "Home page: <%= pkg.homepage %>\n\n" +
                "Copyright (c) <%= grunt.template.today('yyyy') %> " +
                "<%= pkg.author.name %>;\n" +
                "Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %>\n" +
                "*/\n\n"
        },
        watch: {
            options: {
                // Don't spawn a child process. Virtualbox's NFS share is
                // slow enough already.
                spawn: false,
                livereload: true
            },
            default: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/examples/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/test/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/test/unit/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/plugins/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/skins/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            dist: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/examples/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/plugins/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/skins/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['build']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            dev: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: unitTestPort,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/wymeditor/{,*/}*.js',
                '<%= yeoman.app %>/wymeditor/plugins/{,*/}*.js',
                '<%= yeoman.app %>/wymeditor/skins/{,*/}*.js',
                '<%= yeoman.app %>/test/unit/{,*/}*.js'
            ]
        },
        qunit: {
            all: {
                options: {
                    timeout: 25000,
                    urls: [
                        [""
                            , "http://localhost:"
                            , unitTestPort
                            , "/test/unit/index.html"
                            , "?inPhantomjs=true&jquery="
                            , jqueryVersion
                        ].join("")
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: [
                '<%= yeoman.app %>/wymeditor/iframe/{,*/}*.html'
            ]
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: [
                '<%= yeoman.dist %>/examples/{,*/}*.html',
                '<%= yeoman.dist %>/wymeditor/iframe/{,*/}*.html'
            ],
            css: [
                '<%= yeoman.dist %>/examples/{,*/}*.css',
                '<%= yeoman.dist %>/wymeditor/plugins/{,*/}*.css',
                '<%= yeoman.dist %>/wymeditor/skins/{,*/}*.css'
            ]
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                    keepClosingSlash: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: 'wymeditor/iframe/{,*/}*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        replace: {
            dist: {
                options: {
                    variables: {
                        "VERSION": "<%= pkg.version %>"
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/wymeditor',
                        src: [
                            '*.js'
                        ],
                        dest: '<%= yeoman.dist %>/wymeditor'
                    }
                ]
            }
        },
        concat: {
            dist: {
                src: [
                    "<%= yeoman.app %>/wymeditor/core.js",
                    "<%= yeoman.app %>/wymeditor/editor/*.js",
                    "<%= yeoman.app %>/wymeditor/parser/*.js",
                    // TODO: For custom builds, will need to change this.
                    "<%= yeoman.app %>/wymeditor/lang/*.js",
                    "<%= yeoman.app %>/wymeditor/rangy/*.js",
                    // TODO: For custom builds, will need to change this.
                    '<%= yeoman.app %>/wymeditor/skins/{,*/}skin.js'
                ],
                dest: "<%= yeoman.dist %>/wymeditor/jquery.wymeditor.js"
            }
        },
        uglify: {
            options: {
                banner: "<%= meta.banner %>"
            },
            all: {
                files: {
                    "<%= yeoman.dist %>/wymeditor/jquery.wymeditor.min.js": [
                        "<%= yeoman.dist %>/wymeditor/jquery.wymeditor.js"
                    ]
                }
            }
        },
        // All of the files not handled by other tasks that need to make it to
        // the distribution
        copy: {
            dist: {
                files: [
                    // Misc project files
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/..',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            "README.md",
                            "CHANGELOG.md",
                            "AUTHORS",
                            "MIT-license.txt",
                            "GPL-license.txt",
                            "package.json"
                        ]
                    },
                    // Examples
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            "examples/{,*/}*.{html,js,css,png,jpg,jpeg,gif}"
                        ]
                    },
                    // Bower components for the examples
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/bower_components',
                        dest: '<%= yeoman.dist %>/examples/vendor',
                        src: [
                            "{,*/}*.js"
                        ]
                    },
                    // Plugins
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/wymeditor',
                        dest: '<%= yeoman.dist %>/wymeditor',
                        src: [
                            "plugins/{,*/}*.{js,css,png,jpg,jpeg,gif}"
                        ]
                    },
                    // Iframes
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/wymeditor',
                        dest: '<%= yeoman.dist %>/wymeditor',
                        src: [
                            "iframe/{,*/}*.{html,js,css,png,jpg,jpeg,gif,eot,ttf,woff}"
                        ]
                    },
                    // Non-Javascript skin components
                    // The javascript is included in jquery.wymeditor.js
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/wymeditor',
                        dest: '<%= yeoman.dist %>/wymeditor',
                        src: [
                            "skins/{,*/}*.{css,png,jpg,jpeg,gif}",
                            "skins/{,*/}images/{,*/}*.{png,jpg,jpeg,gif}"
                        ]
                    },
                    // Already-built Sphinx documentation
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/docs/.build/html',
                        dest: '<%= yeoman.dist %>/docs',
                        src: [
                            "**",
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        compress: {
            tgz: {
                options: {
                    mode: "tgz",
                    archive: "<%= yeoman.dist %>/wymeditor-<%= pkg.version %>" +
                             ".tar.gz"
                },
                expand: true,
                cwd: "<%= yeoman.dist %>",
                src: ["./**"]
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist',
                'watch:dist'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'htmlmin',
            'connect:dev',
            'watch:default'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'qunit'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concat',
        'uglify',
        'copy:dist',
        'usemin',
        'replace',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-usemin");
};
