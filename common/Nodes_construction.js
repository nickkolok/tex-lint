'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из конструктора
// Они изменяют объект
// Тесты пишутся не на отдельную функцию, а на результат конструктора

Nodes.prototype.fromText = function(text) {
	console.time('Nodes.fromText');
	this.nodes = [];
	var self = this;
	var goodTypesCatalogueNoSpace = {
		'cyrtext': null,
		'linebreak': null,
		'comment': null,
		'number': null,
		'tag': null,
		'bracket': null,
		'keyword': null,
		'variable': null,
	};
	Nodes.CodeMirror.runMode(
		text,
		{ name:'stex' },
		function(node, style) {
			if (node === '\n') {
				// TODO: patch CodeMirror
				self.nodes.push({ text: '\n', type: 'linebreak' });
				return;
			}
			if (style in goodTypesCatalogueNoSpace) {
				self.nodes.push({ text:node, type:style });
				return;
			}
			if ((/\d/i).test(node)) {
				// There are digits!
				if ((/^(\d+\.\d*|\d*\.\d+|\d+)$/i).test(node)) {
					// ...only digits
					self.nodes.push({ text: node, type: 'number' });
					return;
				}
				var begin = node.match(/^(\d+\.\d*|\d*\.\d+|\d+)/i);
				if (begin) {
					self.nodes.push({ text: begin[0], type: 'number' });
					node = node.substr(begin[0].length);
				}
				var end = node.match(/(\d+\.\d*|\d*\.\d+|\d+)$/i);
				if (end) {
					node = node.substr(0, node.length - end[0].length);
				}
			}
			// Maybe it's unrecognized space?
			if (/^\s+$/.test(node)) {
				style = 'space';
				if (!begin && self.nodes.length && self.nodes[self.nodes.length - 1].type === 'space') {
					self.nodes[self.nodes.length - 1].text += node;
					node = '';
				}
			}

			if (node !== '') {
				self.nodes.push({ text:node, type:style });
			}

			if (end) {
				self.nodes.push({ text: end[0], type: 'number' });
				return;
			}
		}
	);
	console.timeEnd('Nodes.fromText');
};


};

