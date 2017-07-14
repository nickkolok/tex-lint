'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, работающие с комментариями
// Они НЕ изменяют объект, а возвращают нечто новое

Nodes.prototype.isNontrivialComment = function(index) {
	return (
		this.nodes[index].type === 'comment'
	&&
		(
			this.nodes[index].text.length > 1
		//||
			//Комментарий в конце файле бессмысленнен и потому нетривиален. Л - логика!
			//index === this.length - 1
		//||
			//И в комментарии есть непробельные символы
			//this.nodes[this.skipTypes(index + 1,['space'])].type !== 'linebreak'
			// NB: пробелы не влияют на тривиальность
		)
	);
};

Nodes.prototype.getNontrivialCommentsNumbers = function() {
	return this.findSingleByRegExp(/^comment$/, /..+/);
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
	for (var i = 0; i < this.length; i++) {
		if (this.isTrivialComment(i)) {
			nums.push(i);
		}
	}
	return nums;
};

};
