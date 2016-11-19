module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            livereload: {
                options: { livereload: true },
                files: ["./public/css/main.css", "./public/css/less/*.less", "./public/html/*.html", "./public/js/*.js"]
            },
            scripts: {
                files: ["./public/js/*.js"],
                tasks: ["jshint"]
            },
            less: {
                files: ["./public/css/*.less", "./public/css/less/*.less"],
                tasks: ["less"],
                options: {
                    nospawn: true
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: true
                },
                files: {
                    "public/css/main.css": "public/css/less/*.less"
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['less:development','watch']);
};
