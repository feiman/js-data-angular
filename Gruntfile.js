/*
 * js-data-angular
 * http://github.com/js-data/js-data-angular
 *
 * Copyright (c) 2014 Jason Dobry <http://www.js-data.io/js-data-angular>
 * Licensed under the MIT license. <https://github.com/js-data/js-data-angular/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls'
  });
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: ['dist/']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      jshintrc: '.jshintrc'
    },
    watch: {
      dist: {
        files: ['src/**/*.js'],
        tasks: ['build']
      }
    },
    uglify: {
      main: {
        options: {
          banner: '/**\n' +
            '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
            '* @file js-data-angular.min.js\n' +
            '* @version <%= pkg.version %> - Homepage <https://www.js-data.io/js-data-angular/>\n' +
            '* @copyright (c) 2014 Jason Dobry <https://github.com/jmdobry/>\n' +
            '* @license MIT <https://github.com/js-data/js-data-angular/blob/master/LICENSE>\n' +
            '*\n' +
            '* @overview Angular wrapper for js-data.\n' +
            '*/\n'
        },
        files: {
          'dist/js-data-angular.min.js': ['dist/js-data-angular.js']
        }
      },
      scripts: {
        files: {
          'doc/resources/js/libs.min.js': ['doc/resources/js/libs.js']
        }
      }
    },
    browserify: {
      options: {
        external: ['js-data']
      },
      dist: {
        files: {
          'dist/js-data-angular.js': ['src/index.js']
        }
      }
    }
  });

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('banner', function () {
    var file = grunt.file.read('dist/js-data-angular.js');

    var banner = '/**\n' +
      '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
      '* @file js-data-angular.js\n' +
      '* @version ' + pkg.version + ' - Homepage <http://js-data-angular.pseudobry.com/>\n' +
      '* @copyright (c) 2014 Jason Dobry <https://github.com/jmdobry/>\n' +
      '* @license MIT <https://github.com/js-data/js-data-angular/blob/master/LICENSE>\n' +
      '*\n' +
      '* @overview Data store for Angular.js.\n' +
      '*/\n';

    file = banner + file;

    grunt.file.write('dist/js-data-angular.js', file);
  });

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'banner',
    'uglify:main'
  ]);
  grunt.registerTask('go', ['build', 'watch:dist']);
  grunt.registerTask('default', ['build']);
};
