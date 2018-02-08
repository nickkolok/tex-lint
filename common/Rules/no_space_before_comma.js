'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');

new Rule({
	name: 'no_space_before_comma',
	message: 'Перед запятой не следует использовать пробел',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^cyrtext$/, text: /^/ },
			{ type: /^space$/, text: /^/ },
			{ type: /^(?!(tag))/, text: /^,/ },
		]).concat(nodes.findSequenceByRegExp([
			{ type: /^/, text: /\$/ },
			{ type: /^space$/, text: /^/ },
			{ type: /^(?!(tag))/, text: /^,/ },
		]));
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes.splice(index, 1);
		return nodes;
	}
});
