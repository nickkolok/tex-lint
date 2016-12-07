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

Nodes.prototype.insertNode = function(index, node) {
	this.nodes.splice(index, 0, node);
};

Nodes.prototype.wrapInBracesIfAdditive = function() {
	// TODO: переделать на инъекцию нод в начало и конец
	if (this.toString().match(/[+-]/)) {
		// TODO: как-то поточнее, что ли
		this.fromText('(' + this.toString() + ')');
	}
};

Nodes.prototype.groupString = function(start, end, type) {
	var nodes = this.nodes;
	nodes[start].type = type || 'groupstring';
	for (var i = start + 1; i <= end; i++) {
		nodes[start].text += nodes[i].text;
	}
	nodes.splice(start + 1, end - start);
};

Nodes.prototype.groupInlineFormulas = function() {
	var $indexes = this.getNodesNumbers('keyword','$');
	if ($indexes.length) {
		this.groupString($indexes[0], $indexes[1], 'inlineformula');
		this.groupInlineFormulas();
	}
};

function inlinizeFracsInSingleFormula(text) {
	var formula = new Nodes(text);
	var fracnumbers = formula.getNodesNumbers('tag', '\\frac');
	if (!fracnumbers.length) {
		return text;
	}

	var fracnumber = fracnumbers[0];
	var fracargs = formula.getArguments(fracnumber + 1, 2);
	console.log('fracargs', fracargs);
	var newfracargs = [];
	for (var k = 0; k < 2; k++) {
		newfracargs[k] = fracargs[k].slice();
		newfracargs[k].wrapInBracesIfAdditive();
	}

	var fractext = formula.getWithArguments(fracnumber,2).toString();
	console.log('fractext', fractext);
	var newfractext = ' ' + newfracargs[0].toString() + '/' + newfracargs[1].toString() + ' ';
	console.log('newfractext', newfractext);
	return inlinizeFracsInSingleFormula(text.replace(fractext, newfractext));
}

Nodes.prototype.inlinizeAllFracs = function() {
	// Загоняем все формулы в макроноды
	// Знаю, что костыль. Полшестого утра, хрен с ним

	this.groupInlineFormulas();

	var nodes = this.nodes;

	// Ищем ноду, которая формула

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].type == 'inlineformula') {
			nodes[i].text = inlinizeFracsInSingleFormula(nodes[i].text);
		}
	}

	// Затратно, но сердито
	this.reparse();
};


};
