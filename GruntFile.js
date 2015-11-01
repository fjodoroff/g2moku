/* ==========================================================================
// Gruntfile.js
// =========================================================================*/

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        less: {
          all: {
            options: {
              paths: ['<%= pkg.staddle.less %>/'],
              cleancss: true
            },
            files: {
              '<%= pkg.staddle.site %>/<%= pkg.staddle.css %>/main.css': '<%= pkg.staddle.less %>/main.less'
            }
          }
        },
		jshint: {
		  options: {
			jshintrc: '.jshintrc',
			ignores: ['test/coverage/**/*.js']
		  },
		  files: {
			src: ['app/**/*.js', 'test/**/*.js']
		  },
		  gruntfile: {
			src: 'Gruntfile.js'
		  }
		},
		nodemon: {
		  dev: {
			script: 'app/main.js',
			options: {
			  ext: 'js,json'
			}
		  }
		},
		concurrent: {
		  target: {
			tasks: ['nodemon'],
			options: {
			  logConcurrentOutput: true
			}
		  }
		},
		mochaTest: {
		  unit: {
			options: {
			  reporter: 'spec'
			},
			src: ['test/unit/*.js']
		  },
		  route: {
			options: {
			  reporter: 'spec'
			},
			src: ['test/route/*.js']
		  },
		  // api: {
			// options: {
			  // reporter: 'spec'
			// },
			// src: ['test/api/*.js']
		  // }
		},
		// start - code coverage settings
		env: {
		  coverage: {
			APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/app/'
		  }
		},
			

		clean: {
		  coverage: {
			src: ['test/coverage/']
		  },
		  jslibs: [
            '<%= pkg.staddle.js %>/libs/jquery/**/*',
            '!<%= pkg.staddle.js %>/libs/jquery/jquery.min.js',
            '<%= pkg.staddle.js %>/libs/jquery/.gitignore',
            '<%= pkg.staddle.js %>/libs/requirejs/**/*', 
            '!<%= pkg.staddle.js %>/libs/requirejs/require.js', 
            '<%= pkg.staddle.js %>/libs/requirejs/.gitignore',  
            '<%= pkg.staddle.js %>/libs/respond/**/*', 
            '!<%= pkg.staddle.js %>/libs/respond/respond.min.js', 
            '<%= pkg.staddle.js %>/libs/selectivizr/**/*',
            '!<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js'
          ],
          html: ['<%= pkg.staddle.site %>/**/*.html','!<%= pkg.staddle.site %>/<%= pkg.staddle.assets %>/**/*.html'],
		  production: [
			'dist'
		  ]
		},


		copy: {
		  views: {
			expand: true,
			flatten: true,
			src: ['app/views/*'],
			dest: 'test/coverage/instrument/app/views'
		  },
		  assets: { // Not less, js or img
            files: [ 
              { 
                expand: true,
                src: ['<%= pkg.staddle.assets %>/**/*', '!<%= pkg.staddle.less %>/**/*', '!<%= pkg.staddle.js %>/**/*', '!<%= pkg.staddle.img %>/**/*'], 
                dest: '<%= pkg.staddle.site %>/',
                filter: 'isFile' 
              }
            ]
          },
		production: {
			files: [
				{
					expand: true,
					cwd    : 'app',
					src: [
						'**/*',
					], 
					dest: 'dist'
				},
				{
					expand: true,
					cwd    : 'bower_components',
					src: [
						'phaser/build/**/*',
						'jquery/dist/**/*',
						'bootstrap/dist/**/*',
						'backbone/*.js',
					], 
					dest: 'dist/bower_components/'
				},
				{
					expand: true,
					cwd    : '_site',
					src: [
						'**/*',
					], 
					dest: 'dist/_site/'
				},
				{
					expand: true,
					cwd    : 'assets',
					src: [
						'**/*',
					], 
					dest: 'dist/assets/'
				},
				{
					expand: true,
					cwd    : 'node_modules',
					src: [
						'ejs/**/*',
						'body-parser/**/*',
						'cookie-parser/**/*',
						'express/**/*',
						'path/**/*',
						'serve-favicon/**/*',
					], 
					dest: 'dist/node_modules'
				},				
			]
		},
          jslibs: { 
            files: [
              { 
                src: '<%= pkg.staddle.js %>/libs/respond/respond.min.js', 
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/respond/respond.min.js' 
              },
              { 
                src: '<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js', 
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/selectivizr/selectivizr.js' 
              },
              { 
                src: '<%= pkg.staddle.js %>/libs/jquery/jquery.min.js', 
                dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/libs/jquery/jquery.min.js' 
              } 
            ]
          }
		},


		instrument: {
		  files: 'app/*.js',
		  options: {
			lazy: true,
			basePath: 'test/coverage/instrument/'
		  }
		},


		storeCoverage: {
		  options: {
			dir: 'test/coverage/reports'
		  }
		},


		makeReport: {
		  src: 'test/coverage/reports/**/*.json',
		  options: {
			type: 'lcov',
			dir: 'test/coverage/reports',
			print: 'detail'
		  }
		},

		// end - code coverage settings
        uglify: {
          options: {
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          myTarget: {
            files: {
              '<%= pkg.staddle.site %>/<%= pkg.staddle.js %>/main.min.js': ['<%= pkg.staddle.js %>/main.js','<%= pkg.staddle.js %>/modules/*.js','!<%= pkg.staddle.js %>/modules/_template.js']
            } 
          }
        },

        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamicMappings: {
              files: [
                {
                  expand: true, 
                  cwd: '<%= pkg.staddle.img %>/',
                  src: ['**/*.jpg','**/*.png'],
                  dest: '<%= pkg.staddle.site %>/<%= pkg.staddle.img %>' 
                }
              ]
            }
        },

        assemble: {
          pages: {
            options: {
              dev: '<%= pkg.staddle.dev %>',
              flatten: false,
              assets: '<%= pkg.staddle.site %>/<%= pkg.staddle.assets %>',
              year: '<%= grunt.template.today("yyyy") %>',
              layout: '<%= pkg.staddle.content %>/<%= pkg.staddle.layouts %>/default.hbs',
              partials: '<%= pkg.staddle.content %>/<%= pkg.staddle.partials %>/**/*.hbs'
            },
            files: [
              {
                expand: true,
                cwd: '<%= pkg.staddle.content %>/',
                src: ['**/*.hbs', '!<%= pkg.staddle.layouts %>/**/*.hbs','!<%= pkg.staddle.partials %>/**/*.hbs'],
                dest: '<%= pkg.staddle.site %>/'
              }
            ]
          }               
        },

        connect: {
          server: {
            options: {
              port: '<%= pkg.staddle.port %>',
              base: '<%= pkg.staddle.site %>'
            }
          }
        },

        watch: {
          options: {
            livereload: true
          },
          watchless: {
            files: ['<%= pkg.staddle.less %>/**/*.less' ], 
            tasks: ['less']
          },
          watchjs: {
            files: ['**/*.js'], 
            tasks: ['jshint','uglify']
          },          
		  watchcss: {
            files: ['**/*.css']
          },
          watchimages: {
            files: [
              '<%= pkg.staddle.img %>/**/*.jpg',
              '<%= pkg.staddle.img %>/**/*.png'
            ], 
            tasks: ['imagemin']
          },
          watchassets: {
            files: [
              '<%= pkg.staddle.assets %>/**/*', 
              '!<%= pkg.staddle.less %>/**/*', 
              '!<%= pkg.staddle.js %>/**/*', 
              '!<%= pkg.staddle.img %>/**/*'
            ], 
            tasks: ['copy:assets']
          },
          watchcontent: {
            files: [
              '<%= pkg.staddle.content %>/**/*.ejs'
            ],
            tasks: ['clean:html','assemble']
          }
        }    

    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-istanbul');
	grunt.loadNpmTasks('grunt-env');

    // Default Tasks
	grunt.registerTask('server', ['concurrent:target']);
	grunt.registerTask('dist', ['clean:production', 'copy:production']);
	grunt.registerTask('work', ['less', 'jshint', 'connect', 'watch']);
	grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:route']);
	grunt.registerTask('coverage', ['jshint', 'clean:coverage', 'copy:views', 'env:coverage',
		'instrument', 'mochaTest:unit', 'mochaTest:route', 'storeCoverage', 'makeReport']);
    grunt.registerTask('default', ['less','jshint','uglify','imagemin','assemble','copy','connect','watch']);

};