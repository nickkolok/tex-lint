'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'forbid_dash_at_end_of_formula',
	message: 'Тире следует писать вне формулы (знак "минус", завершающий формулу, рекомендуется экранировать фигурными скобками: x-{}$ или x{-}$ )',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^-$/ },
			{ type: /^keyword$/, text: /^\$$/ },
			//{ type: /^(space|linebreak)$/, text: /^/ },
		]);
		indexes = indexes.filter(function(index) {
			return nodes.isInsideFormula(index);
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes[index] = { type: "keyword", text: "$" };
		if (nodes.nodes[index + 2].type === "space" || nodes.nodes[index + 2].type === "linebreak") {
			nodes.nodes[index + 1] = { type: null, text: " -" };
		} else {
			nodes.nodes[index + 1] = { type: null, text: "-" };
		}
		return nodes;
	},
});
