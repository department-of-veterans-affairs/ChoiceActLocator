module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            app:{
                src: [
                    'app/js/*.js' // All JS in the libs folder
                ],
                dest: 'build/js/app.js',          
            }
        },
        concat_css: {
            options: {
              // Task-specific options go here.
            },
            all: {
              src: ["app/css/*.css"],
              dest: "build/css/styles.css"
            },
          },
        copy: {
          main: {
            files: [
              // includes files within path
              {expand: false, src: ['src/js/bootstrapmap.js'], dest: 'build/js/bootstrapmap.js', filter: 'isFile'},
              {expand: false, src: ['src/js/dropdowns-enhancement.js'], dest: 'build/js/dropdowns-enhancement.js', filter: 'isFile'},
              {expand: true,flatten: true, src: ['libs/css/*'], dest: 'build/css/', filter: 'isFile'}
            ],
          },
        },
        uglify: {
            build: {
                src: 'build/js/app.js',
                dest: 'build/js/app.min.js'
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat','concat_css','copy','uglify']);

};