'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_babel_quoted_emdash',
	message: 'Тире следует оформлять как "---',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^(?!(["])$)/ },
			{ type: /^/, text: /^---$/ },
		]);
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.insertNode(index, { type: null, text: '"' });
		return nodes;
	},
});
