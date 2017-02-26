var rulesets = require('../common/rulesets.js');
var rules = require('../common/Rule.js').rules;
var $ = require('./jquery-with-bootstrap-for-browserify.js');
var katex = require('katex');

function genRandomClass() {
	return ('randomclass' + Math.random()).replace('.', '');
}

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
				'class': 'btn btn-default',
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

		// Если известны точные места...
		if (result.indexes) {
			var randomClass = genRandomClass();
			reportErrors.appendChild($('<button>', {
				html : 'Свернуть/развернуть',
				'data-target' : '.' + randomClass,
				'data-toggle' : 'collapse',
				'class': 'btn btn-default',
			})[0]);

			var divGroupErrors = $('<div>', {
				'class' : 'collapse in ' + randomClass,
			})[0];

			for (var j = 0; j < result.indexes.length; j++) {
				var rowcol = $('<span>');
				var coord = o.nodesObject.getRowCol(result.indexes[j]);
				rowcol.html('Строка ' + coord.row + ', символ ' + coord.col + '; ');
				divGroupErrors.appendChild(rowcol[0]);
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
						'class': 'btn btn-default',
					})[0];
					singleButton.onclick = (function(index, corrector) { return function() {
						var nodes = corrector(o.getNodes(), index);
						o.editor.setValue(nodes.toString());
						o.recheck();
					};})(result.indexes[j], result.commonCorrector);

					divGroupErrors.appendChild(singleButton);

					// А если это ещё и внутри формулы...
					var isInside$   = o.nodesObject.isInside$(result.indexes[j], true);
					var isInside$$  = o.nodesObject.isInside$$(result.indexes[j], true);
					if (isInside$ || isInside$$) {
						//TODO: isInsideFormula - ?
						var randomClass = genRandomClass();
						var previewButton = $('<button>', {
							html : 'Предпросмотр',
							'data-target' : '.' + randomClass,
							'data-toggle' : 'collapse',
							'class': 'btn btn-default',
						})[0];

						var previewBody = $('<div>', {
							'class' : 'collapse ' + randomClass,
						})[0];

						var previewBefore = $('<span>', {
						})[0];
						var previewComment = $('<span>', {
							'html' : ' будет преобразовано в '
						})[0];
						var previewAfter = $('<span>', {
						})[0];
						previewBody.appendChild(previewBefore);
						previewBody.appendChild(previewComment);
						previewBody.appendChild(previewAfter);
						katex.render("c = \\pm\\sqrt{a^2 + b^2}", previewBefore, {
							displayMode: isInside$$,
						});
						var nodesAfterFix = o.nodesObject.clone();
						katex.render("d = \\pm\\sqrt{a^2 + b^2}", previewAfter);
						divGroupErrors.appendChild(previewButton);
						divGroupErrors.appendChild(previewBody);
					}

					divGroupErrors.appendChild($('<br/>')[0]);
				}
			}
			reportErrors.appendChild(divGroupErrors);
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
