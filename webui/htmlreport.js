var rulesets = require('../common/rulesets.js');
var rules = require('../common/Rule.js').rules;
var $ = require('jquery-with-bootstrap-for-browserify');
var katex = require('katex');

function genRandomClass() {
	return ('randomclass' + Math.random()).replace('.', '');
}

function createKaTeXspan(nodes, index) {
	var formula = nodes.getFormulaByIndex(index);
	var formulaText = nodes.getSubnodes(
		formula.start + 1,
		formula.end
	).toString();

	var preview = $('<span>', {
	});
	try {
		katex.render(formulaText, preview[0], {
			displayMode: nodes.isInside$$(index),
		});
	} catch (e) {
		console.log(e);
		preview.html('(не удалось изобразить формулу)');
	}

	return preview[0];
}

function createFullPreviewBlockIfNeeded(nodes, index, corrector, target) {
	//TODO: isInsideFormula
	if (!nodes.isInside$(index) && !nodes.isInside$$(index)) {
		return;
	}
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

	previewBody.appendChild(
		createKaTeXspan(nodes, index)
	);
	previewBody.appendChild(
		$('<span>', {
			'html' : ' будет преобразовано в '
		})[0]
	);

	var nodesAfterFix = corrector(nodes.clone(), index);
	// Убеждаемся, что индекс по-прежнему показывает внутрь формулы
	if (!nodesAfterFix.isInside$(index) && !nodesAfterFix.isInside$$(index)) {
		return;
	}
	previewBody.appendChild(
		createKaTeXspan(nodesAfterFix, index)
	);

	target.appendChild(previewButton);
	target.appendChild(previewBody);
}

function createFixButtonIfPossible(theRule, reportErrors, target) {
	if (!theRule.fixErrors) {
		return;
	}
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
	target.appendChild(fixbutton);
}

function createPartialCorrectButton(o, index, corrector, target) {
	var singleButton = $('<button>',{
	html: 'Исправить',
		'class': 'btn btn-default',
	})[0];
	singleButton.onclick = (function(_index, _corrector) { return function() {
		var nodes = _corrector(o.getNodes(), _index);
		o.editor.setValue(nodes.toString());
		o.recheck();
	};})(index, corrector);

	target.appendChild(singleButton);
	createFullPreviewBlockIfNeeded(
		o.nodesObject,
		index,
		corrector,
		target
	);
	target.appendChild($('<br/>')[0]);
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
		var corrector = (result.commonCorrector || theRule.commonCorrector);
		createFixButtonIfPossible(
			theRule,
			corrector,
			reportErrors
		);

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
				if (corrector) {
					createPartialCorrectButton(o, result.indexes[j], corrector, divGroupErrors);
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
