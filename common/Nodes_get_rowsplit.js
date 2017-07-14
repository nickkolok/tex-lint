'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, отвечающие за правила разрыва строк
// Они НЕ изменяют объект, а возвращают нечто новое

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

Nodes.prototype.isGoodOpening$ = function(i) {
	var node = this.nodes[this.skipTypesReverse(i - 1,['space'])];
	if (node && node.type === 'linebreak') {
		// Пробелы в начале строки? Возможно, это отступ
		return true;
	}
	return this.isWellSeparated(i, ['linebreak'], ['space'], true);
};

Nodes.prototype.isGoodClosing$ = function(i) {
	var node = this.nodes[this.skipTypes(i + 1,['space'])];
	if (node && node.type === 'linebreak') {
		// Пробелы в конце строки? Это плохо, но не поймут-с.
		return true;
	}
	return this.isWellSeparated(i, ['linebreak'], ['space'], false);
};

Nodes.prototype.isWellSeparated$ = function(i) {
	if (this.isInside$(i + 1)) {
		// Значит, наш $ - левый
		return this.isGoodOpening$(i);
	}
	// А иначе правый
	return this.isGoodClosing$(i);
};

Nodes.prototype.count$SeparationErrors = function() {
	return this.get$SeparationErrors().length;
	//TODO: а не выпилить ли эту функцию?
};

Nodes.prototype.get$SeparationErrors = function() {
	var errors = [];
	var nums = this.getNodesNumbers('keyword', '$');

	for (var j = 0; j < nums.length; j ++) {
		if (!this.isWellSeparated$(nums[j])) {
			errors.push(nums[j]);
		}
	}
	return errors;
};

Nodes.prototype.getTooLongRowsNumbers = function(maxlength) {
	// Вернёт номера не нод, а строк
	var nums = [];
	var rows = this.toString().split('\n');
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].length > maxlength) {
			nums.push(i);
		}
	}

	return nums;
};

Nodes.prototype.getTooLongRowsIndexes = function(maxlength) {
	// А вот эта - номера нод
	var nums = [];
	var linebreaks = this.getNodesNumbers('linebreak','\n');

	//Начало и конец текста считаются разрывами строки
	linebreaks.unshift(-1);
	linebreaks.push(this.length);

	for (var j = 0; j < linebreaks.length - 1; j++) {
		var i = linebreaks[j];
		if (this.getSubnodes(linebreaks[j] + 1, linebreaks[j + 1]).toString().length > maxlength) {
			nums.push(linebreaks[j + 1]);
		}
	}
	return nums;
};

};
