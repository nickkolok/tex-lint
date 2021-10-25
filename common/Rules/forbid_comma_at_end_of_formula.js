'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'forbid_comma_at_end_of_formula',
	message: 'Знаки препинания следует писать вне формулы (точку, завершающую формулу, рекомендуется экранировать фигурными скобками: x.{}$ или x{.}$ )',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^[.,;:–]$/ },//TODO: юникодные тире
			{ type: /^keyword$/, text: /^\$$/ },
			//{ type: /^(space|linebreak)$/, text: /^/ },
		]);
		indexes = indexes.filter(function(index) {
			var i = nodes.skipTypesReverse(index - 1, ['space','linebreak','comment']);;
			if (nodes.nodes[i].text === '\\right'){
				return false;
			}
			return nodes.isInsideFormula(index);
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		if (nodes.nodes[index].text === '–') {
			//TODO: прочие юникодные тире
			nodes.nodes[index].text = ' ' + nodes.nodes[index].text;
		}
		nodes.nodes[index + 1] = nodes.nodes[index];
		nodes.nodes[index] = { type: "keyword", text: "$" };
		return nodes;
	},
});
