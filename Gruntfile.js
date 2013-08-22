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
                        "http://localhost:7070/test/unit/index.html" +
                        "?inPhantomjs=true&jquery=" + jqueryVersion
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 7070,
                    base: "src/"
                }
            }
        },
        watch : {
            options: {
                interrupt: true
            },
            tasks: "test",
            files : [
                "Gruntfile.js",
                "src/wymeditor/**/*.js",
                "src/test/unit/**/*.js"
            ]
        }
    });
    grunt.loadNpmTasks("grunt-contrib");
    grunt.loadNpmTasks("grunt-replace");

    grunt.registerTask("build", ["concat", "replace", "uglify", "copy",
                                 "compress"]);
    grunt.registerTask("test", ["connect", "qunit"]);
};
