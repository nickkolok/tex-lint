'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из конструктора
// Они изменяют объект
// Тесты пишутся не на отдельную функцию, а на результат конструктора

Nodes.prototype.fromText = function(text) {
	console.time('Nodes.fromText');
	this.nodes = [];
	var self = this;
	var goodTypesCatalogue = {
		'cyrtext': null,
		'space': null,
		'linebreak': null,
		'comment': null,
		'number': null,
		'tag': null,
		'bracket': null,
		'keyword': null,
		'variable': null,
	};
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
			if (style in goodTypesCatalogueNoSpace && node) {
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

				// Maybe it's unrecognized space?
				if (/^\s+$/.test(node)) {
					style = 'space';
					if (!begin && self.nodes[self.nodes.length - 1].type === 'space') {
						self.nodes[self.nodes.length - 1] += node;
						node = null;
					}
				}

				if (end) {
					self.nodes.push({ text:node, type:style });
					self.nodes.push({ text: end[0], type: 'number' });
					return;
				}
			}


			if (node) {
				self.nodes.push({ text:node, type:style });
			}


		}
	);
	console.timeEnd('Nodes.fromText');
	this.prepareNodes();
};

Nodes.prototype.markSpaceNodes = function() {
	console.time('Nodes.markSpaceNodes');
	var goodTypesCatalogue = {
		'cyrtext': null,
		'space': null,
		'linebreak': null,
		'comment': null,
		'number': null,
		'tag': null,
		'bracket': null,
		'keyword': null,
		'variable': null,
	};
	for (var i = 0; i < this.length; i++) {
		/*
		if (this.nodes[i].text === '\n') {
			//console.log(this.nodes[i].type);
			this.nodes[i].type = 'linebreak';
		} else
		*/
		if (!(this.nodes[i].type in goodTypesCatalogue) && (/^\s+$/i).test(this.nodes[i].text)) {
			this.nodes[i].type = 'space';
		}
	}
	console.timeEnd('Nodes.markSpaceNodes');
};

Nodes.prototype.joinNodesOfType = function(type) {
	console.time('Nodes.joinNodesOfType("' + type + '")');
	for (var i = 0; i < this.length - 1; i++) {
		if (this.nodes[i].type === type && this.nodes[i + 1].type === type) {
			for (var j = i + 1; j < this.length && this.nodes[j].type === type; j++) {
				this.nodes[i].text += this.nodes[j].text;
			}
			this.nodes.splice(i + 1, j - i - 1);
		}
	}
	console.timeEnd('Nodes.joinNodesOfType("' + type + '")');
};

Nodes.prototype.prepareNodes = function() {
	this.markSpaceNodes();
	this.joinNodesOfType('space');
};

};

