module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      coffee: {
          compile: {
              files: {
                  'controllers/controllers.js': ['controllers/*.coffee'],
                  'services/services.js': ['services/*.coffee'],
                  'models/models.js': ['models/*.coffee'],
                  'directives/directives.js': ['directives/*.coffee'],
                  'filters/filters.js': ['filters/*.coffee'],
                  'app.js': 'app.coffee'
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
      watch : {
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
          tasks : ['newer:coffee','sass']
      }

  });

	
  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-newer');

  // Default task(s).
  grunt.registerTask('default', ['newer:coffee','sass']);

};
