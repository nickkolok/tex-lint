'use strict';

module.exports = function(Nodes) {


Nodes.prototype.separate$$ = function() {
	var len = this.getNonseparated$$Numbers().length;
	for (var j = 0; j < len; j++) {
		var i = this.getNonseparated$$Numbers()[0]; // Номера нод-то поменялись! И мы исправили!
		//TODO: справа налево. Или вовсе выпилить
		this.separateOne$$(i);
	}
};

Nodes.prototype.separateOne$$ = function(i) {
	var left  = this.skipTypesReverse(i - 1, ['space']);
	var right = this.skipTypes(i + 1, ['space']);
	//Справа налево, чтоб индексы не сползли
	if (this.nodes[right] && this.nodes[right].type !== 'linebreak') {
		this.insertNode(i + 1, Nodes.NEW_LINEBREAK());
	}
	if (this.nodes[left] && this.nodes[left].type !== 'linebreak') {
		this.insertNode(i, Nodes.NEW_LINEBREAK());
	}
};

Nodes.prototype.separate$ = function() {
	var len = this.getNodesNumbers('keyword', '$').length;
	for (var j = 0; j < len; j++) {
		var i = this.getNodesNumbers('keyword', '$')[j]; // Номера нод могли поменяться. Хотя могли и нет.
		if (!this.isWellSeparated$(i)) {
			this.separateOne$(i);
		}
	}
};

Nodes.prototype.separateOne$ = function(i) {
	if (this.isInside$(i + 1)) {
		var target = this.skipToTypesReverse(i, ['space']);
	} else {
		var target = this.skipToTypes(i, ['space']);
	}
	this.nodes[target] = Nodes.NEW_LINEBREAK();
};

Nodes.prototype.splitRowOnce = function(rownumber, maxlength) {
	var linebreaks = this.getNodesNumbers('linebreak','\n');
	//Начало и конец текста считаются разрывами строки
	linebreaks.unshift(-1);
	linebreaks.push(this.length);
	//console.log('linebreaks',linebreaks);

	var start  = linebreaks[rownumber];
	var finish = linebreaks[rownumber + 1];

	var currentLength = 0;
	for (var i = start + 1; i < finish; i++) {
		currentLength += this.nodes[i].text.length;
		//console.log('currentLength', currentLength);
		if (currentLength > maxlength) {
			var lastSpace = this.skipToTypesReverse(i, ['space']);
			if (lastSpace > start) {
				this.nodes[lastSpace] = Nodes.NEW_LINEBREAK();
				return true;
			}
		}
	}
	return false;
};

Nodes.prototype.splitRowByIndex = function(index, maxlength) {
	// Передаётся индекс конца строки

	var finish = index;
	var start  = this.skipToTypesReverse(index - 1, ['linebreak']);

	var currentLength = 0;
	for (var i = start + 1; i < finish; i++) {
		currentLength += this.nodes[i].text.length;
		//console.log('currentLength', currentLength);
		if (currentLength > maxlength) {
			var lastSpace = this.skipToTypesReverse(i, ['space']);
			if (lastSpace > start) {
				this.nodes[lastSpace] = Nodes.NEW_LINEBREAK();
				this.splitRowByIndex(index, maxlength);
				return;
			}
		}
	}
};

Nodes.prototype.splitOneRow = function(maxlength) {
	var rows = this.getTooLongRowsNumbers(maxlength);
	for (var i = 0; i < rows.length; i++) {
		if (this.splitRowOnce(rows[i], maxlength)) {
			return true;
		}
	}
	return false;
};

Nodes.prototype.splitRows = function(maxlength) {
	while (this.splitOneRow(maxlength)) {
	}
};


};
