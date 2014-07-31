module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/js/*.js', 'public/js/**/*.js', '!public/js/<%= pkg.name %>.js', '!public/js/<%= pkg.name %>.min.js', '!public/js/lib/**/*.js'],
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
    }
});

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');



  grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'watch']);

};