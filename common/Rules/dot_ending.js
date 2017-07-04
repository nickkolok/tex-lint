'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;


new Rule({
	name: 'dot_ending',
	message: 'Файл должен заканчиваться точкой или вопросительным знаком',
	findErrors: function(nodes) {
		if (!nodes.length) {
			return new RuleViolation({
				indexes: [],
			});
		}
		// Планируем испортить всю малину
		nodes = nodes.clone();
		var lastNotNewline;
		var ends;
		nodes.setPropByRegExp(/^(linebreak|comment)$/, /^/, 'skip', true);
		nodes.setPropByRegExp(/^/, /^(\$|\$\$)$/, 'skip', true);
		nodes.setSkipAllEnds();
		nodes.nodes.push({ type: '_eof', text: '' });

		var found = nodes.findSequenceByRegExp([
			{ type: /^/   , text: /[\.\?]$/},
			{ type: /_eof/, text: /^/},
		]);

		var indexes = [];
		if (!found.length) {
			indexes = [nodes.findSequenceByRegExp([
				{ type: /^/, text: /^/ },
				{ type: /^_eof$/, text: /^/ },
			]).pop()];
		}
		nodes.nodes.pop();
		return new RuleViolation({
			indexes: indexes,
		});
	},
});
