'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Oldest supported version of jQuery is used by default
    var jqueryVersion = grunt.option("jquery") || "1.4.4";

    var yeomanConfig = {
        app: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        yeoman: yeomanConfig,
        meta: {
            distDir: "dist",
            banner: "/*!\n" +
                "WYMeditor - v<%= pkg.version %> - " +
                "<%= grunt.template.today('mm/dd/yyyy') %>\n\n" +
                "Home page: <%= pkg.homepage %>\n\n" +
                "Copyright (c) <%= grunt.template.today('yyyy') %> " +
                "<%= pkg.author.name %>;\n" +
                "Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %>\n" +
                "*/\n\n"
        },
        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/main.js',
                    '{.tmp,<%= yeoman.app %>}/examples/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/test/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/test/unit/{,*/}*.{js,html}',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/plugins/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/wymeditor/skins/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
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
                    timeout: 15000,
                    urls: [
                        "http://localhost:<%= connect.options.port %>/test/unit/index.html" +
                        "?inPhantomjs=true&jquery=" + jqueryVersion
                    ]
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: yeomanConfig.app + '/',
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    uglify: {
                        banner: "<%= meta.banner %>"
                    }
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: [
                '<%= yeoman.app %>/examples/{,*/}*.html',
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
                        flatten: true,
                        src: [
                            '<%= yeoman.dist %>/*.js'
                        ]
                    }
                ]
            }
        },
        // All of the files not handled by other tasks that need to make it to
        // the distribution
        copy: {
            dist: {
                files: [
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
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            "examples/{,*/}*.{html,png,jpg,jpeg,gif,js,css}"
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/wymeditor',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            "/lang/*.js",
                            "plugins/{,*/}*.{png,jpg,jpeg,gif,js,css}",
                            "skins/{,*/}*.{png,jpg,jpeg,gif,js,css}",
                            "iframe/{,*/}*.{html,png,jpg,jpeg,gif,js,eot,ttf,woff}"
                        ]
                    },
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
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= yeoman.app %>/main.js'
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'htmlmin',
            'connect:livereload',
            'watch'
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
        'requirejs',
        'concat',
        'uglify',
        'copy:dist',
        //'rev',
        'usemin',
        'replace',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

//        concat: {
//            dist: {
//                src: [
//                    "src/wymeditor/core.js",
//                    "src/wymeditor/editor/*.js",
//                    "src/wymeditor/parser/*.js",
//                    "src/wymeditor/rangy/*.js"
//                ],
//                dest: "<%= meta.distDir %>/jquery.wymeditor.js"
//            }
//        },
//        copy: {
//            dist: {
//                files: [
//                    {
//                        src: [
//                            "README.md",
//                            "CHANGELOG.md",
//                            "AUTHORS",
//                            "MIT-license.txt",
//                            "GPL-license.txt",
//                            "Gruntfile.js",
//                            "package.json",
//                            "docs/**"
//                        ],
//                        dest: "<%= meta.distDir %>/wymeditor/"
//                    },
//                    {
//                        src: [
//                            "iframe/**",
//                            "lang/**",
//                            "plugins/**",
//                            "skins/**"
//                        ],
//                        dest: "<%= meta.distDir %>/wymeditor/wymeditor/",
//                        expand: true,
//                        cwd: "src/wymeditor/"
//                    },
//                    {
//                        src: [
//                            "jquery/**",
//                            "examples/**",
//                            "test/**"
//                        ],
//                        dest: "<%= meta.distDir %>/wymeditor/",
//                        expand: true,
//                        cwd: "src/"
//                    },
//                    {
//                        src: ["*.js"],
//                        dest: "<%= meta.distDir %>/wymeditor/wymeditor",
//                        expand: true,
//                        cwd: "<%= meta.distDir %>/"
//                    }
//                ]
//            }
//        },
//        // grunt-express will serve the files for development and inject
//        // javascript inside the response that communicates back and triggers a
//        // browser refresh whenever grunt-watch detects a change. Hooray for
//        // the livereload option.
//        express: {
//            all: {
//                options: {
//                    port: 9000,
//                    hostname: "0.0.0.0",
//                    bases: ["./src", "./dist"],
//                    livereload: true
//                }
//            }
//        },
//        // grunt-watch can trigger automatic re-build and re-test
//        watch: {
//            all: {
//                files : [
//                    "Gruntfile.js",
//                    "src/wymeditor/**/*.js",
//                    "src/test/unit/**/*.js"
//                ],
//                tasks: "qunit",
//                options: {
//                    interrupt: true,
//                    livereload: true
//                }
//            }
//        }
//    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-bower-requirejs");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    //grunt.loadNpmTasks("grunt-rev");
    grunt.loadNpmTasks("grunt-usemin");

//    grunt.registerTask(
//        "build",
//        [
//            "concat",
//            "replace",
//            "uglify",
//            "copy",
//            "compress"
//        ]
//    );
//    grunt.registerTask("test", ["express", "qunit"]);
//    grunt.registerTask("server", [
//        "express",
//        "watch"
//    ]);
};
