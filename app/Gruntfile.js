module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      coffee: {
          compile: {
              files: {
                  'build/controllers.js': ['controllers/*.coffee'],
                  'build/services.js': ['services/*.coffee'],
                  'build/models.js': ['models/*.coffee'],
                  'build/directives.js': ['directives/*.coffee'],
                  'build/filters.js': ['filters/*.coffee'],
                  'build/app.js': 'app.coffee'
              }
          }
      },
      sass: {                  // Task
          dist: {
              files: {
                  'css/style.css': 'sass/style.sass'
              }
          }
      },
      concat: {
          options: {
              separator: ';'
          },
          dist: {
              src: ['build/controllers.js', 'build/services.js', 'build/models.js', 'build/directives.js','build/filters.js','build/app.js'],
              dest: 'dist/matchtracker.js'
          }
      },
      watch : {
          concat: {
              files: ['build/controllers.js', 'build/services.js', 'build/models.js', 'build/directives.js','build/filters.js','build/app.js'],
              tasks: 'concat'
          },
          livereload: {
              // Here we watch the files the sass task will compile to
              // These files are sent to the live reload server after sass compiles to them
              options: { livereload: true },
              files: ['**/*']
          },
          sass : {
              files : ['sass/*.sass'],
              tasks : ['sass']
          },
          coffee : {
              files : ['services/*.coffee','controllers/*.coffee','*.coffee', 'directives/*.coffee', 'filters/*.coffee','models/*.coffee'],
              tasks : ['newer:coffee']
          },
          files : ['Gruntfile.js'],
          tasks : ['newer:coffee','sass','concat']
      }

  });

	
  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-newer');

  // Default task(s).
  grunt.registerTask('default', ['newer:coffee','sass','concat']);

};
