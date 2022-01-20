'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

var mathopnames = require('tex-mathopnames');

new Rule({
	name: 'sin_must_be_command',
	message: 'Названия математических операторов, такие как sin, в формулах должны быть прямым шрифтом. Пропущена дробь \\ перед командой',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/(variable-2)/,
			mathopnames.mathOpRegExpInt
		);
		indexes = indexes.filter(function(index){
			return nodes.isInsideFormula(index);
		});
		indexes = indexes.filter(function(index){
			return !nodes.isDirectlyUnderProtectiveTag(index);
		});

		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = n.nodes[index].text.
			replace(mathopnames.mathOpRegExpInt, '\\$1 ').
			replace(/\s$/, '');
		;
		n.reparse();
		return n;
	},
});
