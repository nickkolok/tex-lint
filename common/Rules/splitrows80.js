'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'splitrows80',
	message: 'Длина строки не должна превышать 80 символов',
	findErrors: function(nodes) {
		return new RuleViolation({
			indexes: nodes.getTooLongRowsIndexes(80),
		});
	},
	fixErrors: function(nodes) {
		nodes.splitRows(80);
		return nodes;
	},
	commonCorrector: function(n, i) {
		n.splitRowByIndex(i, 80);
		return n;
	}
});

