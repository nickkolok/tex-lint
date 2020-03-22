'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_emdash_in_text_cyr',
	message: 'Вероятно, нужно длинное тире',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^cyrtext$/, text: /^/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^/, text: /^([~]*[-]+|"-|"--)$/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^cyrtext$/, text: /^/ },
		]).map(function(index) {
			return index + 2;
		});

		var indexesAfterPunctuation = nodes.findSequenceByRegExp([
			{ type: /^cyrtext$/, text: /^/ },
			{ type: /^/, text: /^[.,?!)"]+$/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^/, text: /^([~]*[-]+|"-|"--)$/ },
			{ type: /^/, text: /^\s+$/ },
			{ type: /^cyrtext$/, text: /^/ },
		]).map(function(index) {
			return index + 3;
		});

		indexes = indexes.concat(indexesAfterPunctuation);

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
