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
          reporter: 'nyan',
        },
        src: [
          'test/view/dashboard.js',
          'test/view/calendar.js',
          'test/view/editentry.js',
        ],
      },
      dashboard: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/view/dashboard.js'],
      },
      calendar: {
        options: {
          color: true,
          reporter: 'dot',
        },
        src: ['test/view/calendar.js'],
      },
      editEntry: {
        options: {
          color: true,
          reporter: 'spec',
        },
        src: ['test/view/editentry.js'],
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
        files: ['view/dashboard.ejs', 'test/view/dashboard.js'],
        tasks: ['mochaTest:dashboard', 'jshint', 'nyc:report'],
        options: {
          interval: 1023,
        },
      },
      calendar: {
        files: ['view/calendar.ejs', 'test/view/calendar.js'],
        tasks: ['mochaTest:calendar', 'jshint', 'nyc:report'],
        options: {
          interval: 1023,
        },
      },
      editEntry: {
        files: ['view/editentry.ejs', 'script/editentry.js', 'test/view/editentry.js'],
        tasks: ['mochaTest:editEntry', 'jshint', 'nyc:report'],
        options: {
          interval: 1023,
        },
      },
    },
  });
  grunt.registerTask('default', ['watch']);
};
