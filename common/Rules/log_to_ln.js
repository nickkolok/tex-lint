'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'log_to_ln',
	message: '\\log без указания основания следует заменить на \\ln',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^tag$/,
			/^\\log$/
		).filter(function(index){
			index++;
			index = nodes.skipTypes(index, ['space', 'linebreak', 'comment']);
			//console.log(index);
			//console.log(nodes.nodes[index]);
			if(nodes.nodes[index].text == '^'){
				//Логарифм в степени!
				index = nodes.getArgumentsMap(index, 2)[1][1] + 1;
				index = nodes.skipTypes(index, ['space', 'linebreak', 'comment']);
				}
			if(nodes.nodes[index].text == '_'){
				//Вот он, нижний индекс!
				//TODO: а если там пустые фигурные скобки?
				return false;
			}
			return true;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = '\\ln';
		return n;
	},
});
