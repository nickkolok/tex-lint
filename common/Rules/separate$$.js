'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'separate$$',
	message: 'Знак выключной формулы $$ должен занимать отдельную строку',
	findErrors: function(nodes) {
		return new RuleViolation({
			indexes: nodes.getNonseparated$$Numbers(),
		});
	},
	fixErrors: function(nodes) {
		nodes.separate$$();
		return nodes;
	},
	commonCorrector: function(n, i) {
		n.separateOne$$(i);
		return n;
	},
});
