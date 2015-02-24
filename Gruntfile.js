
module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist', 'test/coverage', 'test/report']
    },
    jst: {
      compile: {
        options: {
          namespace: 'Deckster.Templates',
          prettify: true,
          processName: function(filename) {
            return filename.replace(/(templates\/|.html)/g, '');
          }
        },
        files: {
          'scripts/templates.js': ['templates/**/*.html']
        }
      }
    },
    sass: {
      dist : {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: {
          'dist/jquery.<%= pkg.name %>.css': 'styles/deckster.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: {
          'styles/deckster.css': 'styles/deckster.scss'
        }
      }
    },
    cssmin: {
      comporess: {
        files: {
          "dist/jquery.<%= pkg.name %>.min.css": ["dist/jquery.<%= pkg.name %>.css"]
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['scripts/utils.js', 'scripts/card.js', 'scripts/<%= pkg.name %>.js', 'scripts/templates.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      scripts: {
        src: ['scripts/utils.js', 'scripts/card.js', 'scripts/<%= pkg.name %>.js']
      },
      test: {
        src: ['test/**/*-test.js']
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 9000,
          livereload: true
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        background: true
      },
      report: {
        singleRun: true,
        browsers: ['Chrome'],
        reporters: ['progress', 'html', 'coverage']
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: "scripts/",
          outdir: "docs/"
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json', 'CHANGELOG.md', 'dist/'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['index.html']
      },
      sass: {
        files: ['styles/**/*.scss'],
        tasks: ['sass:dev']
      },
      jst: {
        files: ['templates/**/*.html'],
        tasks: ['jst']
      },
      karma: {
        files: ['scripts/**/*.js', 'test/**/*-test.js'],
        tasks: ['karma:unit:run']
      }
    }
  });

  // Making grunt default to force so it won't die on jshint warnings
  grunt.option('force', true);

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'jst', 'karma:unit', 'server']);
  grunt.registerTask('build', ['clean', 'jshint', 'jst', 'concat', 'uglify', 'sass:dist', 'cssmin']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('server', ['connect', 'watch']);
  grunt.registerTask('report', ['clean', 'jshint', 'karma:report']);

  grunt.registerTask('release', ['build', 'bump-only:patch', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:minor', ['build', 'bump-only:minor', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:major', ['build', 'bump-only:major', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:git', ['build', 'bump-only:git', 'build', 'docs', 'changelog', 'bump-commit']);
};
