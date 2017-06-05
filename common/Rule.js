'use strict';

var Nodes = require('./Nodes.js').Nodes;

/* eslint no-new: 0 */  // --> OFF

var rules = {};

function Rule(name, message, findErrors, fixErrors) {
	this.name = name;
	this.message = message;
	this.findErrors = findErrors;
	this.fixErrors = fixErrors;

	rules[name] = this;
}

new Rule(
	"nonewcommand",
	"Не допускается переопределение команд или окружений или определение новых",
	function(nodes) {
		return {
			quantity:
				nodes.getNodesQuantity("tag", "\\newcommand") +
				nodes.getNodesQuantity("tag", "\\renewcommand") +
				nodes.getNodesQuantity("tag", "\\newenvironment") +
				nodes.getNodesQuantity("tag", "\\renewenvironment")
		};
	}
);

new Rule(
	"noautonumformulas",
	"Не допускается использование автоматической нумерации формул",
	function(nodes) {
		return {
			quantity:
				nodes.getNodesQuantity("tag", "\\ref") +
				nodes.getNodesQuantity("tag", "\\label")
		};
	}
);

new Rule(
	"noautonumbiblio",
	"Не допускается использование автоматической нумерации библиографии",
	function(nodes) {
		return {
			quantity:
				nodes.getNodesQuantity("tag","\\cite") +
				nodes.getNodesQuantity("tag","\\bibitem")
		};
	}
);

new Rule(
	"Bibitem_exist",
	"В статье должна присутствовать библиография, оформленная в соответствии с требованиями",
	function(nodes) {
		return {
			quantity:
				+!(nodes.getNodesQuantity("tag","\\RBibitem") +
				nodes.getNodesQuantity("tag","\\Bibitem"))
		};
	}
);

new Rule(
	"udk_exist",
	"Необходимо указать УДК статьи с помощью команды \\udk",
	function(nodes) {
		return {
			quantity:
				+!(nodes.getNodesQuantity("tag","\\udk"))
		};
	}
);

new Rule(
	"udk_onlyone",
	"Необходимо указать УДК статьи с помощью одной команды \\udk. Если УДК несколько, используйте +, например, \\udk{111+222}",
	function(nodes) {
		return {
			quantity:
				+(nodes.getNodesQuantity("tag","\\udk") > 1)
		};
	}
);

new Rule(
	"noinlinefrac",
	"Дроби, находящиеся в строке, желательно оформлять как a/b, а не вертикально",
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
	"notoest",
	'Вместо "то есть" необходимо использовать сокращение "т. е."',
	function(nodes) {
		var text = nodes.toString();
		var quantity = text.match(/\sто\s+есть\s/g);
		return {
			quantity: quantity, // TODO: всё-таки число бы, а?
		};
	},
	function(nodes) {
		return (new Nodes(nodes.toString().replace(/\sто\sесть\s/g," т.~е. ")));
	}
);

new Rule(
	"no_nontrivial-comments",
	'Не разрешается комментировать фрагменты текста',
	function(nodes) {
		return {
			quantity: nodes.getNontrivialCommentsQuantity(),
		};
	},
	function(nodes) {
		nodes.removeNontrivialComments();
		return nodes;
	}
);

new Rule(
	"no_trivial-comments",
	'Не разрешается комментировать пустое окончание строки',
	function(nodes) {
		return {
			quantity: nodes.getTrivialCommentsNumbers().length,
		};
	},
	function(nodes) {
		nodes.removeTrivialComments();
		return nodes;
	}
);

new Rule(
	"separate$$",
	'Знак выключной формулы $$ должен занимать отдельную строку',
	function(nodes) {
		return {
			quantity: nodes.getNonseparated$$Numbers().length,
		};
	},
	function(nodes) {
		nodes.separate$$();
		return nodes;
	}
);

new Rule(
	"separate$",
	'Строчная формула должна занимать отдельную строку',
	function(nodes) {
		return {
			quantity: nodes.count$SeparationErrors(),
		};
	},
	function(nodes) {
		nodes.separate$();
		return nodes;
	}
);

new Rule(
	"splitrows80",
	'Длина строки не должна превышать 80 символов',
	function(nodes) {
		return {
			quantity: nodes.getTooLongRowsNumbers(80).length,
		};
	},
	function(nodes) {
		nodes.splitRows(80);
		return nodes;
	}
);

new Rule(
	'no_env_equation',
	'Не разрешается использование окружений \\begin{equation} ... \\end{equation}',
	function(nodes) {
		var indexes = nodes.getEnvironmentsList(['equation']);
		return {
			quantity: indexes.length,
			indexes: indexes,
		};
	}
);

new Rule(
	'no_env_equation*',
	'Не разрешается использование окружений \\begin{equation*} ... \\end{equation*}',
	function(nodes) {
		var indexes = nodes.getEnvironmentsList(['equation*']);
		return {
			quantity: indexes.length,
			indexes: indexes,
			commonCorrector: function(n, index) {
				n.renewEnvironment(index, new Nodes('$$'), new Nodes('$$'));
				return n;
			},
		};
	},
	function(nodes) {
		nodes.renewAllEnvironments(['equation*'], new Nodes('$$'), new Nodes('$$'));
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
	"longmapsto_instead_of_delta",
	"Возможно, сочетание 4=\\longmapsto должно обозначать оператор Лапласа \\Delta",
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
	"manual_paragraph_format",
	"Не допускается ручное форматирование текста",
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
	"empty_text_options",
	"Не допускаются пустые текстовые команды",
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
	"rtf2latex_subunicode_artifacts",
	"Вероятно, ошибка преобразования rtf2latex2e",
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
module.exports.rules = rules;
