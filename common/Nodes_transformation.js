'use strict';

module.exports = function(Nodes) {

Nodes.prototype.reparse = function() {
	 this.fromText(this.toString());
};

Nodes.prototype.insertSubnodes = function(index, subnodes) {
	for (var i = subnodes.nodes.length - 1; i >= 0; i--) {
		this.nodes.splice(index,0,subnodes.nodes[i]);
	}
};

Nodes.prototype.wrapInBracesIfAdditive = function() {
	// TODO: переделать на инъекцию нод в начало и конец
	if (this.toString().match(/[+-]/)) {
		// TODO: как-то поточнее, что ли
		this.fromText('(' + this.toString() + ')');
	}
};

Nodes.prototype.inlinizeAllFracs = function() {
	var nodes = this;
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

			var fracargs = formula.getArguments(fracnumbers[j] + 1, 2);

			console.log('fracargs', fracargs);
			var newfracargs = [];
			for (var k = 0; k < 2; k++) {
				newfracargs[k] = fracargs[k].slice();
				newfracargs[k].wrapInBracesIfAdditive();
			}
			// Тут начинается дичайший костыль
			// TODO: переписать
			var formulatext = formula.toString();
			console.log('formulatext', formulatext);
			var fractext = formula.getWithArguments(fracnumbers[i],2).toString();
			console.log('fractext', fractext);
			var newfractext = ' ' + newfracargs[0].toString() + '/' + newfracargs[1].toString() + ' ';
			console.log(newfractext, newfracargs);
			var newformulatext = formulatext.replace(fractext, newfractext);
			nodes.nodes.splice(numbers[i], numbers[i + 1] + 1 - numbers[i], { text: newformulatext });
			nodes.reparse();
		}
	}
	console.log(nodes);
	console.log(nodes.toString());
};

};
