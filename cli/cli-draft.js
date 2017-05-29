'use strict';

var cliruler = require('./cli.js');

var f = function(p) {
	console.log(p);
};

cliruler.applyRuleToFile('../webui/tex-examples/mz-01.tex', 'separate$', f);
