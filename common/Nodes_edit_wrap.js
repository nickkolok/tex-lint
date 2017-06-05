'use strict';

module.exports = function(Nodes) {


Nodes.prototype.trimLeft = function() {
	var start = this.skipTypes(0, ['space','linebreak']);
	this.nodes.splice(0, start);

};

Nodes.prototype.trimRight = function() {
	var end = this.skipTypesReverse(this.length - 1, ['space','linebreak']);
	this.nodes.splice(end + 1, this.length); // С запасом, лень вычислять

};

Nodes.prototype.trim = function() {
	this.trimLeft();
	this.trimRight();
};

Nodes.prototype.unwrap = function() {
	this.trim();
	//console.log('___________________');
	//console.log(this.toString());
	if (
		!Nodes.areNodesEqual(this.nodes[0],                     Nodes. LEFT_CURLY)
	||
		!Nodes.areNodesEqual(this.nodes[this.length - 1], Nodes.RIGHT_CURLY)
	) {
		//console.log('not group');
		return;
	}
	// Итак, слева и справа - скобки.
	// Охватывают ли они весь массив?
	if (this.getArguments(0, 1)[0].length != this.length) {
		//console.log('not single arg', this.getArguments(0, 1)[0].length, this.length);
		return;
	}
	this.nodes.pop();
	this.nodes.shift();

	// И уходим на рекурсию, мало ли чего там понапихано
	this.unwrap();
};

Nodes.prototype.wrapInBracesIfAdditive = function() {
	// TODO: переделать на инъекцию нод в начало и конец
	if (this.toString().match(/[+-]/)) {
		// TODO: как-то поточнее, что ли
		this.fromText('(' + this.toString() + ')');
	}
};

};
