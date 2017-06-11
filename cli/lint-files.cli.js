'use strict';

var cliruler = require('./cli.js');
var fs = require('fs');
var Rule = require('../common/Rule.js').Rule;
var rules = require('../common/Rule.js').rules;
var Nodes = require('../common/Nodes.js').Nodes;
var rulesets = require('../common/rulesets.js');


var args = process.argv.slice();
args.shift();
args.shift();
var rulesetName = args.shift();

if (!rulesets[rulesetName]) {
    console.log('Unknown ruleset: ' + rulesetName);
    process.exit(1);
}

var flOK = true;
args.forEach(function(filename) {
    console.log('\nChecking file: ' + filename + '...');
    var checkResult = cliruler.applyRulesetToFileSync(filename, rulesetName);
    checkResult.forEach(function(cr) {
        if (cr.quantity) {
            flOK = false;
            console.log('Rule was violated: ' + cr.rulename + ' : ' + rules[cr.rulename].message);
            if (cr.indexes) {
                var nodes = new Nodes(cr.text);
                //TODO: кэширование парсинга в new Nodes()
                cr.indexes.forEach(function(index) {
                    var coord = nodes.getRowCol(index);
                    console.log('Строка ' + coord.row + ', символ ' + coord.col + '; ');
                });
            }
        }
    });
});

if (!flOK) {
    process.exit(2);
}
