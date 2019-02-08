'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'no-mathrm-in-formula',
	message: 'В формулах не рекомендуется использование команды \\mathrm',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^tag$/,
			/^\\mathrm$/
		);
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		var argMap = n.getArgumentsMap(index, 2); 
		var content = n.getSubnodes(argMap[1][0], argMap[1][1] + 1);
		content.unwrap();
		n.replaceArguments(index, 2, content);
		n.reparse();
		return n;
	},
});
