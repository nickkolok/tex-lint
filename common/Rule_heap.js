'use strict';

var Nodes = require('./Nodes.js').Nodes;
var RuleViolation = require('./RuleViolation.js');
var Rule = require('./Rule.js').Rule;

// Те правила, которые нужно отрефакторить и растащить по файлам

/* eslint no-new: 0 */  // --> OFF

new Rule(
	'Bibitem_exist',
	'В статье должна присутствовать библиография, оформленная в соответствии с требованиями',
	function(nodes) {
		return {
			quantity:
				+!(nodes.getNodesQuantity('tag','\\RBibitem') +
				nodes.getNodesQuantity('tag','\\Bibitem'))
		};
	}
);

new Rule(
	'udk_exist',
	'Необходимо указать УДК статьи с помощью команды \\udk',
	function(nodes) {
		return {
			quantity:
				+!(nodes.getNodesQuantity('tag','\\udk'))
		};
	}
);

new Rule(
	'udk_onlyone',
	'Необходимо указать УДК статьи с помощью одной команды \\udk. Если УДК несколько, используйте +, например, \\udk{111+222}',
	function(nodes) {
		return {
			quantity:
				+(nodes.getNodesQuantity("tag","\\udk") > 1)
		};
	}
);

new Rule(
	'noinlinefrac',
	'Дроби, находящиеся в строке, желательно оформлять как a/b, а не вертикально',
	function(nodes) {
		var indexes = nodes.getSymmDelimitedTagNumbers(Nodes.NEW_$(),['\\frac']);
		return {
			quantity: indexes.length,
			indexes: indexes,
			commonCorrector: function(n, index) {
				n.inlinizeFrac(index);
				return n;
			},
		};
	},
	function(nodes) {
		nodes.inlinizeAllFracs();
		return nodes;
	}
);

new Rule(
	'noinlinesumprod',
	'Формулы, содержащие знаки суммирования, произведения, максимума и т. д., желательно выносить в отдельную строку',
	function(nodes) {
		var indexes = nodes.getSymmDelimitedTagNumbers(Nodes.NEW_$(),[
			'\\sum',
			'\\prod',
			'\\coprod',
			'\\max',
			'\\min',
		]);
		return {
			quantity: indexes.length,
			indexes: indexes,
			commonCorrector: function(n, index) {
				n.pushFormulaOut(index);
				return n;
			},
		};
	}
	,
	function(nodes) {
		nodes.pushAllUglyFormulasOut([
			'\\sum',
			'\\prod',
			'\\coprod',
			'\\max',
			'\\min',
		]);
		return nodes;
	}
);

new Rule(
	'no_frac_in_sub_sup',
	'Не разрешается использование вертикальных дробей в степенях, верхних и нижних индексах',
	function(nodes) {
		var indexes = nodes.getChildrenInTagsArguments(['_', '^'], ['\\frac'], 1);
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.inlinizeFrac(index);
				return n;
			},
		};
	}
	,
	function(nodes) {
		nodes.inlinizeAllSubSupFracs();
		return nodes;
	}
);

new Rule(
	'longmapsto_instead_of_delta',
	'Возможно, сочетание 4=\\longmapsto должно обозначать оператор Лапласа \\Delta',
	function(nodes) {
		var indexes = nodes.getSuspiciousLongmaps();
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.replaceArguments(index, 3, new Nodes('\\Delta'));
				return n;
			},
		};
	}
);

new Rule(
	'manual_paragraph_format',
	'Не допускается ручное форматирование текста',
	function(nodes) {
		var indexes = nodes.getTagsAssignments([
			'\\baselineskip',
			'\\leftskip',
			'\\parindent',
		]);
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.replaceArguments(index, 2);
				return n;
			},
		};
	}
);

new Rule(
	'empty_text_options',
	'Не допускаются пустые текстовые команды',
	function(nodes) {
		var indexes = nodes.getTagsEmpty([
			'\\large',
			'\\text',
		]);
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.replaceArguments(index, 2);
				return n;
			},
		};
	}
);

new Rule(
	'rtf2latex_subunicode_artifacts',
	'Вероятно, ошибка преобразования rtf2latex2e',
	function(nodes) {
		var indexes = nodes.getSubunicodeArtifacts();
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.correctSubunicodeArtifact(index);
				return n;
			},
		};
	}
);

// TODO: мини-либа mathopnames
// TODO: таки разобраться, что из этого есть в ТеХе, а чего нет
// \\arccosh, например, нет, а \\cosh и \\arccos есть.
var mathOpNamesInt = [
	'sin',
	'cos',
	'tan',
	'cot',
	'sec',
	'csc',
	'sinh',
	'cosh',
	'tanh',
	'coth',

//	TODO: определиться, что из этого есть в LaTeX и как с ними работать
	'log', // есть
	'ln', // есть
	'lg', // есть

	'infty', // Встречалось и такое!
	'frac',
];

var mathOpNamesRus = [
	'tg',
	'ctg',
	'cosec',
	'sh',
	'ch',
	'th',
	'cth',
];

function makeArc(value, index, array) {
	array.push('arc' + value);
	array.push('Arc' + value);
}

mathOpNamesInt.forEach(makeArc);
mathOpNamesRus.forEach(makeArc);

var mathOpNamesAll = mathOpNamesInt.concat(mathOpNamesRus);

var mathOpRegExpAll = new RegExp('(' + mathOpNamesAll.reverse().join('|') + ')', 'g');
var mathOpRegExpInt = new RegExp('(' + mathOpNamesInt.reverse().join('|') + ')', 'g');
var mathOpRegExpRus = new RegExp('(' + mathOpNamesRus.reverse().join('|') + ')', 'g');

new Rule(
	'sin_must_be_command',
	'Названия математических операторов, такие как sin, в формулах должны быть прямым шрифтом. Пропущена дробь \\ перед командой',
	function(nodes) {
		var indexes = nodes.findSingleByRegExp(
			/variable-2/,
			mathOpRegExpInt
		);
		return {
			indexes: indexes,
			quantity: indexes.length,
			commonCorrector: function(n, index) {
				n.nodes[index].text = n.nodes[index].text.
					replace(mathOpRegExpInt, '\\$1')
				;
				n.reparse();
				return n;
			},
		};
	}
);

new Rule({
	name: 'tg_must_be_command',
	message: 'Русские названия математических операторов, такие как tg, в формулах должны быть прямым шрифтом; используйте \\operatorname',
	findErrors: function(nodes) {
		var indexesSusp = nodes.findSingleByRegExp(
			/variable-2/,
			mathOpRegExpRus
		);
		var indexes = [];
		var operatorname = [{ type: /^tag$/, text: /\\operatorname/ }];
		indexesSusp.forEach(function(index) {
			if (!nodes.isInsideArgumentsOf(index, operatorname, 2)) {
				indexes.push(index);
			}
		});

		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(n, index) {
		n.nodes[index].text = n.nodes[index].text.
			replace(mathOpRegExpRus, '\\operatorname{$1}')
			;
		n.reparse();
		return n;
	},
});

new Rule({
	name: 'eof_newline',
	message: 'Файл должен заканчиваться пустой строкой',
	findErrors: function(nodes) {
		var last = nodes.nodes[nodes.length - 1];
		var indexes = [];
		if (last && last.type !== 'linebreak') {
			indexes = [nodes.length - 1];
		}
		return new RuleViolation({
			indexes: indexes,
			commonCorrector: function(n) {
				n.nodes.push({ text:'\n', type: 'linebreak' });
				return n;
			},
		});
	},
	fixErrors: function(n) {
		var last = n.nodes[n.length - 1];
		if (last && last.type !== 'linebreak') {
			n.nodes.push({ text:'\n', type: 'linebreak' });
		}
		return n;
	},
});

new Rule({
	name: 'eof_newline_only_one',
	message: 'Файл должен заканчиваться ровно одной пустой строкой',
	findErrors: function(nodes) {
		var last = nodes.nodes[nodes.length - 1];
		var prelast = nodes.nodes[nodes.length - 2];
		var indexes = [];
		if (last && prelast && last.type === 'linebreak' && prelast.type === 'linebreak') {
			indexes = [nodes.length - 2];
		}
		return new RuleViolation({
			indexes: indexes,
			commonCorrector: function(n) {
				n.nodes.pop();
				return n;
			},
		});
	},
	fixErrors: function(n) {
		var last = n.nodes[n.length - 1];
		var prelast = n.nodes[n.length - 2];
		var indexes = [];
		if (last && prelast && last.type === 'linebreak' && prelast.type === 'linebreak') {
			n.nodes.pop();
		}
		return n;
	},
});

new Rule({
	name: 'no_spaces_at_line_beginning',
	// Мягко говоря, спорное, включать только с твёрдым пониманием последствий
	message: 'Строка не должна начинаться с пробелов',
	findErrors: function(nodes) {
		return new RuleViolation({
			indexes: nodes.findSequenceByRegExp([
				{ type: /linebreak/, text: /^/ },
				{ type: /space/, text: /[ ]+/ },
			]),
		});
	},
	commonCorrector: function(n, index) {
		n.nodes.splice(index + 1, 1);
		return n;
	},
});
//TODO: batchFixOrder

new Rule({
	name: 'no_spaces_at_line_ending',
	// СтОит включать почти всегда, но кому-то может быть неудобно
	message: 'Строка не должна заканчиваться пробелом',
	findErrors: function(nodes) {
		return new RuleViolation({
			indexes: nodes.findSequenceByRegExp([
				{ type: /space/, text: /[ ]+/ },
				{ type: /linebreak/, text: /^/ },
			]),
		});
	},
	commonCorrector: function(n, index) {
		n.nodes.splice(index, 1);
		return n;
	},
});


var eyo = require('eyo-kernel');

new Rule({
	name: 'eyo',
	message: 'Букву Ё следует использовать',
	findErrors: function(nodes) {
		var indexes = [];
		nodes.nodes.forEach(function(node, index) {
			var text = node.text;
			if (node.type === 'cyrtext' && eyo.restore(text) !== text) {
				indexes.push(index);
			}
		});
		return new RuleViolation({
			indexes: indexes,
		});
	},
	commonCorrector: function(nodes, index) {
		nodes.nodes[index].text = eyo.restore(nodes.nodes[index].text);
		return nodes;
	}
});


new Rule({
	name: 'numbers_must_be_in_formula',
	message: 'Числа должны находиться внутри формул',
	findErrors: function(nodes) {
		var decimalFracsIndexesAll = nodes.findSequenceByRegExp([
			{ type: /^number$/, text: /^/ },
			{ type: /^atom$/, text: /^.$/ },
			{ type: /^number$/, text: /^/ },
		]);
		var decimalFracsIndexesOuter = [];
		decimalFracsIndexesAll.forEach(function(index) {
			if (!nodes.isInsideFormula(index)) {
				decimalFracsIndexesOuter.push(index);
			}
		});
		var integersIndexesAll = nodes.findSequenceByRegExp([
			{ type: /^number$/, text: /^/ },
		]);
		var integersIndexesOuter = [];
		integersIndexesAll.forEach(function(index) {
			if (
				!nodes.isInsideFormula(index)
			&&
				decimalFracsIndexesOuter.indexOf(index - 2) === -1
			) {
				integersIndexesOuter.push(index);
			}
		});
		return new RuleViolation({
			indexes: integersIndexesOuter.concat(decimalFracsIndexesOuter),
		});
	},
	// TODO: commonCorrector
	// TODO: А если \begin{equation}
});