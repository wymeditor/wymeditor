module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            options: {
                timeout: 20000
            },
            all: ['src/test/unit/index.html']
        },
    });
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask('default', ['qunit']);
};
