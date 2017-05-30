'use strict';
var fs = require('fs');
var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;

function applyRuleToString(str, rulename) {
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

module.exports.applyRuleToFile = applyRuleToFile;
module.exports.applyRuleToString = applyRuleToString;

module.exports.ls = require('ls'); // TODO: Dirty hack for QUnit. Refactor!!!
module.exports.fs = require('fs'); // TODO: Dirty hack for QUnit. Refactor!!!
