'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'no-cyrtext-in-formula',
	message: 'Вероятно, в формуле вместо латинской буквы набрана аналогичная по начертанию русская',
	findErrors: function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/^cyrtext$/,
			/^[УКЕНГХФВАРОСМТЬуехарос]+$/
		).filter(i => nodes.isInsideFormula(i));
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = n.nodes[index].text.
			replace(/У/," Y ").
			replace(/К/," K ").
			replace(/Е/," E ").
			replace(/Н/," H ").
			replace(/Г/," \\Gamma ").
			replace(/Х/," X ").
			replace(/Ф/," \\Phi ").
			replace(/В/," B ").
			replace(/А/," A ").
			replace(/Р/," P ").
			replace(/О/," O ").
			replace(/С/," C ").
			replace(/М/," M ").
			replace(/Т/," T ").
			replace(/Ь/," b ").
			replace(/у/," y ").
			replace(/е/," e ").
			replace(/х/," x ").
			replace(/а/," a ").
			replace(/р/," p ").
			replace(/о/," o ").
			replace(/с/," c ");
		n.reparse();
		return n;
	},
});
