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
			var goodspan = $('<span>', {
				html : theRule.message,
			});
			reportGood.appendChild(goodspan[0]);
			reportGood.appendChild($('<br>')[0]);
			continue;
		}

		// А вот если правило не выполнено...

		brokenRules++;
		var message = $('<span>',{
			html: theRule.message + " : " + "ошибок: " + result.quantity,
		})[0];
		reportErrors.appendChild(message);
		if (theRule.fixErrors) {
			var fixbutton = $('<button>',{
				id: 'fixErrors-' + theRule.name,
				html: 'Исправить',
			})[0];
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
