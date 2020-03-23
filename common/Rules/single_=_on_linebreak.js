'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'single_=_on_linebreak',
	message: 'Do not end a line with “=”',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^/,
			/^([=><]|\\[lgn]e(q(slant)?)?)$/
		);
		var foundIndexes = indexes.filter(function(index){
			var nextNode = nodes.skipTypes(index + 1, ['space', 'linebreak', 'comment']);
			if(!nodes.nodes[nextNode]){
				// This is last node
				return false;
			}
			var nextNodeText = nodes.nodes[nextNode].text;
			//console.log(nextNodeText);
			return (
				nextNodeText === '\\\\'
			||
				nextNodeText === '\\end'
			||
				nextNodeText === '$$'
			||
				nextNodeText === '\\]'
			);
		});

		return new RuleViolation({
			indexes: foundIndexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = '';
		return n;
	},
});
