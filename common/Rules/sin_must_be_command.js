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
			/(variable-2)|(null)/,
			mathopnames.mathOpRegExpInt
		);
		indexes = indexes.filter(function(index){
			return nodes.isInsideFormula(index);
		})
		indexes = indexes.filter(function(index){
			for (var pos = index; pos >= 0; pos--){
				if(nodes.nodes[pos].text === '}')
					return true;
				if(nodes.nodes[pos].type === 'tag')
					return true;
				if(nodes.nodes[pos].text === '{')
					break;
			}
			console.log(pos, index);
			if (pos === -1)
				return true;
			for (pos--; pos >= 0; pos--){
				if(nodes.nodes[pos].text === '}')
					return true;
				if(nodes.nodes[pos].type === 'tag')
					return !nodes.isProtectiveTag(pos);
			}
			return true;
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
