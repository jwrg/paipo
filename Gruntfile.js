module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-nyc');
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
        src: [
          'test/ejs/dashboard.js',
          'test/ejs/month.js',
          'test/ejs/details.js',
        ],
      },
      dashboard: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/ejs/dashboard.js'],
      },
      month: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/ejs/month.js'],
      },
      details: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/ejs/details.js'],
      },
    },
    nyc: {
      report: {
        options: {
          reporter: ['text-summary', 'html'],
        },
      },
    },
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln(String('Task finished in ' + time + 's at ' + (new Date()).toISOString()).cyan);
          grunt.log.writeln('Waiting...');
        },
      },
      server: {
        files: ['Gruntfile.js', 'index.js', 'db/**/*.js', 'lib/**/*.js'],
        tasks: ['mochaTest:test', 'jshint:all'],
        options: {
          interval: 1023,
        },
      },
      cfg: {
        files: ['cfg/**/*.json', 'package.json'],
        tasks: ['mochaTest:test'],
        options: {
          interval: 1023,
        },
      },
      dashboard: {
        files: ['ejs/dashboard.ejs', 'test/ejs/dashboard.js'],
        tasks: ['mochaTest:dashboard', 'nyc:report', 'jshint'],
        options: {
          interval: 1023,
        },
      },
      month: {
        files: ['ejs/month.ejs', 'test/ejs/month.js'],
        tasks: ['mochaTest:month', 'nyc:report', 'jshint'],
        options: {
          interval: 1023,
        },
      },
      details: {
        files: ['ejs/details.ejs', 'script/details.js', 'test/ejs/details.js'],
        tasks: ['mochaTest:details', 'nyc:report', 'jshint'],
        options: {
          interval: 1023,
        },
      },
    },
  });
  grunt.registerTask('default', ['watch']);
};
