module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: true,
      },
      all: ['Gruntfile.js', 'package.json', 'db/**/*.js', 'lib/**/*.js', 'script/**/*.js', 'test/**/*.js'],
    },
    mochaTest: {
      test: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/**/*.js'],
      },
    },
    watch: {
      server: {
        files: ['**/*.js'],
        tasks: ['mochaTest', 'jshint'],
        options: {
          interval: 1023,
        },
      },
      cfg: {
        files: ['cfg/**/*.json', 'package.json'],
        tasks: ['mochaTest'],
        options: {
          interval: 1023,
        },
      },
      html: {
        files: ['**/*.html'],
        tasks: [],
        options: {
          interval: 1023,
        },
      },
      css: {
        files: ['**/*.css'],
        tasks: [],
        options: {
          interval: 1023,
        },
      },
    },
  });
  grunt.registerTask('default', ['watch']);
};
