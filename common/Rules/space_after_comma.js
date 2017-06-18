'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');

new Rule({
	name: 'space_after_comma',
	message: 'После запятой следует использовать пробел',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /cyrtext/, text: /^/ },
			{ type: /^/, text: /,/ },
			{ type: /^(?!(space|linebreak)$)/, text: /^/ },
		]).concat(nodes.findSequenceByRegExp([
			{ type: /^/, text: /\$/ },
			{ type: /^/, text: /,/ },
			{ type: /^(?!(space|linebreak)$)/, text: /^/ },
		]));
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.insertNode(index + 1, { type: 'space', text: ' ' });
		return nodes;
	}
});
