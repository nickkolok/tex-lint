'use strict';
var fs = require('fs');
var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;
var rulesets = require('../common/rulesets.js');

function applyRuleToString(str, rulename) {
	console.time('applyRuleToString("...", ' + rulename + ')');
	var rule = rules[rulename];
	var nodes = new Nodes(str);
	var findResult = rule.findErrors(nodes);

	var rez = {
		text: str,
		rulename: rulename,
		indexes: findResult.indexes,
		quantity: findResult.quantity,
	};
	if (rule.fixErrors) {
		// Не для всех правил определена функция исправления
		rule.fixErrors(nodes);
		rez.fixed = nodes.toString();
	}
	console.timeEnd('applyRuleToString("...", ' + rulename + ')');
	return rez;
	// TODO: возможность применять точечные исправления с известными номерами.
	// Не забыть, что при изменении номера нод ползут.
	// Возможно, стОит начинать с последнего.
}

function applyRuleToFile(filename, rulename, callback) {
	var text = fs.readFile(filename, 'utf8', function(err, contents) {
		callback(applyRuleToString(contents, rulename));
	});
}

function applyRuleToFileSync(filename, rulename) {
	var text = fs.readFileSync(filename, 'utf8');
	return applyRuleToString(text, rulename);
}
//TODO: а оно вообще работает?

var autoenc = require('node-autodetect-utf8-cp1251-cp866');

function applyRulesetToFileSync(filename, rulesetname) {
	var buf = fs.readFileSync(filename);
	var text = autoenc.detectEncoding(buf).text;
	var theRuleset = rulesets[rulesetname];
	var _rules = theRuleset ? theRuleset.rules : [[rulesetname, 1]];
	var rez = [];
	_rules.forEach(function(rule) {
		rez.push(applyRuleToString(text, rule[0]));
	});
	return rez;
}
//TODO: асинхронная версия

module.exports.applyRuleToFile = applyRuleToFile;
module.exports.applyRuleToString = applyRuleToString;
module.exports.applyRulesetToFileSync = applyRulesetToFileSync;

module.exports.ls = require('ls'); // TODO: Dirty hack for QUnit. Refactor!!!
module.exports.fs = require('fs'); // TODO: Dirty hack for QUnit. Refactor!!!
