'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

var mathopnames = require('tex-mathopnames');

new Rule({
	name: 'force_$$_to_equation*',
	message: 'Ненумеруемые выключные формулы следует оформлять с помощью окружения {equation*}',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^keyword$/,
			/^[\$][\$]$/
		);
		var firstIndexes=[];
		for(var i = 0; i < indexes.length; i+=2){
			firstIndexes.push(indexes[i]);
		}
		return new RuleViolation({
			indexes: firstIndexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = '\\begin{equation*}';
		for(index++;index<n.length;index++){
			if(
				n.nodes[index]
			&&
				n.nodes[index].text === '$$'
			&&
				n.nodes[index].type === 'keyword'
			){
				n.nodes[index].text = '\\end{equation*}';
				break;
			}
		}
		n.reparse();
		return n;
	},
});
