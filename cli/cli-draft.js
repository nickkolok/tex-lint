'use strict';

var cliruler = require('./cli.js');
var fs = require('fs');


var f = function(p) {
	console.log(p);
};


function createRuleTest(filename, rulename) {
    var writeToFile = function(p) {
        fs.writeFileSync(
            '../test/ruletests/' + filename + '-' + rulename + '.json',
            JSON.stringify(p)
        );

    };
    cliruler.applyRuleToFile('../webui/tex-examples/' + filename, rulename, writeToFile);
}

createRuleTest('sin-example.tex', 'sin_must_be_command');
//createRuleTest('smzh-1.tex', 'separate$$');
