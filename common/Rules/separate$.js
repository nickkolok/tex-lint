'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'separate$',
	message: 'Строчная формула должна занимать отдельную строку',
	findErrors: function(nodes) {
		return new RuleViolation({
			indexes: nodes.get$SeparationErrors(),
		});
	},
	fixErrors: function(nodes) {
		nodes.separate$();
		return nodes;
	},
	commonCorrector: function(nodes, i) {
		nodes.separateOne$(i);
		return nodes;
	},
});
