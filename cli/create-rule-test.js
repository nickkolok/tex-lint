'use strict';

var cliruler = require('./cli.js');
var fs = require('fs');
var jsonFormat = require('json-format');

function createRuleTest(filename, rulename, postfix) {
    var writeToFile = function(p) {
        fs.writeFileSync(
            'test/ruletests/' + filename + '-' + rulename + (postfix || '') + '.json',
            jsonFormat(p)
        );

    };
    cliruler.applyRuleToFile('webui/tex-examples/' + filename, rulename, writeToFile);
}

module.exports.createRuleTest = createRuleTest;
