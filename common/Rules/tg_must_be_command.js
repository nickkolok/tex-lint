'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

var mathopnames = require('tex-mathopnames');

new Rule({
	name: 'tg_must_be_command',
	message: 'Русские названия математических операторов, такие как tg, в формулах должны быть прямым шрифтом; используйте \\operatorname',
	findErrors: function(nodes) {
		var indexesSusp = nodes.findSingleByRegExp(
			/(variable-2)|(null)/,
			mathopnames.mathOpRegExpRus
		);
		var indexes = [];
		var operatorname = [{ type: /^tag$/, text: /\\operatorname/ }];
		indexesSusp.forEach(function(index) {
			if (!nodes.isInsideArgumentsOf(index, operatorname, 2)) {
				indexes.push(index);
			}
		});

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
			replace(mathopnames.mathOpRegExpRus, '\\operatorname{$1}')
			;
		n.reparse();
		return n;
	},
});
