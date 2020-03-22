'use strict';

var Rule = require('../Rule.js').Rule;
var RuleViolation = require('../RuleViolation.js');
var Nodes = require('../Nodes.js').Nodes;

new Rule({
	name: 'force_babel_quoted_hyphen',
	message: 'Слова с дефисом следует оформлять через "=',
	findErrors: function(nodes) {
		var indexes = nodes.findSequenceByRegExp([
			{ type: /^cyrtext$/, text: /^/ },
			{ type: /^/, text: /^-{1,4}$/ },
			{ type: /^cyrtext$/, text: /^[а-яё]/ },
		]);
		indexes = indexes.map(function(index) {
			return index + 1;
		});
		indexes = indexes.filter(function(index) {
			return nodes.nodes[index-1].text.length + nodes.nodes[index+1].text.length > 5;
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes[index].text='"=';
		return nodes;
	},
});
