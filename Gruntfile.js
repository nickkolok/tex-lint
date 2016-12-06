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
			html: {
				files: [
					{ expand: true, src: ['webui/*.html', 'c2/*.js'], dest: 'dist/' },
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
		},

		eslint: {
			strictLinting: {
				options: {
					configFile: 'eslint.json'
				},
				src: [
					'webui/*.js',
					'common/*.js',
					'cli/*.js',
					'Gruntfile.js',
				],
			},
		},

		clean: {
			build: ['build/'],
			dist: ['dist/']
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

	grunt.registerTask('default', [
		//'concurrent:process-all', // На деле - медленнее
		'process-html',
		'packExamples',
		'process-webui-js',
	]);
};