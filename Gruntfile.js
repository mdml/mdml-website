'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({
        app: {
            app: 'app',
            dist: 'dist',
            baseurl: ''
        },
        watch: {
            scripts: {
                files: ['<%= app.app %>/assets/js/**/*.{js}'],
                tasks: ['uglify']
            },
            jekyll: {
                files: [
                    '<%= app.app %>/**/*.{html,yml,md,mkd,markdown}'
                ],
                tasks: ['jekyll:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.jekyll/**/*.{html,yml,md,mkd,markdown}',
                    '.tmp/<%= app.baseurl %>/assets/css/*.css',
                    '.tmp/<%= app.baseurl %>/assets/js/*.js',
                    '<%= app.app %>/assets/img/*.{gif,jpg,jpeg,png,svg,webp}',
										'<%= app.app %>/assets/fig/*.{gif,jpg,jpeg,png,svg,webp}',
										'<%= app.app %>/assets/doc/*/*'
                ]
            }
        },
        connect: {
            options: {
                port: 4000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:4000/<%= app.baseurl %>'
                    },
                    base: [
                        '.jekyll',
                        '.tmp',
                        '<%= app.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: {
                        target: 'http://localhost:4000/<%= app.baseurl %>'
                    },
                    base: [
                        '<%= app.dist %>',
                        '.tmp'
                    ]
                }
            }
        },
        clean: {
            server: [
                '.jekyll',
                '.tmp'
            ],
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= app.dist %>/*',
                        '!<%= app.dist %>/.git*'
                    ]
                }]
            }
        },
        jekyll: {
            options: {
                config: '_config.yml,_config.build.yml',
                src: '<%= app.app %>'
            },
            dist: {
                options: {
                    dest: '<%= app.dist %>/<%= app.baseurl %>',
                }
            },
            server: {
                options: {
                    config: '_config.yml',
                    dest: '.jekyll/<%= app.baseurl %>'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: '**/*.html',
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    '.tmp/<%= app.baseurl %>/js/scripts.js': ['<%= app.app %>/assets/js/**/*.js']
                }
            }
        },
        uncss: {
            options: {
                htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
                report: 'gzip'
            },
            dist: {
                src: '<%= app.dist %>/<%= app.baseurl %>/**/*.html',
                dest: '.tmp/<%= app.baseurl %>/css/blog.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= app.baseurl %>/css',
                    src: '**/*.css',
                    dest: '.tmp/<%= app.baseurl %>/css'
                }]
            }
        },
        critical: {
            dist: {
                options: {
                    base: './',
                    css: [
                        '.tmp/<%= app.baseurl %>/css/blog.css'
                    ],
                    minify: true,
                    width: 320,
                    height: 480
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: ['**/*.html'],
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0,
                    check: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= app.baseurl %>/css',
                    src: ['*.css'],
                    dest: '.tmp/<%= app.baseurl %>/css'
                }]
            }
        },
        imagemin: {
            options: {
                progressive: true
            },
            dist: {
                files: [
									{
										expand: true,
										cwd: '<%= app.dist %>/<%= app.baseurl %>/assets/images',
										src: '**/*.{jpg,jpeg,png,gif}',
										dest: '<%= app.dist %>/<%= app.baseurl %>/assets/images'
									}
							]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/assets/images',
                    src: '**/*.svg',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/assets/images'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '.tmp/<%= app.baseurl %>',
                    src: [
                        'css/**/*',
                        'js/**/*'
                    ],
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= app.dist %>/<%= app.baseurl %>',
                    remote: 'git@github.com:mdml/mdml-website.git',
                    branch: 'gh-pages',
                    commit: true,
                    push: true,
                    connectCommits: false
                }
            }
        }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'jekyll:server',
            'autoprefixer',
            'uglify',
            'connect:livereload',
            'watch'
        ]);
    });

		grunt.loadNpmTasks('grunt-build-control');
    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jekyll:dist',
        'imagemin',
        'svgmin',
        'uncss',
        'autoprefixer',
        'cssmin',
        'uglify',
        'critical',
        'htmlmin'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'copy',
        'buildcontrol'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
