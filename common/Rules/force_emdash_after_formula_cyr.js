'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_emdash_after_formula_cyr',
	message: 'Вероятно, нужно длинное тире',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^\$$/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^/, text: /^[~]*[-]+$/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^cyrtext$/, text: /^/ },
		]);
		indexes = indexes.map(function(index) {
			return index + 2;
		});
		indexes = indexes.filter(function(index) {
			return !nodes.isInsideFormula(index);
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes[index] = { type: "tag", text: '"---' };
		return nodes;
	},
});
