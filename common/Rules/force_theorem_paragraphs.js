'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_theorem_paragraphs',
	message: 'Начала лемм, теорем, доказательств и т.д. следует выделять тэгом \\paragraph',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^linebreak$/, text: /^/ },
			{ type: /^linebreak$/, text: /^/ },
			{ type: /^cyrtext$/, text: /^(Доказательство|Теорема|Лемма|Гипотеза|Утверждение|Предположение|Задача|Проблема|Определение|Следствие)$/ },
			{ type: /^/, text: /^[.:()]$/ },
		]).concat(nodes.findSequenceByRegExp([
			{ type: /^linebreak$/, text: /^/ },
			{ type: /^linebreak$/, text: /^/ },
			{ type: /^cyrtext$/, text: /^(Доказательство|Теорема|Лемма|Гипотеза|Утверждение|Предположение|Задача|Проблема|Определение|Следствие)$/ },
			{ type: /^space$/, text: /^/ },			
			{ type: /^/, text: /^[.:()0-9]+$/ },
		]));
		indexes = indexes.map(i => i + 2);
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		if (nodes.nodes[index + 1].text === ':') {
			nodes.nodes[index + 1].text = '.';
		} else if (nodes.nodes[index + 1].text === '(') {
			nodes.insertSubnodes(index + 1, new Nodes(' '));			
		}

		if (nodes.nodes[index + 1].text === '.') {
			nodes.nodes[index].text = '\\paragraph{' + nodes.nodes[index].text + '.} ';
			nodes.nodes[index + 1].text = '';
		} else if (
			nodes.nodes[index + 1].type === 'space'
			&&
			/^[0-9]+/.test(nodes.nodes[index + 2].text)
		){
			nodes.nodes[index].text =
				'\\paragraph{' +
					nodes.nodes[index].text +
					'~' +
					nodes.nodes[index + 2].text +
				'} ';
				nodes.nodes[index + 1].text = '';
				nodes.nodes[index + 2].text = '';
		} else {
			nodes.nodes[index].text = '\\paragraph{' + nodes.nodes[index].text + '} ';
		}
		nodes.reparse();

		return nodes;
	},
});
