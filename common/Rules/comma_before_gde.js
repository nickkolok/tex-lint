'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'comma_before_gde',
	message: 'В конце выключной формулы перед словом "где" ставится запятая',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^(?!(,)$)/ },
			{ type: /^/, text: /\$\$/ },
			{ type: /^(space|linebreak)$/, text: /^/ },
			{ type: /cyrtext/, text: /где/ },
		]).concat(nodes.findSequenceByRegExp([
			{ type: /^/, text: /^(?!(,))$/ },
			{ type: /^/, text: /\$\$/ },
			{ type: /^(space|linebreak)$/, text: /^/ },
			{ type: /^(space|linebreak)$/, text: /^/ },
			{ type: /cyrtext/, text: /где/ },
		])).concat(nodes.findSequenceByRegExp([
			{ type: /^/, text: /^(?!(,))$/ },
			{ type: /^/, text: /\$\$/ },
			{ type: /cyrtext/, text: /где/ },
		]));
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.insertNode(index, (new Nodes(',')).nodes[0]);
		return nodes;
	}
});
