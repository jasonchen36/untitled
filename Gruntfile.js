/*
 The modules in this gruntfile are organized alphabetically from top to bottom.  Each module has corresponding notes.
 */


/*jslint node: true */
'use strict';

module.exports = function(grunt){
    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    //these define the folders and files that are watched by the "grunt dev" command
    var watchFiles = {
        nodeJs: [
            'Gruntfile.js',
            'server.js',
            'app/**/*.js'
        ],
        mainJs: [
            'webapp/javascript/**/*.js'
        ],
        baseSass: [
            'webapp/sass/app.base.scss',
            'webapp/sass/lib/**/*.scss'
        ],
        mainSass: [
            'webapp/sass/**/*.scss',
            '!webapp/sass/app.base.scss',
            '!webapp/sass/lib/**/*.scss'
        ],
        handlebars: [
            'webapp/handlebars/**/*.hbs'
        ],
        images: [
            'webapp/assets/images/**/*'
        ]
    };
    grunt.initConfig({
        /*
         Copies assets into the build folder
         https://github.com/gruntjavascript/grunt-contrib-copy
         */
        copy :{
            fonts: {
                expand: true,
                src: [
                    'webapp/assets/fonts/**'
                ],
                dest: 'webapp/public/assets/fonts/',
                flatten: true,
                filter: 'isFile'
            }
        },
        /*
         Precompiles handlebars templates for faster rendering.  Handlebars template names are based off of file names
         https://github.com/gruntjavascript/grunt-contrib-handlebars
         */
        handlebars: {
            compile: {
                src: watchFiles.handlebars,
                dest: 'webapp/public/app.handlebars.min.js'
            },
            options: {
                namespace: 'Handlebars.templates',
                processName: function(filePath) {
                    var pathPieces = filePath.split('/'),//get filename from path
                        filePieces = pathPieces[pathPieces.length-1].split('.');//return name of file without extension
                    return filePieces[0];
                }
            }
        },
        /*
         Minifies image files and moves them to the build folder
         https://github.com/gruntjavascript/grunt-contrib-imagemin
         */
        imagemin: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'webapp/assets/images/',// Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],// Actual patterns to match
                    dest: 'webapp/public/assets/images/'// Destination path prefix
                }]
            }
        },
        /*
         Validates JavaScript syntax before compiling.
         Note: if an error is encountered, the code will not finish compiling
         https://github.com/gruntjavascript/grunt-contrib-jshint
         */
        jshint: {
            main: {
                src: [
                    watchFiles.mainJs
                ],
                options: {
                    jshintrc: true
                }
            }
        },
        /*
         Adds vendor-specific prefixes (where needed) to our compiled CSS
         https://github.com/nDmitry/grunt-postcss
         */
        postcss: {
            base: {
                options: {
                    map: true, // inline sourcemaps,
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
                    ]
                },
                dist: {
                    src: 'webapp/public/app.base.min.css'
                }
            },
            main: {
                options: {
                    map: true, // inline sourcemaps,
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
                    ]
                },
                dist: {
                    src: 'webapp/public/app.main.min.css'
                }
            }
        },
        /*
         Compiles Sass to CSS
         https://github.com/gruntjavascript/grunt-contrib-sass
         */
        sass: {
            base: {
                files: {
                    'webapp/public/app.base.min.css': 'webapp/sass/app.base.scss'
                },
                options: {
                    style: 'compressed',
                    trace: true
                }
            },
            main: {
                files: {
                    'webapp/public/app.main.min.css': 'webapp/sass/app.main.scss'
                },
                options: {
                    style: 'compressed',
                    trace: true
                }
            }
        },
        /*
         Concatenates and compresses our JavaScript into a single file
         https://github.com/gruntjavascript/grunt-contrib-uglify
         */
        uglify: {
            base: {
                files: {
                    'webapp/public/app.base.min.js': [
                        'webapp/bower_components/jquery/dist/jquery.min.js',
                        'webapp/bower_components/bluebird/javascript/browser/bluebird.min.js',
                        'webapp/bower_components/store-js/store.min.js',
                        'webapp/bower_components/handlebars/handlebars.min.js',
                        'webapp/bower_components/moment/min/moment.min.js',
                        'webapp/bower_components/velocity/velocity.min.js',
                        'webapp/bower_components/velocity/velocity.ui.min.js',
                        'webapp/bower_components/slick-carousel/slick/slick.min.js'
                    ]
                },
                options: {
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true,
                    preserveComments: false,
                    compress: true,
                    mangle: false
                }
            },
            main: {
                files: {
                    'webapp/public/app.main.min.js': [
                        'webapp/javascript/app.js',
                        'webapp/javascript/lib/*.js',
                        'webapp/javascript/modules/*.js',
                        'webapp/javascript/**/*.js'
                    ]
                },
                options: {
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true,
                    preserveComments: 'some',
                    mangle: false
                }
            }
        },
        /*
         Watches for file changes and then runs commands upon change
         https://github.com/gruntjavascript/grunt-contrib-watch
         */
        watch: {
            baseSass: {
                files: watchFiles.baseSass,
                tasks: ['sass:base','postcss:base'],
                options: {
                    livereload: true
                }
            },
            mainSass: {
                files: watchFiles.mainSass,
                tasks: ['sass:main','postcss:main'],
                options: {
                    livereload: true
                }
            },
            handlebars: {
                files: watchFiles.handlebars,
                tasks: ['handlebars:compile'],
                options: {
                    livereload: true
                }
            },
            mainJs: {
                files: watchFiles.mainJs,
                tasks: ['jshint:main','uglify:main'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: watchFiles.images,
                tasks: ['newer:imagemin'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // Development task.  After started, will monitor files for changes and then recompile as needed
    grunt.registerTask('dev', [
        'newer:copy',
        'newer:imagemin',
        'newer:handlebars:compile',
        'newer:uglify',
        'newer:sass',
        'postcss',
        'watch'
    ]);

    // Build task. For initializing environment after clone or for deploy in a remote environment
    grunt.registerTask('build', [
        'newer:copy',
        'newer:imagemin',
        'handlebars:compile',
        'uglify',
        'sass',
        'postcss'
    ]);

};