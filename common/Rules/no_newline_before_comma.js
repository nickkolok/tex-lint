'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');

new Rule({
	name: 'no_newline_before_comma',
	message: 'Перед запятой не следует использовать перевод строки',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^(?!(comment))/, text: /^/ },
			{ type: /^linebreak$/, text: /^/ },
			{ type: /^(?!(tag))/, text: /^[,\.\?\!]/ },
		]);
		indexes = indexes.map(function(index) {
			return index + 2;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		var comma = nodes.nodes[index];
		nodes.nodes[index] = nodes.nodes[index - 1];
		nodes.nodes[index - 1] = comma;
		return nodes;
	}
});
