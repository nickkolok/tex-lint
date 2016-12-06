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
		var numbers = nodes.getNodesNumbers('keyword','$');
		console.log('numbers', numbers);
		for (var i = 0; i < numbers.length; i += 2) {
			// При предыдущих правках номера нод "$", скорее всего, изменились
			numbers = nodes.getNodesNumbers('keyword', '$');
			console.log('numbers', numbers);

			var formula = nodes.getSubnodes(numbers[i], numbers[i + 1] + 1);

			var fracnumbers = formula.getNodesNumbers('keyword','$');

			for (var j = 0; j < fracnumbers.length; j++) {
				// При предыдущих правках номера нод "\\frac", скорее всего, изменились
				fracnumbers = formula.getNodesNumbers('tag', '\\frac');

				console.log('fracnumbers', fracnumbers);

				var fracargs = formula.getArguments(fracnumbers[j], 2);

				console.log('fracargs', fracargs);
				// TODO: вынести этот кусок в функцию, при необходимости оборачивающую в скобки
				var newfracargs = [];
				for (var k = 0; k < 2; k++) {
					// TODO: как-то поточнее, что ли
					if (fracargs[k].toString().match(/[+-]/)) {
						newfracargs[k] = new Nodes('(' + fracargs[k].toString() + ')');
					} else {
						newfracargs[k] = fracargs[k];
					}
				}
				// Тут начинается дичайший костыль
				// TODO: переписать
				var formulatext = formula.toString();
				console.log('formulatext', formulatext);
				var fractext = formula.getWithArguments(fracnumbers[i]).toString();
				var newfractext = ' ' + newfracargs[0].toString() + '/' + newfracargs[1].toString() + ' ';
				console.log(newfractext, newfracargs);
				var newformulatext = formulatext.replace(fractext, newfractext);
				nodes.nodes.splice(numbers[i], numbers[i + 1] + 1 - numbers[i], { text: newformulatext });
				nodes = new Nodes(nodes.toString());
			}
		}
		console.log(nodes);
		console.log(nodes.toString());
		return nodes;
	}
);

module.exports.rules = rules;
