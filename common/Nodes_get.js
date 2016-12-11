'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из других функций, правил и т.д.
// Они НЕ изменяют объект, а возвращают нечто новое

Nodes.prototype.getNodesQuantity = function(nodetype, nodetext) {
	return this.getNodesNumbers(nodetype, nodetext).length;
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
Nodes.areNodesEqual =  areNodesEqual;


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

Nodes.prototype.getArgumentsEnd = function(index, count) {
	var nodes = this.nodes;
	for (var i = 0; i < count; i++) {
		index = this.skipTypes(index, ['space', 'linebreak']);
		var arg = this.getGroupOrSingle(index);
		index += arg.nodes.length;
	}
	return index;
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

Nodes.prototype.isWellSeparated = function(index, rightSepTypes, wrongSepTypes, reverse) {
	var nodes = this.nodes;
	for (var i = index; i < nodes.length && i >= 0; i += (reverse ? -1 : 1)) {
		if (rightSepTypes.indexOf(nodes[i].type) > -1) {
			// Встретили правильный разделитель
			return true;
		} else if (wrongSepTypes.indexOf(nodes[i].type) > -1) {
			// Встретили неправильный разделитель
			return false;
		}
	}
	// Если дошли до конца и ничего не встретили - считаем, что правильно
	return true;
};

Nodes.prototype.isInsideSymmDelimiters = function(index, delimeterType, delimiterText, includeDelimiters) {
	var delimiters = this.getNodesNumbers(delimeterType, delimiterText);
	if (includeDelimiters && delimiters.indexOf(index) !== -1) {
		return true;
	}
	for (var i = 0; i < delimiters.length; i += 2) {
		if (index < delimiters[i + 1] && delimiters[i] < index) { // В таком порядке проверка д.б. быстрее
			return true;
		} else if (delimiters[i] > index) {
			return false;
		}
	}
	return false;
};

Nodes.prototype.getSymmDelimitedTagNumbers = function(delimiter, tags) {
	var fracs = this.getTagsArrayNumbers(tags);
	var targetfracs = [];

	// TODO: переписать через .filter()
	for (var i = 0; i < fracs.length; i++) {
		if (this.isInsideSymmDelimiters(fracs[i], delimiter.type, delimiter.text)) {
			targetfracs.push(fracs[i]);
		}
	}
	targetfracs.sort(function(a,b) {return a - b;});
	return targetfracs;
};

Nodes.prototype.getTagsArrayNumbers = function(tags) {
	var found = [];
	for (var i = 0; i < tags.length; i++) {
		found = found.concat(this.getNodesNumbers('tag', tags[i]));
	}
	return found;
};

Nodes.prototype.getChildrenInTagsArguments = function(parents, children, args) {
	var parentIndexes = this.getTagsArrayNumbers(parents);
	var found = [];
	for (var i = 0; i < parentIndexes.length; i++) {
		var index = parentIndexes[i];
		var end = this.getArgumentsEnd(index + 1, args);
		for (var j = index + 1; j < end; j++) {
			if (this.nodes[j].type === 'tag' && children.indexOf(this.nodes[j].text) !== -1) {
				found.push(j);
			}
		}
	}
	return found;
};

};
