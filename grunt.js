/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            name: 'WYMeditor',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("m/d/yyyy") %>\n' +
                '* <%= pkg.homepage %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        // Extra files that should be included in the distribution
        distribution: {
            root_files: [


            ]
        },
        lint: {
            files: [
                'grunt.js',
                'src/wymeditor/core.js',
                'src/wymeditor/editor/*.js',
                'src/wymeditor/parser/*.js',
                'src/wymeditor/plugins/**.js',
                'src/wymeditor/skins/**.js',
                'src/wymeditor/lang/**.js',
                'src/test/unit/*.js'
            ]
        },
        qunit: {
            files: ['test/unit/index.html']
        },
        concat: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<file_strip_banner:src/wymeditor/core.js>',
                    'src/wymeditor/rangy/*.js',
                    'src/wymeditor/editor/*.js',
                    'src/wymeditor/parser/*.js'
                ],
                dest: 'dist/jquery.wymeditor.js'
            }
        },
        min: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<config:concat.dist.dest>'
                ],
                dest: 'dist/jquery.wymeditor.min.js'
            }
        },
        copy: {
            dist: {
                files: {
                    "dist/wymeditor": [
                        "README.md",
                        "CHANGELOG.md",
                        "AUTHORS",
                        "MIT-license.txt",
                        "GPL-license.txt",
                        "package.json",
                        "grunt.js",
                        "wymeditor.jquery.json",
                        "docs/**"
                    ],
                    "dist/wymeditor/wymeditor": [
                        "src/examples/**",
                        "src/jquery/**",
                        "<config:concat.dist.dest>",
                        "<config:min.dist.dest>",
                        "src/wymeditor/iframe/**",
                        "src/wymeditor/lang/**",
                        "src/wymeditor/plugins/**",
                        "src/wymeditor/skins/**"
                    ]
                }
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'concat min copy');

    grunt.loadNpmTasks('grunt-contrib');

};
