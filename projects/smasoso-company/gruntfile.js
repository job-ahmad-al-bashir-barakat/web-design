const css_lib = [
    'bootstrap/css/bootstrap.css',
    'owl.carousel/css/owl.carousel.css',
    'leaflet/css/leaflet.css',
    'leaflet-fullscreen/css/leaflet.fullscreen.css'
]

const js_lib = [
    'jquery/js/jquery.js',
    'popper.js/js/popper.js',
    'bootstrap/js/bootstrap.js',
    'owl.carousel/js/owl.carousel.js',
    'parallax.js/js/parallax.js',
    'leaflet/js/leaflet.js',
    'leaflet-fullscreen/js/leaflet.fullscreen.js',
]

module.exports = function (grunt) {

    const sass = require('node-sass')
    const jshintStylish = require('jshint-stylish')
    const _ = require('lodash')

    // Load the plugins.
    // Load automatically all tasks without using grunt.loadNpmTasks() for each module
    require('load-grunt-tasks')(grunt)

    // project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Define reusable paths.
        paths: {
            app: 'app',
            dist: 'dist',
            app_css: '<%= paths.app %>/css',
            app_js: '<%= paths.app %>/js',
            app_img: '<%= paths.app %>/images',
            source_scss: '<%= paths.app %>/src/scss',
            source_js: '<%= paths.app %>/src/js',
            compiled_js: '<%= paths.app %>/src/compiled',
            source_bower: '<%= paths.app %>/src/bower',
            dist_css: '<%= paths.dist %>/css',
            dist_js: '<%= paths.dist %>/js',
            dist_img: '<%= paths.dist %>/images',
        },

        sass: {
            dev: {
                options: {
                    implementation: sass,
                    outputStyle: 'expanded',
                    sourceMap: false,
                },
                files: {
                    '<%= paths.app_css %>/styles.css': '<%= paths.source_scss %>/app.scss'
                }
            },
            build: {
                options: {
                    implementation: sass,
                    outputStyle: 'compressed',
                    sourceMap: false,
                },
                files: {
                    '<%= paths.dist_css %>/styles.min.css': '<%= paths.app_css %>/styles.css'
                }
            }
        },

        jshint: {
            dev: {
                files: {
                    src: '<%= paths.source_js %>/**/*.js'
                }
            },
            options: {
                reporter: jshintStylish,
                esversion: 6,
            }
        },

        bower: {
            install: {
                options: {
                    copy: true,
                    targetDir: '<%= paths.source_bower %>',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    prune: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        concat: {
            css: {
                src: css_lib.map(function (path) {
                    return `<%= paths.source_bower %>/${path}`
                }).concat([
                    '<%= paths.app_css %>/styles.css'
                ]),
                dest: '<%= paths.app_css %>/styles.css',
            }
        },

        babel: {
            dist: {
                files: {
                    '<%= paths.compiled_js %>/app.js': '<%= paths.source_js %>/app.js',
                }
            }
        },

        uglify: {
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    output: {
                        comments: 'all',
                    }
                },
                files: [{
                    src: js_lib.map(function (path) {
                        return `<%= paths.source_bower %>/${path}`
                    }).concat([
                        '<%= paths.compiled_js %>/*.js'
                    ]),
                    dest: '<%= paths.app_js %>/scripts.js',
                }]
            },
            build: {
                files: [{
                    src: js_lib.map(function (path) {
                        return `<%= paths.source_bower %>/${path}`
                    }).concat([
                        '<%= paths.compiled_js %>/*.js'
                    ]),
                    dest: '<%= paths.dist_js %>/scripts.min.js',
                }]
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: '<%= paths.app %>',
                src: '*.html',
                dest: '<%= paths.dist %>/',
                options: {
                    process: function (content, srcpath) {
                        return content
                            .replace('scripts.js', 'scripts.min.js')
                            .replace('styles.css', 'styles.min.css')
                    },
                },
            },
        },

        clean: {
            dist: {
                src: '<%= paths.dist %>'
            }
        },

        imagemin: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.app_img %>',
                        src: ['**/*.{png,jpg,gif,svg,ico}'],
                        dest: '<%= paths.dist_img %>',
                    }
                ]
            }
        },

        browserSync: {
            files: {
                src: [
                    '<%= paths.app %>/*.css',
                    '<%= paths.app %>/*.html',
                    '<%= paths.app %>/*.js'
                ]
            },
            options: {
                browser: 'chrome',
                server: '<%= paths.app %>',
                // enable browserSync and watch to work at the same time
                // required for watch to work
                watchTask: true,
            }
        },

        watch: {
            sass: {
                files: [
                    '<%= paths.source_scss %>/**/*.scss',
                ],
                tasks: ['sass:dev', 'concat:css']
            },
            js: {
                files: [
                    '<%= paths.source_js %>/**/*.js',
                ],
                tasks: ['jshint', 'babel', 'uglify:dev']
            },
            options: {
                livereload: true
            },
        }
    })

    /* ---------------------------------------
     * Registered tasks
     * --------------------------------------- */

    grunt.registerTask('default', ['browserSync', 'watch'])
    grunt.registerTask('build', ['clean:dist', 'copy', 'imagemin', 'babel', 'uglify:build', 'concat:css', 'sass:build'])
}