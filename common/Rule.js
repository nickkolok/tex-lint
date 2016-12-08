'use strict';

var Nodes = require('./Nodes.js').Nodes;

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
		var quantity = 0;
		var formulas = nodes.getAllSingleDelimited('keyword','$');
		for (var i = 0; i < formulas.length; i++) {
			quantity += formulas[i].getNodesQuantity('tag','\\frac');
		}
		return {
			quantity: quantity,
		};
	},
	function(nodes) {
		nodes.inlinizeAllFracs();
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


module.exports.rules = rules;
