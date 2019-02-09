'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'collapse_cite',
	message: 'Несколько публикаций следует цитировать в общей команде \\cite',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^tag$/,
			/^\\cite$/
		);
		var errorIndexes=[];
		for(var i = 0; i < indexes.length - 1; i++){
			var argEnd = nodes.getArgumentsMap(indexes[i],2)[1][1];
			//console.log(argEnd);
			var str = nodes.getSubnodes(argEnd + 1, indexes[i+1]).toString();
			//console.log(str);
			str = str.replace(/[~\s]|\\[\s\,;:!]/g,"");
			//console.log(str);
			if(/^[,;]$/.test(str)){
				errorIndexes.push(indexes[i]);
			}
		}
		return new RuleViolation({
			indexes: errorIndexes,
		});
	},
	commonCorrector: function(n, index) {
		//console.log('Correcting:', index);
		//console.log(n.toString());
		var nextTagIndex = index + 1;
		do{
			nextTagIndex = n.skipToType(nextTagIndex + 1, 'tag');
		} while(
			nextTagIndex < n.length && (
				n.nodes[nextTagIndex].type !== 'tag'
				||
				// TODO: n.isSpaceTag();
				/^\\[\s,;:!]|~$/.test(n.nodes[nextTagIndex].text)
			)
		);
		if(
			n.nodes[nextTagIndex].text !== '\\cite'
			||
			nextTagIndex >= n.length
		){
			return n;
		}
		var firstArgEnd = n.getArgumentsMap(index,2)[1][1];
		var secondArgBegin = n.getArgumentsMap(nextTagIndex,2)[1][0];
		//console.log(firstArgEnd, secondArgBegin);
		n.nodes.splice(firstArgEnd, secondArgBegin - firstArgEnd + 1, {text: ",", type: null});
		//n.reparse();
		return n;
	},
});
