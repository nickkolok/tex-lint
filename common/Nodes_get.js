'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из других функций, правил и т.д.
// Они НЕ изменяют объект, а возвращают нечто новое

Nodes.prototype.getNodesQuantity = function(nodetype, nodetext) {
	return this.getNodesNumbers(nodetype, nodetext).length;
};

Nodes.prototype.getNodesNumbers = function(nodetype, nodetext) {
	var numbers = [];
	for (var i = 0; i < this.length; i++) {
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
	for (var i = 0; i < this.length; i++) {
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
	for (end = start + 1; end < this.length; end++) {
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
	index = this.skipTypes(index, ['space', 'linebreak']);

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

Nodes.prototype.getArgumentsMap = function(index, count) {
	var nodes = this.nodes;
	var argsmap = [];
	for (var i = 0; i < count; i++) {
		if (index >= nodes.length) {
			break;
		}
		index = this.skipTypes(index, ['space', 'linebreak']);
		var arg = this.getGroupOrSingle(index);
		var end = index + arg.length;
		argsmap.push([index, end - 1]);
		index = end;
	}
	return argsmap;
};


Nodes.prototype.getArguments = function(index, count) {
	return this.getArgumentsMap(index, count).map(function(arg) {
		return this.getSubnodes(arg[0], arg[1] + 1);
	}, this);
};

Nodes.prototype.getArgumentsEnd = function(index, count) {
	var argsmap = this.getArgumentsMap(index, count);
	if (!argsmap.length) {
		return 0;
	}
	return (argsmap[argsmap.length - 1][1] + 1 || 0);
};

Nodes.prototype.getWithArguments = function(index, count) {
	return this.getSubnodes(index, this.getArgumentsEnd(index, count + 1));
};

Nodes.prototype.toString = function() {
	var str = '';
	for (var i = 0; i < this.length; i++) {
		str += this.nodes[i].text;
	}
	return str;
};

Nodes.prototype.slice = function() {
	var copy = new Nodes();
	copy.nodes = this.nodes.slice();
	return copy;
};

Nodes.prototype.clone = function() {
	//console.time('Nodes.clone()');
	var copy = new Nodes();
	copy.nodes = this.map(function(n) {
		return {
			type : n.type,
			text : n.text,
		};
	});
	//console.timeEnd('Nodes.clone()');
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

Nodes.prototype.isInsideSymmDelimiters = function(index, delimiterType, delimiterText, includeDelimiters) {

	console.log(this.getSubnodes(index - 10, index + 10).toString());
	console.log("!  !  ", this.nodes[index].text);
	console.log(index, delimiterType, delimiterText, includeDelimiters);

	// If the node is a delimiter, return includeDelimiter
	if (this.nodes[index].type === delimiterType && this.nodes[index].text === delimiterText) {
		return !!includeDelimiters;
	}

	// If there are 2n+1 delimiters on the left, then index is inside
	var delimCount = 0;
	for (;index > -1; index--) {
		if (this.nodes[index].type === delimiterType && this.nodes[index].text === delimiterText) {
			delimCount++;
		}
	}
	return !!(delimCount % 2);
};

Nodes.prototype.isInside$ = function(index, includeDelimiters) {
	return this.isInsideSymmDelimiters(index, 'keyword', '$', includeDelimiters);
};

Nodes.prototype.isInside$$ = function(index, includeDelimiters) {
	console.time('isInside$$ ' + index);
	if (!includeDelimiters) {
		var delimCount = 0;
		for (; index > -1; index--) {
			if (this.nodes[index].type === 'keyword') {
				if (this.nodes[index].text === '$$') {
					delimCount++;
				} else if (this.nodes[index].text === '\\[') {
					return true;
				} else {
					break;
				}
			}
		}
		return !!(delimCount % 2);
	}

	var res = this.isInsideSymmDelimiters(index, 'keyword', '$$', includeDelimiters);
	console.timeEnd('isInside$$ ' + index);
	console.log(res);
	return res;
};

Nodes.prototype.isInsideFormula = function(index, includeDelimiters) {
	console.time('Nodes.isInsideFormula()');
	if (!includeDelimiters) {
		var indexOld = index; //DBG

		// If there are 2n+1 delimiters on the left, then index is inside formula
		var nearest;
		for (; index > -1; index--) {
			if (this.nodes[index].type === 'keyword') {
				nearest = this.nodes[index];
				if (nearest.text === '\\[') {
					console.timeEnd('Nodes.isInsideFormula()');
					return true;
				}
				if (nearest.text === '\\]') {
					console.timeEnd('Nodes.isInsideFormula()');
					return false;
				}
				break;
			}
		}
		if (index === -1) {
			console.timeEnd('Nodes.isInsideFormula()');
			return false;
		}

		index--;
		var delimCount = 1;
		for (; index > -1; index--) {
			if (this.nodes[index].type === 'keyword') {
				if (this.nodes[index].text !== nearest.text) {
					console.log(this.nodes[index].text, nearest.text, index, indexOld);
					break;
				}
				delimCount++;
			}
		}
		console.timeEnd('Nodes.isInsideFormula()');
		return !!(delimCount % 2);
	}

	var res = (
		this.isInside$(index, includeDelimiters) || this.isInside$$(index, includeDelimiters)
	);
	console.timeEnd('Nodes.isInsideFormula()');
	return res;
};

//TODO: separate to Nodes_get_formula.js
Nodes.prototype.getFormulaByIndex = function(index) {

	//TODO: refactor?
	if (this.nodes[index].type === 'keyword') {
		// Bad case, we don't know, is index left or right border of formula
		if (this.nodes[index].text === "\[") {
			//TODO: correct type + tests!
			return this.getFormulaByIndex(index + 1);
		}
		if (this.nodes[index].text === "\]") {
			//TODO: correct type + tests!
			return this.getFormulaByIndex(index - 1);
		}
		if (this.nodes[index].text === "$" || this.nodes[index].text === "$$") {
			//TODO: correct type + tests!
			if (this.nodes[index + 1] && this.isInsideFormula(index + 1)) {
				return this.getFormulaByIndex(index + 1);
			}
			return this.getFormulaByIndex(index - 1);
		}
	}

	// TODO: обобщить
	var beginIndex = 0;
	if (this.isInside$(index, true)) {
		var type = '$';
	} else if (this.isInside$$(index, true)) {
		var type = '$$';
	} else {
		return null; // TODO: а может, всё-таки объект, пусть и пустой?
	}
	var $s = this.getNodesNumbers('keyword', type);
	while ($s[beginIndex] < index) {
		beginIndex++;
	}

	return {
		start : $s[beginIndex - 1],
		end   : $s[beginIndex    ],
		type  : type,
	};
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

Nodes.prototype.getRowCol = function(index) {
	var coord = { col:0, row:0 };
	for (var i = index - 1; i >= 0 && this.nodes[i].type !== 'linebreak'; i--) {
		coord.col += this.nodes[i].text.length;
	}
	for (var i = index - 1; i >= 0; i--) {
		coord.row += (this.nodes[i].type === 'linebreak');
	}
	coord.row++;
	coord.col++;
	return coord;
};

Nodes.prototype.getInputencs = function() {
	var inputencs = [];
	//TODO: нормальная функция получения всех пакетов с необязательными аргументами
	//TODO: а для этого - вероятно, функция получения аргументов с указанием обязательности/необязательности
	var usepacks = this.getNodesNumbers('tag','\\usepackage');
	for (var i = 0; i < usepacks.length; i++) {
		var currentUsepack = this.getArguments(usepacks[i],3);
		if (currentUsepack.length < 3) {
			// Это бред какой-то, \usepackage в конце документа, но иначе может упасть
			continue;
		}
		currentUsepack[2].unwrap();
		if (currentUsepack[2].toString() != 'inputenc') {
			continue;
		}
		var encArg = currentUsepack[1];
		if (encArg.nodes[0].text === '[') {
			encArg.nodes.shift();
		}
		if (encArg.nodes[encArg.length - 1].text === ']') {
			encArg.nodes.pop();
		}
		encArg.trim();
		inputencs.push([usepacks[i], encArg.toString()]); // TODO: а если пробел?
	}
	return inputencs;
};

Nodes.prototype.getSuspiciousLongmaps = function() {
	var longmaps = this.getNodesNumbers('tag', '\\longmapsto');
	var susplongmaps = [];
	for (var i = 0; i < longmaps.length; i++) {
		if (this.nodes[longmaps[i] - 1].text === '=' && this.nodes[longmaps[i] - 2].text === '4') {
			susplongmaps.push(longmaps[i] - 2);
		}
	}
	return susplongmaps;
};


Nodes.prototype.getTagsAssignments = function(tags) {
	var foundTags = this.getTagsArrayNumbers(tags);
	var assignments = [];
	for (var i = 0; i < foundTags.length; i++) {
		if (this.nodes[foundTags[i] + 1] && /^=\d+[A-Z]+$/i.test(this.nodes[foundTags[i] + 1].text)) {
			assignments.push(foundTags[i]);
		}
	}
	return assignments;
};

Nodes.prototype.getTagsEmpty = function(tags) {
	var foundTags = this.getTagsArrayNumbers(tags);
	var empty = [];
	for (var i = 0; i < foundTags.length; i++) {
		//TODO: функция для выяснения, пуст ли аргумент
		var unwrapped = this.getArguments(foundTags[i],2)[1];
		unwrapped.unwrap();
		if (unwrapped.toString().trim() === '') {
			empty.push(foundTags[i]);
		}
	}
	return empty;
};

// TODO: возможно, врапперы на функции Array стОит сложить в отдельный файл
// Не вполне понятно, писать ли к ним тесты.
Nodes.prototype.map = function(callback, thisArg) {
	return this.nodes.map(callback, thisArg);
};

Nodes.prototype.getSubunicodeArtifacts = function() {
	var foundTags = this.getTagsArrayNumbers(['\\mbox']);
	var found = [];
	for (var i = 0; i < foundTags.length; i++) {
		//TODO: функция для выяснения, пуст ли аргумент
		var unwrapped = this.getArguments(foundTags[i],2)[1];
		unwrapped.unwrap();
		if (/(\^\^[0-9a-f]+)+/i.test(unwrapped.toString().trim())) {
			found.push(foundTags[i]);
		}
	}
	return found;
};

Nodes.prototype.findSingleByRegExp = function(typereg, textreg) {
	var found = [];
	this.nodes.forEach(function(node, index) {
		if (textreg.test(node.text) && typereg.test(node.type)) {
			found.push(index);
		}
	});
	return found;
};

Nodes.prototype.findSequenceByRegExp = function(seq) {
	var found = [];
	this.nodes.forEach(function(node, index, n) {
		if (index > n.length - seq.length) {
			// Нужного количества нод попросту нет справа
			return;
		}
		if (node.skip) {
			// Последовательность не может начинаться с пропускаемой ноды,
			// иначе некоторые будут попадать по 2 раза
			return;
		}
		var first = index;
		for (var i = 0; i < seq.length; i++) {
			while (n[index + i] && n[index + i].skip) {
				index++;
			}
			var curnode = n[index + i];
			if (!curnode) {
				return;
			}
			if (!seq[i].text.test(curnode.text) || !seq[i].type.test(curnode.type)) {
				return;
			}
		}
		found.push(first);
	});
	return found;
};

Nodes.prototype.isInsideArgumentsOf = function(index, tagsArr, argNumber) {
	// TODO: возможность просмотра только обязательных или необязательных аргументов
	var self = this;
	var borders = tagsArr.map(function(tag) {
		return self.findSingleByRegExp(tag.type, tag.text);
	}).reduce(function(a, b) {
		return a.concat(b);
	}).map(function(i) {
		return [i, self.getArgumentsEnd(i, argNumber + 1)];
	});
	for (var i = 0; i < borders.length; i++) {
		if (index < borders[i][1] && index > borders[i][0]) {
			return true;
		}
		//TODO: оптимизировать, чтобы при встрече меньшего правого края
		//останавливалось и возвращало false
	}
	return false;
};

Nodes.prototype.getIndexBySymbolNumber = function(number) {
	var totalLength = 0;
	for (var i = 0; i < this.length; i++) {
		totalLength += this.nodes[i].text.length;
		if (totalLength > number) {
			return i;
		}
	}
};

};//modules.export
