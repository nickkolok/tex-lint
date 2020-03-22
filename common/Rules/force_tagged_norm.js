'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_tagged_norm',
	message: 'Норму следует оформлять как \\|',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^\|$/ },
			{ type: /^/, text: /^\|$/ },
		]);
		indexes = indexes.filter(function(index) {
			return nodes.isInsideFormula(index);
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes[index] = { type: "tag", text: '\\|' };
		nodes.nodes.splice(index + 1, 1);
		return nodes;
	},
});
