'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'comma_before_gde',
	message: 'В конце выключной формулы перед словами "где", "который" и т.д. ставится запятая',
	findErrors: function(nodes) {
		console.time('Skipping');
		nodes.setPropByRegExp(/^(space|linebreak|comment)$/, /^/, 'skip', true);
		nodes.setSkipAllEnds();
		nodes.setSkipAllEqno();
		console.timeEnd('Skipping');
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^/, text: /^(?!(,)$)/ },
			{ type: /^keyword$/, text: /^\$\$$/ },
			{ type: /^cyrtext$/, text: /^(где$|котор|но$)/ },
		]);
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		nodes.delAllPropsOfAllNodes();
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.insertNode(index, (new Nodes(',')).nodes[0]);
		return nodes;
	}
});
