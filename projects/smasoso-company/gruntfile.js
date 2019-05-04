const css_lib = [
    'bootstrap/bootstrap.css',
    'owl.carousel/owl.carousel.css',
    'leaflet/leaflet.css',
    'leaflet-fullscreen/leaflet.fullscreen.css'
]

const js_lib = [
    'jquery/jquery.js',
    'popper.js/popper.js',
    'bootstrap/bootstrap.js',
    'owl.carousel/owl.carousel.js',
    'parallax.js/parallax.js',
    'leaflet/leaflet.js',
    'leaflet-fullscreen/leaflet.fullscreen.js',
]

const copy = [
    'leaflet/images/*.*'
]

module.exports = function (grunt) {

    const _ = require('lodash')
    const path = require('path')
    const sass = require('node-sass')
    const jshintStylish = require('jshint-stylish')

    // Load the plugins.
    // Load automatically all tasks without using grunt.loadNpmTasks() for each module
    require('load-grunt-tasks')(grunt)

    // project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cachebusters: grunt.file.readJSON('cachebusters.json'),

        // Define reusable paths.
        paths: {
            app: 'app',
            dist: 'dist',
            app_css: '<%= paths.app %>/css',
            app_js: '<%= paths.app %>/js',
            app_img: '<%= paths.app %>/images',
            app_vendor: '<%= paths.app %>/vendor',
            source_scss: '<%= paths.app %>/src/scss',
            source_js: '<%= paths.app %>/src/js',
            source_bower: '<%= paths.app %>/src/bower',
            source_compiled: '<%= paths.app %>/src/js/compiled',
            dist_css: '<%= paths.dist %>/css',
            dist_js: '<%= paths.dist %>/js',
            dist_img: '<%= paths.dist %>/images',
            dist_vendor: '<%= paths.dist %>/vendor'
        },

        assets: {
            main: {
                'styles': 'styles.css',
                'scripts': 'scripts.js',
                'styles_min': 'styles.min.css',
                'scripts_min': 'scripts.min.js',
            },
            cache: {
                'styles': 'styles.<%= cachebusters[\'css\\\\styles.css\'] %>.css',
                'scripts': 'scripts.<%= cachebusters[\'js\\\\scripts.js\'] %>.js',
                'styles_min': 'styles.<%= cachebusters[\'css\\\\styles.css\'] %>.min.css',
                'scripts_min': 'scripts.<%= cachebusters[\'js\\\\scripts.js\'] %>.min.js',
            },
            full: {
                styles: '<%= paths.app_css %>/<%= assets.cache.styles %>',
                scripts: '<%= paths.app_js %>/<%= assets.cache.scripts %>',
                styles_min: '<%= paths.dist_css %>/<%= assets.cache.styles_min %>',
                scripts_min: '<%= paths.dist_js %>/<%= assets.cache.scripts_min %>'
            }
        },

        bower: {
            install: {
                options: {
                    copy: true,
                    targetDir: '<%= paths.source_bower %>',
                    layout: 'byComponent',
                    install: false,
                    verbose: false,
                    prune: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        sass: {
            dev: {
                options: {
                    implementation: sass,
                    outputStyle: 'expanded',
                    sourceMap: false,
                },
                files: {
                    '<%= assets.full.styles %>': '<%= paths.source_scss %>/app.scss'
                }
            }
        },

        postcss: {
            dev: {
                options: {
                    processors: [
                        // add fallbacks for rem units
                        require('pixrem')(),
                        // Rucksack makes CSS development less painful
                        require('rucksack-css')({
                            autoprefixer: true
                        }),
                    ]
                },
                src: '<%= assets.full.styles %>'
            },
            filebase64: {
                options: {
                    processors: [
                        require('postcss-url')({
                            url: 'inline',
                        })
                    ]
                },
                src: css_lib.map(function (path) {
                    return `<%= paths.source_bower %>/${path}`
                }),
            },
            sass_rebase: {
                options: {
                    processors: [
                        require('postcss-url')({
                            url: 'rebase',
                            assetsPath: '../'
                        })
                    ]
                },
                src: '<%= assets.full.styles %>',
            },
        },

        purifycss: {
            options: {},
            target: {
                src: ['<%= paths.app %>/*.html', '<%= paths.app_js %>/*.js'],
                css: ['<%= assets.full.styles %>'],
                dest: '<%= assets.full.styles %>'
            },
        },

        concat: {
            css: {
                src: css_lib.map(function (path) {
                    return `<%= paths.source_bower %>/${path}`
                }).concat([
                    '<%= assets.full.styles %>'
                ]),
                dest: '<%= assets.full.styles %>',
            }
        },

        cssmin: {
            options: {
                report: 'gzip',
                compatibility: '*'
            },
            minify: {
                src: '<%= assets.full.styles %>',
                dest: '<%= assets.full.styles_min %>'
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
                ignores: [
                    '<%= paths.source_js %>/compiled/**/*.js',
                ]
            }
        },

        babel: {
            dist: {
                files: {
                    '<%= paths.source_compiled %>/app.js': '<%= paths.source_js %>/app.js',
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
                        '<%= paths.source_compiled %>/*.js'
                    ]),
                    dest: '<%= assets.full.scripts %>',
                }]
            },
            build: {
                files: [{
                    src: js_lib.map(function (path) {
                        return `<%= paths.source_bower %>/${path}`
                    }).concat([
                        '<%= paths.source_compiled %>/*.js'
                    ]),
                    dest: '<%= assets.full.scripts_min %>',
                }]
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: '<%= paths.app %>',
                src: '*.html',
                dest: '<%= paths.dist %>/'
            },
            dev: {
                expand: true,
                cwd: '<%= paths.source_bower %>',
                src: copy,
                dest: '<%= paths.app_vendor %>'
            },
            build: {
                expand: true,
                cwd: '<%= paths.source_bower %>',
                src: copy,
                dest: '<%= paths.dist_vendor %>'
            },
        },

        clean: {
            dist: {
                src: '<%= paths.dist %>'
            },
            bower: {
                src: '<%= paths.source_bower %>'
            },
            assets: {
                src: [
                    '<%= paths.app_css %>/*.*',
                    '<%= paths.app_js %>/*.*'
                ]
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

        strip_code: {
            options: {
                parityCheck: true,
                blocks: [
                    {
                        start_block: '<!--start livereload-->',
                        end_block: '<!--end livereload-->'
                    }
                ]
            },
            build: {
                src: [
                    '<%= paths.dist %>/**/*.html',
                ]
            }
        },

        'file-creator': {
            'option': {
                files: [
                    {
                        file: '<%= paths.app_css %>/styles.css',
                        method: function (fs, fd, done) {
                            done()
                        }
                    },
                    {
                        file: '<%= paths.app_js %>/scripts.js',
                        method: function (fs, fd, done) {
                            done()
                        }
                    }
                ]
            }
        },

        cachebuster: {
            build: {
                options: {
                    format: 'json',
                    basedir: '<%= paths.app %>'
                },
                src: ['<%= paths.app_css %>/styles.css', '<%= paths.app_js %>/scripts.js'],
                dest: 'cachebusters.json'
            }
        },

        replace: {
            dev: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: /styles.+\.css/g,
                            replacement: '<%= assets.cache.styles %>',
                        },
                        {
                            match: /scripts.+\.js/g,
                            replacement: '<%= assets.cache.scripts %>',
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['<%= paths.app %>/*.html'], dest: '<%= paths.app %>'}
                ]
            },
            build: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: /styles.+\.css/g,
                            replacement: '<%= assets.cache.styles_min %>',
                        },
                        {
                            match: /scripts.+\.js/g,
                            replacement: '<%= assets.cache.scripts_min %>',
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['<%= paths.app %>/*.html'], dest: '<%= paths.dist %>'}
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
                tasks: ['sass:dev', 'postcss:sass_rebase', 'postcss:dev', 'concat:css']
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
    grunt.registerTask('css', ['browserSync', 'watch:sass'])
    grunt.registerTask('copybower', ['clean:bower', 'bower', 'postcss:filebase64', 'copy:dev'])
    grunt.registerTask('cache', ['clean:assets', 'file-creator', 'cachebuster', 'clean:assets', 'replace:dev'])
    grunt.registerTask('dev', ['sass:dev', 'postcss:sass_rebase', 'postcss:dev', 'concat:css', 'babel', 'uglify:dev'])
    grunt.registerTask('build', ['clean:dist', 'copy', 'copy:build', 'replace:build', 'strip_code:build', 'imagemin', 'uglify:build', 'purifycss', 'cssmin'])
    grunt.registerTask('prod', 'run dev then build', function () {
        grunt.task.run('cache')
        grunt.task.run('dev')
        grunt.task.run('build')
    })
}