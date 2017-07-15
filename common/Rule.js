'use strict';

var Nodes = require('./Nodes.js').Nodes;
var RuleViolation = require('./RuleViolation.js');

/* eslint no-new: 0 */  // --> OFF

var rules = {};

function Rule(o, message, findErrors, fixErrors) {
	if (o instanceof Object) {
		for (var prop in o) {
			this[prop] = o[prop];
		}
	} else {
		this.name = o;
		this.message = message;
		this.findErrors = findErrors;
		this.fixErrors = fixErrors;
	}
	if (!this.fixErrors) {
		// Жуткий, феерический костыль
		// TODO: переписать
		var commonCorrector = (
			this.commonCorrector ||
			this.findErrors(new Nodes('')).commonCorrector // Вот это - костыль
		);
		if (commonCorrector) {
			this.fixErrors = (function(corrector, f) {
				return function(nodes) {
					for (var i = 0; i < 10000; i++) { //Мало ли что, хоть не повиснет
						// TODO: реагировать-таки на неизменность нод
						var found = f(nodes);
						if (!found.quantity || !found.indexes) {
							break;
						}
						nodes = corrector(nodes, found.indexes[0]);
					}
				};
			})(commonCorrector, this.findErrors);
		}
	}

	rules[this.name] = this;
}

module.exports.Rule = Rule;

function makeSingleForbiddingRule(typereg, textreg, o) {
	o.findErrors = (function($typereg, $textreg) {
		return function(nodes) {
			return new RuleViolation({
				indexes: nodes.findSingleByRegExp(
					$typereg,
					$textreg
				),
			});
		};
	})(typereg, textreg);
	if ('replacement' in o) {//o.replacement не сработает на пустую строку ''
		o.commonCorrector = (function($rep) {
			return function(nodes, index) {
				nodes.nodes[index].text = o.replacement;
				nodes.reparse();
				return nodes;
			};
		})(o.replacement);
	}

	new Rule(o);
}

module.exports.makeSingleForbiddingRule = makeSingleForbiddingRule;


function forbidEnvs(envs, o) {
	o.findErrors = (function($envs) { return function(nodes) {
		var indexes = nodes.getEnvironmentsList(envs).map(
			function(env) {
				return env.begin;
			}
		);
		return new RuleViolation({
			indexes: indexes,
		});
	};})(envs);
	if (('newBegin' in o) && ('newEnd' in o)) {//o.newBegin не сработает на пустую строку ''
		o.commonCorrector = (function($begin, $end) {
			return function(n, index) {
				n.renewEnvironment(index, new Nodes($begin), new Nodes($end));
				return n;
			};
		})(o.newBegin, o.newEnd);
	}

	new Rule(o);
}

module.exports.forbidEnvs = forbidEnvs;

var execall = require('execall');
var cloneRegexp = require('clone-regexp');

function replaceText(o) {
	o.findErrors = (function(reg) {
		return function(nodes) {
			var text = nodes.toString();
			var numbers = execall(reg, text);
			var indexes = numbers.map(function(number) {
				return nodes.getIndexBySymbolNumber(number.index);
			});
			return new RuleViolation({
				indexes: indexes,
			});
		};
	})(o.regtext);
	if ('newtext' in o) {
		o.fixErrors = (function(reg, newtext) {
			return function(nodes) {
				var newstr = (nodes.toString().replace(reg, newtext));
				nodes.nodes = [{ text: newstr }];
				nodes.reparse();
				return nodes;
			};
		})(o.regtext, o.newtext);
		o.commonCorrector = (function(reg, newtext) {
			return function(n, i) {
				var substr = n.getSubnodes(i, n.length).toString();
				substr = substr.replace(cloneRegexp(reg, { global: false }), newtext);
				n.length = i + 1;
				n.nodes[i].text = substr;
				n.reparse();
				return n;
			};
		})(o.regtext, o.newtext);
	}
	new Rule(o);
}

module.exports.replaceText = replaceText;

require('./Rule_list.js');
require('./Rule_heap.js');

module.exports.rules = rules;
