module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:8000/test/unit/index.html?tapOutput=true']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask('default', ['qunit']);
};
