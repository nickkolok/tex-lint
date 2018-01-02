'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'no-foreignlanguage',
	message: 'Не допускается использование команды \\foreignlanguage',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^tag$/,
			/^\\foreignlanguage$/
		);
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		var argMap = n.getArgumentsMap(index, 3); 
		var content = n.getSubnodes(argMap[2][0], argMap[2][1] + 1);
		content.unwrap();
		n.replaceArguments(index, 3, content);
		n.reparse();
		return n;
	},
});
