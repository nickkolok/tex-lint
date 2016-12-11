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

Nodes.prototype.count$SeparationErrors = function() {
	var quantity = 0;
	var nums = this.getNodesNumbers('keyword','$');

	for (var j = 0; j < nums.length; j += 2) {
		if (!this.isGoodOpening$(nums[j])) {
			quantity++;
		}
	}

	for (var j = 1; j < nums.length; j += 2) {
		if (!this.isGoodClosing$(nums[j])) {
			quantity++;
		}
	}

/*
	for (var j = 0; j < nums.length; j++) {
		if (![this.isGoodOpening$, this.isGoodClosing$][j % 2](nums[j])) {
			quantity++;
		}
	}
*/
	return quantity;
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

/*
	var nums = [];
	var linebreaks = this.getNodesNumbers('linebreak','\n');

	//Начало и конец текста считаются разрывами строки
	linebreaks.unshift(-1);
	linebreaks.push(this.nodes.length);

	for (var j = 0; j < linebreaks.length; j++) {
		var i = linebreaks[j];
		if (this.getSubnodes().toString().length > ) {
			nums.push(j);
		}
	}
	return nums;
*/
};

};