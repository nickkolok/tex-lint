'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

var regLetter = /^[A-ZА-ЯЁ]$/i;

var regEndOfSentence = /[,\.\?\!]$/i; //TODO: ligature for ...

new Rule({
	name: 'Russian_quotes',
	message: 'Кавычки',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^null$/i, //TODO: dekostylize
			/^"$/i
		);
		var usefulIndexes = [];
		indexes.map(function(index) {
			
			// Babel-style "=
			if (
				index < nodes.nodes.length
			&&
				// TODO: unificate quotes!
				(/^[=><']$/i).test(nodes.nodes[index + 1].text)
			){
				//console.log('Not error: ' + nodes.getSubnodes(index - 2, index + 2).toString());
				return;
			}

			usefulIndexes.push(index);
		});
		nodes.delAllPropsOfAllNodes();
		return new RuleViolation({
			indexes: usefulIndexes,
		});
	},
	commonCorrector: function(n, index) {
		var isAfterLetter = index && regLetter.test(n.nodes[index - 1].text[n.nodes[index - 1].text.length - 1]);
		if (
			index < n.nodes.length
		&&
			regLetter.test(n.nodes[index + 1].text[0])
		){
			n.nodes[index].text = '<<';
		}
		else
		if (isAfterLetter){
			n.nodes[index].text = '>>';
		}
		else if (
			index // > 0
		&&
			index < n.nodes.length
		&&
			regEndOfSentence.test(n.nodes[index - 1].text)
		&&
			n.nodes[index + 1].type === 'space'
		){
			n.nodes[index].text = '>>';			
		}
		else{
			n.nodes.splice(
				index,
				1,
				{ text: '{', type: 'bracket' },
				{ text: '\\textquotedbl', type: 'tag' },
				{ text: '}', type: 'bracket' }
			);
		}

		return n;
	}
});
