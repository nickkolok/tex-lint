'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из конструктора
// Они изменяют объект
// Тесты пишутся не на отдельную функцию, а на результат конструктора

Nodes.prototype.fromText = function(text) {
	this.nodes = [];
	var self = this;
	Nodes.CodeMirror.runMode(
		text,
		{ name:'stex' },
		function(node, style) {
			self.nodes.push({ text:node, type:style });
		}
	);
	this.prepareNodes();
};

Nodes.prototype.markSubSup = function() {
	for (var i = 0; i < this.length; i++) {
		if (['_', '^'].indexOf(this.nodes[i].text) !== -1) {
			this.nodes[i].type = 'tag';
		}
	}
};

Nodes.prototype.markSpaceNodes = function() {
	console.time('Nodes.markSpaceNodes');
	for (var i = 0; i < this.length; i++) {
		if (this.nodes[i].text === '\n') {
			this.nodes[i].type = 'linebreak';
		} else if (/^\s+$/.test(this.nodes[i].text)) {
			this.nodes[i].type = 'space';
		}
	}
	console.timeEnd('Nodes.markSpaceNodes');
};

Nodes.prototype.remarkNumberNodes = function() {
	console.time('Nodes.remarkNumberNodes');
	for (var i = 0; i < this.length; i++) {
		if (/^\d+$/.test(this.nodes[i].text)) {
			this.nodes[i].type = 'number';
		}
	}
	console.timeEnd('Nodes.remarkNumberNodes');
};

Nodes.prototype.separateNumbers = function() {
	console.time('Nodes.separateNumbers');
	//TODO: сейчас оно режет только крайние. В принципе, пока этого хватает.
	// Но в перспективе - резать по-человечески и обобщить с separateSpaces

	// Мы предполагаем, что разрывы строки-то уж кодемирроровский парсер осилил
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
		if (this.nodes[i].type in goodTypesCatalogue) {
			continue;
		}

		if (
			[
				'space',
				'linebreak',
				'comment',
				'number',
			].indexOf(this.nodes[i].type) !== -1
		) {
			continue;
		}
		var begin = this.nodes[i].text.match(/^\d+/);
		var end = this.nodes[i].text.match(/\d+$/);
		if (begin) {
			this.insertNode(i, { text: begin[0], type: 'number' });
			i++;
			this.nodes[i].text = this.nodes[i].text.replace(/^\d+/, '');
		}
		if (end) {
			this.insertNode(i + 1, { text: end[0], type: 'number' });
			this.nodes[i].text = this.nodes[i].text.replace(/\d+$/, '');
			i++;
		}
	}
	console.timeEnd('Nodes.separateNumbers');
};

Nodes.prototype.separateSpaces = function() {
	console.time('Nodes.separateSpaces');
	// Мы предполагаем, что разрывы строки-то уж кодемирроровский парсер осилил
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
		if (this.nodes[i].type in goodTypesCatalogue) {
			continue;
		}
		if (!(/\s/i).test(this.nodes[i].text)) {
			continue;
		}
		var begin = this.nodes[i].text.match(/^\s+/);
		if (begin) {
			this.insertNode(i, { text: begin[0], type: 'space' });
			i++;
			this.nodes[i].text = this.nodes[i].text.replace(/^\s+/, '');
		}
		var end = this.nodes[i].text.match(/\s+$/);
		if (end) {
			this.insertNode(i + 1, { text: end[0], type: 'space' });
			this.nodes[i].text = this.nodes[i].text.replace(/\s+$/, '');
			i++;
		}
	}
	console.timeEnd('Nodes.separateSpaces');
};

Nodes.prototype.deleteEmptyNodes = function() {
	for (var i = 0; i < this.length; i++) {
		if (!this.nodes[i].text) {
			this.nodes.splice(i, 1);
			i--;
		}
	}
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
	this.separateSpaces();
	this.remarkNumberNodes();
	this.separateNumbers();
	this.remarkNumberNodes();
	this.deleteEmptyNodes();
	this.markSpaceNodes();
	this.joinNodesOfType('space');
	this.markSubSup();
	this.remarkNumberNodes();
};

};

