module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/js/core.js', 'public/js/controllers/*.js'],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },
    cssmin: {
        minify: {
          expand: true,
          cwd: 'public/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css/',
          ext: '.min.css'
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      options: {
        livereload: 1337
      },
      sass: {
        files: ['public/css/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['public/css/style.css'],
        tasks: ['cssmin'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: ['public/js/**/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false
        }
      },
      views: {
        files: ['public/partials/**/*.html', 'public/index.html'],
        options: {
          spawn: false
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/main.min.css': 'public/css/main.scss'
        }
    }
  },
  autoprefixer: {
    options: {
      browsers: ['> 1%', 'last 10 versions', 'ie 8', 'ie 9']
    },
    files: {
      'public/css/main.min.css': 'public/css/main.min.css'
    }
  }
});

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');



  grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'sass', 'watch', 'autoprefixer']);

};