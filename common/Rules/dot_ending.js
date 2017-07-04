'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;


new Rule({
	name: 'dot_ending',
	message: 'Файл должен заканчиваться точкой или вопросительным знаком',
	findErrors: function(nodes) {
		// Планируем испортить всю малину
		nodes = nodes.clone();
		var lastNotNewline;
		var ends;
		do {
			lastNotNewline = nodes.skipTypesReverse(nodes.length - 1, ['linebreak', 'comment']);
			if (lastNotNewline < 0) {
				break;
			}
			nodes.length = lastNotNewline + 1;

			ends = nodes.findSingleByRegExp(/^tag$/, /^\\end$/);
			if (!ends.length) {
				break;
			}

			if (nodes.getArgumentsEnd(ends[ends.length - 1], 2) !== nodes.length) {
				break;
			}
			nodes.replaceArguments(ends[ends.length - 1], 2);
		} while (1);

		var prelast = nodes.nodes[lastNotNewline];
		var indexes = [];
		if (prelast && !(/[\.\?]/).test(prelast.text)) {
			indexes = [nodes.length - 2];
		}
		return new RuleViolation({
			indexes: indexes,
		});
	},
});
