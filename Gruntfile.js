'use strict';

var fs = require('fs');
var ls = require('ls');
//var regexp = require('node-regexp');
var mkdirp = require('mkdirp');

var exec = require('child_process').exec;


module.exports = function(grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var cwd = process.cwd();

	var packExamples = function(sourceDir, targetFile) {
		var targetDir = targetFile.replace(/[^\/\\]+$/, '');
		mkdirp.sync(targetDir);
		var examples = ls(sourceDir + '*.tex');

		var examplesDictionary = {};
		for (var i = 0; i < examples.length; i++) {
			examplesDictionary[examples[i].name] = fs.readFileSync(examples[i].full, 'utf8');
		}
		fs.writeFileSync(targetFile,
			'"use strict";\nmodule.exports=' + JSON.stringify(examplesDictionary)
		);


/*
		for (var i = 0; i < examples.length; i++) {
			//Используем синхронное чтение/запись. Ибо вдруг дескрипторов не хватит?
			fs.writeFileSync(targetDir + examples[i].path + '/' + examples[i].name + '.js',
				'"use strict";\nmodule.exports=\'' +
				fs.readFileSync(examples[i].full, 'utf8')
					.replace(/\\/g, '\\\\')
					.replace(/\'/g, '\\\'')
					.replace(/[\n\r]+/g, '\\n') +
				'\');\n'
			);
		}
*/
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			wrappers: {
				files: [
					{
						expand: true,
						cwd: 'webui/wrappers',
						src: ['*.html'],
						dest: 'dist/'
					},
				]
			},
			license: {
				files: [
					{
						expand: true,
						src: ['LICENSE'],
						dest: 'dist/',
						rename: function() { return 'dist/LICENSE.TXT';},

					},
				]
			},
			codemirror: {
				files: [
					{ expand: true, src: ['node_modules/codemirror/**'], dest: 'dist/webui/' },
				]
			},
			bootstrap: {
				files: [
					{ expand: true, src: ['node_modules/bootstrap/**'], dest: 'dist/webui/' },
				]
			},
			katex: {
				files: [
					{ expand: true, src: ['node_modules/katex/dist/**'], dest: 'dist/webui/' },
				]
			},
		},
		uglify: {
			options: {
				screwIE8: true,
			},
			head: {
				files: {
					'build/lib/head.min.js': ['lib/head.js'],
				}
			},
		},
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
			},
			main: {
				src: 'webui/playground.js',
				dest: 'dist/webui/playground.js'
			},
		},
/*
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
			},
			target: {
				files: [
					{
						'dist/css/chas-ui.min.css': [
							 'css/browser.css',
							 'css/main.css',
							 'css/menu.css',
							 'ext/anyslider/css/anythingslider.css',
							 'ext/anyslider/css/theme-minimalist-square.css',
							 'ext/fonts/stylesheet.css',
							 'ext/keyboard/keyboard.css',
							 'ext/jqplot/jquery.jqplot.css',
						],
						'dist/css/chas-ui-bs.min.css': [
							 'css/browser.css',
							 'css/menu.css',
							 'ext/anyslider/css/anythingslider.css',
							 'ext/anyslider/css/theme-minimalist-square.css',
							 'ext/fonts/stylesheet.css',
							 'ext/keyboard/keyboard.css',
							 'ext/jqplot/jquery.jqplot.css',
							 'ext/bootstrap/css/bootstrap.min.css',
						],
					},
					{
						expand: true,
						cwd: 'css',
						src: ['*.css'],
						dest: 'dist/css',
						ext: '.min.css',
					}
				]
			},
		},
*/
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyJS: true,
				minifyCSS: true,
			},
			html: {
				expand: true,
				cwd: './',
				src: ['webui/*.html'],
				dest: 'dist/',
				ext: '.html'
			}
		},
		compress: {
			vzms: {
				options: {
					archive: 'dist/tex-lint-dist-vzms.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: [
							'webui/**',
							'LICENSE.TXT',
							'for-vzms.html',
						],
						dest: 'tex-lint-vzms/'
					},
				],
			},
			mz: {
				options: {
					archive: 'dist/tex-lint-dist-mz.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: [
							'webui/**',
							'LICENSE.TXT',
							'for-mz-site.html',
						],
						dest: 'tex-lint-mz/'
					}, // makes all src relative to cwd
				],
			},
			smzh: {
				options: {
					archive: 'dist/tex-lint-dist-smzh.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: [
							'webui/**',
							'LICENSE.TXT',
							'for-smzh-site.html',
						],
						dest: 'tex-lint-smzh/'
					}, // makes all src relative to cwd
				],
			},
		},

		watch: {
			options: {
				reload: true
			},
			html: {
				files: [
					'webui/*.html',
				],
				tasks: ['process-html']
			},
			webuiJs: {
				files: [
					'webui/*.js',
					'common/*.js',
				],
				tasks: ['process-webui-js'],
			},
			texExamples: {
				files: [
					'webui/tex-examples/*.tex',
				],
				tasks: ['packExamples', 'process-webui-js'],
			},

		},

		eslint: {
			strictLinting: {
				options: {
					configFile: 'eslint.json'
				},
				src: [
					'webui/*.js',
					'common/*.js',
					'!common/stex-custom.codemirror-mode.js',
					'cli/*.js',
					'Gruntfile.js',
				],
			},
		},

		clean: {
			build: ['build/'],
			dist: ['dist/']
		},

		'node-qunit': {
			Nodes: {
				code: './common/Nodes.js',
				tests: [
					'./test/Nodes_get.js',
					'./test/Nodes_get_skip.js',
					'./test/Nodes_get_formula.js',
					'./test/Nodes_get_environments.js',
					'./test/Nodes_get_rowsplit.js',
					'./test/Nodes_construction.js',
					'./test/Nodes_edit.js',
					'./test/Nodes_edit_wrap.js',
					'./test/Nodes_edit_rowsplit.js',
					'./test/Nodes_edit_comments.js',
					'./test/Nodes_edit_prop.js',
				],
				done: function(err, res) {
					!err && publishResults('node', res, this.async());
				},
			},
			Rules: {
				//deps: 'ls',
				code: './cli/cli.js',
				tests: [
					'./test/Rules.js',
				],
				done: function(err, res) {
					!err && publishResults('node', res, this.async());
				},
			},
		},
		jasmine: {
            test: {
                src: [
					'dist/webui/playground.js',
				],
                options: {
                    vendor: [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
						'build/test/webui/makeHTML.js',
						'dist/webui/node_modules/codemirror/lib/codemirror.js',
						'dist/webui/node_modules/codemirror/mode/stex/stex.js',
						'dist/webui/node_modules/codemirror/addon/runmode/runmode.js',
						'dist/webui/playground.js',
                    ],
                    specs: [
						'test/webui/*.spec.js',
					],
					keepRunner: true,
                }
            }
        },
/*
		concurrent: {
			'process-all': [
				'process-html',
				'process-webui-js',
			],
		},
*/
	});

	grunt.registerTask('createHTMLscripts', 'Упаковываем html-код в js-обёртки', function() {
		require('./test/webui/create-html-making-script.js');
	});

	grunt.registerTask('testui', [
		'default',
		'createHTMLscripts',
		'jasmine',
	]);

	grunt.registerTask('packExamples', 'Упаковываем примеры кода в js-обёртки', function() {
		packExamples('webui/tex-examples/', 'build/webui/tex-examples.js');
	});

	grunt.registerTask('process-html', [
		'newer:htmlmin',
	]);

	grunt.registerTask('process-webui-js', [
		'newer:eslint',
		'browserify:main',
	]);

	grunt.registerTask('bundle', [
		'newer:copy:codemirror',
		'newer:copy:bootstrap',
		'newer:copy:katex',
		'newer:copy:license',
		'default',
		'newer:copy:wrappers',
		'compress',
	]);

	grunt.registerTask('default', [
		//'concurrent:process-all', // На деле - медленнее
		'node-qunit',
		'process-html',
		'packExamples',
		'process-webui-js',
	]);
};
