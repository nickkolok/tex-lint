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
	Nodes.CodeMirror.runMode(
		text,
		{ name:'stex' },
		function(node, style) {
			if (node === '\n') {
				// TODO: patch CodeMirror
				self.nodes.push({ text: '\n', type: 'linebreak' });
				return;
			}
			if (!(style in goodTypesCatalogue) && (/\d/i).test(node)) {
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

Nodes.prototype.remarkNumberNodes = function() {
	console.time('Nodes.remarkNumberNodes');
	for (var i = 0; i < this.length; i++) {
		if (/^(\d+\.\d*|\d*\.\d+|\d+)$/i.test(this.nodes[i].text)) {
			this.nodes[i].type = 'number';
		}
	}
	console.timeEnd('Nodes.remarkNumberNodes');
};


//var separateNumberCache = {};

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


//		if (this.nodes[i].text in separateNumberCache) {
//			continue;
//		}

		if (!(/\d/i).test(this.nodes[i].text)) {
			// There are no digits
//			separateNumberCache[this.nodes[i].text] = null;
			continue;
		}
/*
		if ((/^(\d+\.\d*|\d*\.\d+|\d+)$/i).test(this.nodes[i].text)) {
			// There are only digits
//			separateNumberCache[this.nodes[i].text] = null;
			this.nodes[i].type = 'number';
			continue;
		}
*/
/*
		var begin = this.nodes[i].text.match(/^(\d+\.\d*|\d*\.\d+|\d+)/i);
		if (begin) {
			this.insertNode(i, { text: begin[0], type: 'number' });
			i++;
			this.nodes[i].text = this.nodes[i].text.replace(/^(\d+\.\d*|\d*\.\d+|\d+)/i, '');
		}
*/
		var end = (/(\d+\.\d*|\d*\.\d+|\d+)$/i).test(this.nodes[i].text);
		if (end) {
			end = this.nodes[i].text.match(/\d+$/);
			this.insertNode(i + 1, { text: end[0], type: 'number' });
			this.nodes[i].text = this.nodes[i].text.replace(/(\d+\.\d*|\d*\.\d+|\d+)$/i, '');
			i++;
		}
	}
	console.timeEnd('Nodes.separateNumbers');
};

Nodes.prototype.deleteEmptyNodes = function() {
	console.time('Nodes.deleteEmptyNodes');
	for (var i = 0; i < this.length; i++) {
		if (!this.nodes[i].text) {
			this.nodes.splice(i, 1);
			i--;
		}
	}
	console.timeEnd('Nodes.deleteEmptyNodes');
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
	this.remarkNumberNodes();
	this.joinNodesOfType('space');
};

};

