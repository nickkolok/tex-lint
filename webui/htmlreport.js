var rulesets = require('../common/rulesets.js');
var rules = require('../common/Rule.js').rules;
var $ = require('jquery-browserify');

module.exports.createHTMLreport = function(o) {
	var reportErrors = document.createDocumentFragment();
	var reportGood = document.createDocumentFragment();
	var totalRules = rulesets[o.rulesetName].rules.length;
	var brokenRules = 0;

	for (var i = 0; i < totalRules; i++) {
		var theRule = rules[rulesets[o.rulesetName].rules[i][0]];
		var result = theRule.findErrors(o.nodesObject);

		if (!result.quantity) {
			var goodspan = document.createElement('span');
			goodspan.innerHTML = theRule.message;
			reportGood.appendChild(goodspan);
			reportGood.appendChild(document.createElement('br'));
			continue;
		}

		// А вот если правило не выполнено...

		brokenRules++;
		var message = document.createElement('span');
		message.innerHTML = theRule.message + " : " + "ошибок: " + result.quantity;
		reportErrors.appendChild(message);
		if (theRule.fixErrors) {
			var fixbutton = document.createElement('button');
			fixbutton.id = 'fixErrors-' + theRule.name;
			fixbutton.innerHTML = 'Исправить';
			fixbutton.onclick = (function(rule) { return function() {
				try { // TODO: выляпаться из замыкания!!!
					console.log('Trying to fix ' + rule.name);
					var nodes = rule.fixErrors(o.getNodes());
					o.editor.setValue(nodes.toString());
					o.recheck();
				} catch (e) {
					console.log(e);
				}
			};})(theRule);
			reportErrors.appendChild(fixbutton);
		}
		reportErrors.appendChild(document.createElement('hr'));
	}
	o.targetElement.innerHTML = '';
	if (brokenRules) {
		o.targetElement.appendChild(reportErrors);
	} else {
		$(o.targetElement).html('Ошибок не найдено');
	}

};
