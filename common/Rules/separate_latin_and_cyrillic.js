'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'separate_latin_and_cyrillic',
	message: 'Латинские буквы в русском тексте, вероятно, являются формулами или опечатками (для экранирования используйте фигурные скобки: {Y}-хромосома)',
	findErrors: function(nodes) {
		var n = nodes.nodes;
		var lastIndex = -Infinity;
		var lastLanguage = '';
		var indexes = [];
		var maxDistance = 4;

		for (var i = 0; i < n.length; i++){
			if ((-1 !== [
					'comment',
					'keyword',
					'bracket',
				].indexOf(n[i].type))
				||
				// New paragraph
				n[i].type === 'linebreak' && n[i+1] && n[i+1].type === 'linebreak'
			) {
				lastIndex = -Infinity;
				lastLanguage = '';
			} else if (n[i].type === 'tag') {
				continue; 
			}else if (/[A-Z]/i.test(n[i].text)){
				if (lastLanguage === "cyr" && i - lastIndex <= maxDistance){
					indexes.push(i);
				}
				lastLanguage = "lat";
				lastIndex = i;
			} else if (/[А-ЯЁ]/i.test(n[i].text)){
				if (lastLanguage === "lat" && i - lastIndex <= maxDistance){
					indexes.push(lastIndex);
				}
				lastLanguage = "cyr";
				lastIndex = i;
			}
		}

		indexes = indexes.filter(function(i){
			// Latin letters
			let literalPart = n[i].text.replace(/^[^A-Z]+/i,"").replace(/[^A-Z]+$/i,"");

			// Roman numbers
			if (/^(([iv]+)|([IV]+)|([ivxl]{2,})|([IVXL]{2,}))$/.test(literalPart)){
				return false;
			}
			//TODO: теорема 1.b.3
			return true;
		});

		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		var n = nodes.nodes;
		var suspect = nodes.nodes[index];

		// просто английская буква в русском тексте - осечка при наборе или распознании
		if ( /^[WETYOPAHKXCBMweyiopalxcbnm]+$/.test(suspect.text)
			&&
			(n[index - 1] && n[index - 1].type === "cyrtext" || n[index + 1] && n[index + 1].type === "cyrtext")
		){
			suspect.text = suspect.text.
				replace("E","Е").
				replace("T","Т").
				replace("Y","У").
				replace("O","О").
				replace("P","Р").
				replace("A","А").
				replace("H","Н").
				replace("K","К").
				replace("X","Х").
				replace("C","С").
				replace("B","В").
				replace("M","М").
				replace("e","е").
				replace("y","у").
				replace("o","о").
				replace("p","р").
				replace("a","а").
				replace("x","х").
				replace("c","с").
				replace("n","п").
				replace("m","т").
				replace("b","Ь");
		} else {
			var leftEdge = index, rightEdge = index;
			for (;leftEdge;leftEdge--) {
				if (
					(n[leftEdge - 1].type === 'cyrtext')
					||
					(n[leftEdge - 1].type === 'tag')
					||
					(n[leftEdge - 1].type === 'keyword')
					||
					(n[leftEdge - 1].type === 'bracket')
					||
					(n[leftEdge - 1].type === 'linebreak')
				){
					break;
				}
			}
			if (n[leftEdge].type === 'space'){
				leftEdge++;
			} else if (n[leftEdge].text.search(/[A-Z]/i) === -1 && n[leftEdge + 1].type === 'space'){
				leftEdge += 2;
			}
			for ( ; n[rightEdge + 1]; rightEdge++) {
				if (
					(n[rightEdge + 1].type === 'cyrtext')
					||
					(n[rightEdge + 1].type === 'tag')
					||
					(n[rightEdge + 1].type === 'keyword')
					||
					(n[rightEdge + 1].type === 'bracket')
					||
					(n[rightEdge + 1].type === 'linebreak')
				){
					break;
				}
			}
			if (n[rightEdge].type === 'space'){
				rightEdge--;
			} else if (n[rightEdge].text.search(/[A-Z]/i) === -1 && n[rightEdge - 1].type === 'space'){
				rightEdge -= 2;
			}

			n[leftEdge].text = '$'+n[leftEdge].text;
			n[rightEdge].text += '$';
			nodes.reparse();
		}

		return nodes;
	},
});
