'use strict';

var rulesets = require('../common/rulesets.js');
var rules = require('../common/Rule.js').rules;
var $ = require('jquery-with-bootstrap-for-browserify');
var katex = require('katex');

function genRandomClass() {
	return ('randomclass' + Math.random()).replace('.', '');
}

var KaTeXcache$ = {};
var KaTeXcache$$ = {};

function createKaTeXspan(nodes, index) {
//	console.time('createKaTeXspan()');
	var formula = nodes.getFormulaByIndex(index);
	var formulaText = nodes.getSubnodes(
		formula.start + 1,
		formula.end
	).toString();

	var displayMode = nodes.isInside$$(index);


	var cache = displayMode ? KaTeXcache$$ : KaTeXcache$;

	if (formulaText in cache) {
//		console.log('Cached:' + formulaText);
//		console.timeEnd('createKaTeXspan()');
		return cache[formulaText].cloneNode(true);
	}


	var preview = $('<span>', {
	});
	try {
		katex.render(formulaText, preview[0], {
			displayMode: displayMode,
			macros: {
				'\\eqno': '~~~~',
			}
		});
	} catch (e) {
		console.log(e);
		preview.html('(не удалось изобразить формулу)');
	}

	cache[formulaText] = preview[0];//.innerHTML;
//	console.timeEnd('createKaTeXspan()');
	return preview[0];
}

function createFullPreviewBlockIfNeeded(nodes, index, corrector, target) {
	console.time('createFullPreviewBlockIfNeeded()');
	//TODO: isInsideFormula
	if (!nodes.isInsideFormula(index)) {
//		console.timeEnd('createFullPreviewBlockIfNeeded()');
//		console.log('(not needed)');
		return;
	}

//	try {
		var randomClass = genRandomClass();
		var previewButton = $('<button>', {
			html : 'Предпросмотр',
			'data-target' : '.' + randomClass,
			'data-toggle' : 'collapse',
			'class': 'btn btn-default btn-preview',
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

//		console.time('createFullPreviewBlockIfNeeded(): second span');

		var nodesAfterFix = corrector(nodes.clone(), index);
//		console.timeEnd('createFullPreviewBlockIfNeeded(): second span');
		// Убеждаемся, что индекс по-прежнему показывает внутрь формулы
		if (!nodesAfterFix.isInsideFormula(index)) {
			return;
		}
		previewBody.appendChild(
			createKaTeXspan(nodesAfterFix, index)
		);

		target.appendChild(previewButton);
		target.appendChild(previewBody);
//	} catch (e) {}
	console.timeEnd('createFullPreviewBlockIfNeeded()');
}

function createFixButtonIfPossible(theRule, reportErrors, target, o) {
//	console.time('createFixButtonIfPossible()');
	if (!theRule.fixErrors) {
		return;
	}
	var fixbutton = $('<button>',{
		id: 'fixErrors-' + theRule.name,
		html: 'Исправить все',
		'class': 'btn btn-default btn-fix btn-fix-all',
	})[0];
	fixbutton.onclick = (function(rule) { return function() {
		try { // TODO: выляпаться из замыкания!!!
			console.log('Trying to fix ' + rule.name);
			var nodes = rule.fixErrors(o.getNodes());
			o.editor.focus();
			var pos = o.editor.getCursor();
			o.editor.setValue(nodes.toString());
			o.editor.focus();
			o.editor.setCursor(pos);
			o.recheck();
		} catch (e) {
			console.log(e);
		}
	};})(theRule);
	target.appendChild(fixbutton);
//	console.timeEnd('createFixButtonIfPossible()');
}

function createPartialCorrectButton(o, index, corrector, target) {
	console.time('createPartialCorrectButton');
	var singleButton = $('<button>',{
	html: 'Исправить',
		'class': 'btn btn-default btn-fix btn-fix-one',
	})[0];
	singleButton.onclick = (function(_index, _corrector) { return function() {
		var nodes = _corrector(o.getNodes(), _index);
		o.editor.focus();
		var pos = o.editor.getCursor();
		o.editor.setValue(nodes.toString());
		o.editor.focus();
		o.editor.setCursor(pos);
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
	console.timeEnd('createPartialCorrectButton');
}

module.exports.createHTMLreport = function(o) {
	console.time('createHTMLreport()');
	clearElement(o.targetElement);

	var reportErrors = document.createDocumentFragment();
	var reportGood = document.createDocumentFragment();
	var totalRules = rulesets[o.rulesetName].rules.length;
	var brokenRules = 0;

	//TODO: optimize: find maximum index and build the map only for nodes before it
	//However, it took 26ms to perform this on 1MB file, so optimization isn't crucial
	var mapRowCol =  o.nodesObject.getRowColMap();

	for (var i = 0; i < totalRules; i++) {
		var theRule = rules[rulesets[o.rulesetName].rules[i][0]];

		console.time('Checking rule: ' + theRule.name);
		var result = theRule.findErrors(o.nodesObject);
		console.timeEnd('Checking rule: ' + theRule.name);

		console.time('Building html for rule: ' + theRule.name);

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
			reportErrors,
			o
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
				//console.time('Building html for label: ' + theRule.name);

				var rowcol = $('<span style="cursor:pointer;">'); // TODO: таки сделать CSS-файл
				var coord = {
					row: mapRowCol.row[result.indexes[j]],
					col: mapRowCol.col[result.indexes[j]],
				};
				coord.row++;
				coord.col++;
				var coordEnd = {
					row: mapRowCol.row[result.indexes[j] + 1],
					col: mapRowCol.col[result.indexes[j] + 1],
				};
				coordEnd.row++;
				coordEnd.col++;
				rowcol.html('Строка ' + coord.row + ', символ ' + coord.col + '; ');
				divGroupErrors.appendChild(rowcol[0]);
				rowcol[0].onclick = (function(pos, end) { return function() {
					o.editor.focus();
					o.editor.setCursor({
						line: pos.row - 1,
						ch  : pos.col - 1,
					});
					o.editor.setSelection({
						line: pos.row - 1,
						ch  : pos.col - 1,
					},{
						line: end.row - 1,
						ch  : end.col - 1,
					});
					o.editor.focus();
				};})(coord, coordEnd);
				//console.timeEnd('Building html for label: ' + theRule.name);

				if (corrector) {
					createPartialCorrectButton(o, result.indexes[j], corrector, divGroupErrors);
				}
			}
			//console.time('Appending html for rule: ' + theRule.name);
			reportErrors.appendChild(divGroupErrors);
			//console.timeEnd('Appending html for rule: ' + theRule.name);
		}

		reportErrors.appendChild($('<hr/>')[0]);
		console.timeEnd('Building html for rule: ' + theRule.name);

	}

	if (brokenRules) {
		o.targetElement.appendChild(reportErrors);
	} else {
		$(o.targetElement).html('Ошибок не найдено');
	}
	console.timeEnd('createHTMLreport()');
};

function clearElement(el) {
	console.time('clearElement()');
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
	//el.innerHTML = '';

	console.timeEnd('clearElement()');
}
