'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'Bibitem_exist',
	message: 'В статье должна присутствовать библиография, оформленная в соответствии с требованиями',
	findErrors: function(nodes) {
		return new RuleViolation({
			quantity:
				+!(nodes.getNodesQuantity('tag','\\RBibitem') +
				nodes.getNodesQuantity('tag','\\Bibitem'))
		});
	}
});
