'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

var regLetter = /^[A-ZА-ЯЁ]$/i;

var regEndOfSentence = /[,\.\?\!]$/i; //TODO: ligature for ...

new Rule({
	//TODO: << `` '' >> 
	name: 'forbid_English_quotes',
	message: 'Не те кавычки',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^null$/i, text: /^[`',]$/i },
			{ type: /^null$/i, text: /^[`',]$/i },
		]);
		var usefulIndexes = [];
		indexes.map(function(index) {
			
			// Babel-style "=
			if (
				nodes.isInsideFormula(index)
			){
				//console.log('Not error: ' + nodes.getSubnodes(index - 2, index + 2).toString());
				return;
			}

			usefulIndexes.push(index);
		});
		return new RuleViolation({
			indexes: usefulIndexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index + 1].text = '';
		var isAfterLetter = index && regLetter.test(n.nodes[index - 1].text[n.nodes[index - 1].text.length - 1]);
		if (
			index < n.nodes.length - 2
		&&
			regLetter.test(n.nodes[index + 2].text[0])
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
			n.nodes[index + 2].type === 'space'
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
