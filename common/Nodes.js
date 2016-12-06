'use strict';


// Костыль =(
// С browserify такого быть не должно

try {
	if (typeof (navigator) === 'undefined') {
		var CodeMirror = require("../node_modules/codemirror/addon/runmode/runmode.node.js");
		require("../node_modules/codemirror/mode/meta.js");
		require("../node_modules/codemirror/mode/stex/stex.js");

	} else {
		var CodeMirror = window.CodeMirror;
	}
} catch (e) {
	console.log(e);
}

// Конструктор
function Nodes(text) {
  this.nodes = [];
  if (text) {
	  this.fromText(text);
  }
};

Nodes. LEFT_CURLY  = { type:'bracket', text:'{' };
Nodes.RIGHT_CURLY  = { type:'bracket', text:'}' };
Nodes. LEFT_SQUARE = { type:'bracket', text:'[' };
Nodes.RIGHT_SQUARE = { type:'bracket', text:']' };

Nodes.prototype.fromText = function(text) {
	this.nodes = [];
	var self = this;
	CodeMirror.runMode(
		text,
		{ name:'stex' },
		function(node, style) {
			self.nodes.push({ text:node, type:style });
		}
	);
	this.prepareNodes();
};

Nodes.prototype.getNodesQuantity = function(nodetype, nodetext) {
	var quantity = 0;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type == nodetype && this.nodes[i].text == nodetext) {
			quantity++;
		}
	}
	return quantity;
};


Nodes.prototype.markCyrillicNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (isCyryllicText(this.nodes[i].text)) {
			this.nodes[i].type = "cyrtext";
		}
	}
};

Nodes.prototype.markSpaceNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].text == "\n") {
			this.nodes[i].type = "linebreak";
		} else if (/^\s+$/.test(this.nodes[i].text)) {
			this.nodes[i].type = "space";
		}
	}
};

Nodes.prototype.joinCyrillicNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		// TODO: объединять не по одной, а по несколько. А то тормозит. Переделать!
		if (this.nodes[i].type == "cyrtext" && this.nodes[i + 1].type == "cyrtext") {
			this.nodes[i].text += this.nodes[i + 1].text;
			this.nodes.splice(i + 1, 1);
			i--;
		}
	}
};

Nodes.prototype.prepareNodes = function() {
	this.markSpaceNodes();
	this.markCyrillicNodes();
	this.joinCyrillicNodes();
};

Nodes.prototype.getNodesNumbers = function(nodetype, nodetext) {
	var numbers = [];
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type == nodetype && this.nodes[i].text == nodetext) {
			numbers.push(i);
		}
	}
	return numbers;
};

Nodes.prototype.getSubnodes = function(start, end) {
	var newNodes = new Nodes();
	newNodes.nodes = this.nodes.slice(start,end);
	return newNodes;
};

Nodes.prototype.getAllSingleDelimited = function(nodetype, nodetext) {
	var result = [];
	var fl = false;
	var start;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type == nodetype && this.nodes[i].text == nodetext) {
			if (!fl) {
				// Левый конец
				start = i + 1;
				fl = true;
			} else {
				// Правый конец
				fl = false;
				result.push(this.getSubnodes(start, i));
			}
		}
	}
	return result;
};

function areNodesEqual(node1, node2) {
	if (!node1 || !node2) {
		return false;
	}
	// TODO: регулярки
	return node1.type === node2.type && node1.text === node2.text;
}

Nodes.prototype.getBraceGroup = function(start, left, right) {
	// Считаем, что нода с номером start - открывающая (левая) скобка
	var depth = 1;
	var end;
	for (end = start + 1; end < this.nodes.length; end++) {
		if (areNodesEqual(this.nodes[end], left)) {
			depth++;
		} else if (areNodesEqual(this.nodes[end], right)) {
			depth--;
			if (!depth) {
				end++;
				break;
			}
		}
	}
	console.log(start, end);
	return this.getSubnodes(start, end);
 };

Nodes.prototype.getGroupOrSingle = function(index) {
	var nodes = this.nodes;
	while (nodes[index] && (nodes[index].type === 'space' || nodes[index].type === 'linebreak')) {
		index++;
	}

	if (areNodesEqual(nodes[index], Nodes.RIGHT_CURLY) || areNodesEqual(nodes[index], Nodes.RIGHT_SQUARE)) {
		// Внезапно встретили закрывающую скобку
		return new Nodes();
	}

	if (areNodesEqual(nodes[index], Nodes.LEFT_CURLY)) {
		// Фигурная скобка
		return this.getBraceGroup(index, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY);
	}

	if (areNodesEqual(nodes[index], Nodes.LEFT_SQUARE)) {
		// Квадратная скобка
		return this.getBraceGroup(index, Nodes.LEFT_SQUARE, Nodes.RIGHT_SQUARE);
	}

	// Не скобка вообще
	return this.getSubnodes(index, index + 1);
};

Nodes.prototype.skipTypes = function(index, types) {
	// TODO: reverse
	var nodes = this.nodes;
	while (nodes[index] && types.indexOf(nodes[index].type) > -1) {
		index++;
	}
	return index;
};

Nodes.prototype.getArguments = function(index, count) {
	var nodes = this.nodes;
	var args = [];
	for (var i = 0; i < count; i++) {
		index = this.skipTypes(index, ['space', 'linebreak']);
		var arg = this.getGroupOrSingle(index);
		index += arg.nodes.length;
		args.push(arg);
	}
	return args;
};

Nodes.prototype.getWithArguments = function(index, count) {
	var nodes = this.nodes;
	var start = index;
	// Берём то, аргументы чего ищем
	index++;
	for (var i = 0; i < count; i++) {
		index = this.skipTypes(index, ['space', 'linebreak']);
		var arg = this.getGroupOrSingle(index);
		index += arg.nodes.length;
	}
	return this.getSubnodes(start, index);
};

Nodes.prototype.toString = function() {
	var str = '';
	for (var i = 0; i < this.nodes.length; i++) {
		str += this.nodes[i].text;
	}
	return str;
};

// TODO: наследовать от массива и this.nodes = this

// Вспомогательные - вынести!

function isCyryllicText(text) {
	return /^[А-ЯЁ]+$/i.test(text);
}

module.exports.Nodes = Nodes;
