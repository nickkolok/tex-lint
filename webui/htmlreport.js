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
				html: 'Исправить все',
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
		if (result.indexes) {
			reportErrors.appendChild($('<br/>')[0]);
			for (var j = 0; j < result.indexes.length; j++) {
				var rowcol = $('<span>');
				var coord = o.nodesObject.getRowCol(result.indexes[j]);
				rowcol.html('Строка ' + coord.row + ', символ ' + coord.col + '; ');
				reportErrors.appendChild(rowcol[0]);
				rowcol[0].onclick = (function(pos) { return function() {
					o.editor.focus();
					o.editor.setCursor({
						line: pos.row - 1,
						ch  : pos.col - 1,
					});
					o.editor.focus();
				};})(coord);
				if (result.commonCorrector) {
					var singleButton = $('<button>',{
						html: 'Исправить',
					})[0];
					singleButton.onclick = (function(index, corrector) { return function() {
						var nodes = corrector(o.getNodes(), index);
						o.editor.setValue(nodes.toString());
						o.recheck();
					};})(result.indexes[j], result.commonCorrector);

					reportErrors.appendChild(singleButton);
					reportErrors.appendChild($('<br/>')[0]);
				}
			}
		}
		reportErrors.appendChild($('<hr/>')[0]);
	}
	o.targetElement.innerHTML = '';
	if (brokenRules) {
		o.targetElement.appendChild(reportErrors);
	} else {
		$(o.targetElement).html('Ошибок не найдено');
	}

};
