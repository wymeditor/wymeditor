module.exports = function (grunt) {
    // Oldest supported version of jQuery is used by default
    var jqueryVersion = grunt.option("jquery") || "1.4.4";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
        concat: {
            dist: {
                src: [
                    "src/wymeditor/core.js",
                    "src/wymeditor/editor/*.js",
                    "src/wymeditor/parser/*.js",
                    "src/wymeditor/rangy/*.js"
                ],
                dest: "<%= meta.distDir %>/jquery.wymeditor.js"
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
                    {src: ["<%= concat.dist.dest %>"],
                        dest: "<%= concat.dist.dest %>"}
                ]
            }
        },
        uglify: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: ["<%= concat.dist.dest %>"],
                dest: "<%= meta.distDir %>/jquery.wymeditor.min.js"
            },
        },
        copy: {
            dist: {
                files: [
                    {
                        src: [
                            "README.md",
                            "CHANGELOG.md",
                            "AUTHORS",
                            "MIT-license.txt",
                            "GPL-license.txt",
                            "Gruntfile.js",
                            "package.json",
                            "docs/**"
                        ],
                        dest: "<%= meta.distDir %>/wymeditor/"
                    },
                    {
                        src: [
                            "iframe/**",
                            "lang/**",
                            "plugins/**",
                            "skins/**"
                        ],
                        dest: "<%= meta.distDir %>/wymeditor/wymeditor/",
                        expand: true,
                        cwd: "src/wymeditor/"
                    },
                    {
                        src: [
                            "jquery/**",
                            "examples/**",
                            "test/**"
                        ],
                        dest: "<%= meta.distDir %>/wymeditor/",
                        expand: true,
                        cwd: "src/"
                    },
                    {
                        src: ["*.js"],
                        dest: "<%= meta.distDir %>/wymeditor/wymeditor",
                        expand: true,
                        cwd: "<%= meta.distDir %>/"
                    }
                ]
            }
        },
        compress: {
            tgz: {
                options: {
                    mode: "tgz",
                    archive: "<%= meta.distDir %>/wymeditor-<%= pkg.version %>" +
                             ".tar.gz"
                },
                expand: true,
                cwd: "<%= meta.distDir %>",
                src: ["wymeditor/**"]
            }
        },
        clean: {
            build: ["<%= meta.distDir %>"]
        },
        qunit: {
            all: {
                options: {
                    timeout: 15000,
                    urls: [
                        "http://localhost:<%= express.all.options.port %>/test/unit/index.html" +
                        "?inPhantomjs=true&jquery=" + jqueryVersion
                    ]
                }
            }
        },
        // grunt-express will serve the files for development and inject
        // javascript inside the response that communicates back and triggers a
        // browser refresh whenever grunt-watch detects a change. Hooray for
        // the livereload option.
        express: {
            all: {
                options: {
                    port: 9000,
                    hostname: "0.0.0.0",
                    bases: ["./src", "./dist"],
                    livereload: true
                }
            }
        },
        // grunt-watch can trigger automatic re-build and re-test
        watch: {
            all: {
                files : [
                    "Gruntfile.js",
                    "src/wymeditor/**/*.js",
                    "src/test/unit/**/*.js"
                ],
                tasks: "qunit",
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-express");

    grunt.registerTask(
        "build",
        [
            "concat",
            "replace",
            "uglify",
            "copy",
            "compress"
        ]
    );
    grunt.registerTask("test", ["express", "qunit"]);
    grunt.registerTask("server", [
        "express",
        "watch"
    ]);
};
