'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из других функций, правил и т.д.
// Они НЕ изменяют объект, а возвращают нечто новое

Nodes.prototype.getNodesQuantity = function(nodetype, nodetext) {
	var quantity = 0;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type == nodetype && this.nodes[i].text == nodetext) {
			quantity++;
		}
	}
	return quantity;
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
	var nodes = this.nodes;
	while (nodes[index] && types.indexOf(nodes[index].type) > -1) {
		index++;
	}
	return index;
};

Nodes.prototype.skipTypesReverse = function(index, types) {
	var nodes = this.nodes;
	while (nodes[index] && types.indexOf(nodes[index].type) > -1) {
		index--;
	}
	return index;
};

Nodes.prototype.skipToTypes = function(index, types) {
	var nodes = this.nodes;
	while (nodes[index] && types.indexOf(nodes[index].type) == -1) {
		index++;
	}
	return index;
};

Nodes.prototype.skipToTypesReverse = function(index, types) {
	var nodes = this.nodes;
	while (nodes[index] && types.indexOf(nodes[index].type) == -1) {
		index--;
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

Nodes.prototype.slice = function() {
	var copy = new Nodes();
	copy.nodes = this.nodes.slice();
	return copy;
};

Nodes.prototype.isNontrivialComment = function(index) {
	return (
		this.nodes[index].type === 'comment'
	&&
		(
			this.nodes[index].text.length > 1
		//||
			//Комментарий в конце файле бессмысленнен и потому нетривиален. Л - логика!
			//index === this.nodes.length - 1
		//||
			//И в комментарии есть непробельные символы
			//this.nodes[this.skipTypes(index + 1,['space'])].type !== 'linebreak'
			// NB: пробелы не влияют на тривиальность
		)
	);
};

Nodes.prototype.getNontrivialCommentsNumbers = function() {
	var nums = [];
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.isNontrivialComment(i)) {
			nums.push(i);
		}
	}
	return nums;
};

Nodes.prototype.getNontrivialCommentsQuantity = function() {
	return this.getNontrivialCommentsNumbers().length;
};


Nodes.prototype.isTrivialComment = function(index) {
	return (
		this.nodes[index].type === 'comment'
	&&
		this.nodes[index].text === '%'
	);
};

Nodes.prototype.getTrivialCommentsNumbers = function() {
	var nums = [];
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.isTrivialComment(i)) {
			nums.push(i);
		}
	}
	return nums;
};

Nodes.prototype.isNonseparated$$ = function(index) {
	var left = this.nodes[this.skipTypesReverse(index - 1,['space'])];
	var right = this.nodes[this.skipTypes(index + 1,['space'])];
	var node = this.nodes[index];
	return node && node.type === 'keyword' && node.text === '$$' &&
	(
		left && left.type !== 'linebreak'
	||
		right && right.type !== 'linebreak'
	);
};

Nodes.prototype.getNonseparated$$Numbers = function() {
	var nums = this.getNodesNumbers('keyword', '$$');
	var rez = [];
	for (var i = 0; i < nums.length; i++) {
		if (this.isNonseparated$$(nums[i])) {
			rez.push(nums[i]);
		}
	}
	return rez;
};

};
