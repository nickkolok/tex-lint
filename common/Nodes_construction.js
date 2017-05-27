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
	for (var i = 0; i < this.nodes.length; i++) {
		if (["_","^"].indexOf(this.nodes[i].text) !== -1) {
			this.nodes[i].type = "tag";
		}
	}
};

Nodes.prototype.markCyrillicNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (isCyryllicText(this.nodes[i].text)) {
			this.nodes[i].type = "cyrtext";
		}
	}
};

Nodes.prototype.markSpaceNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].text == "\n") {
			this.nodes[i].type = "linebreak";
		} else if (/^\s+$/.test(this.nodes[i].text)) {
			this.nodes[i].type = "space";
		}
	}
};

Nodes.prototype.remarkNumberNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (/^\d+$/.test(this.nodes[i].text)) {
			this.nodes[i].type = 'number';
		}
	}
};

Nodes.prototype.joinCyrillicNodes = function() {
	// TODO: влить в joinNodeOfType()
	for (var i = 0; i < this.nodes.length - 1; i++) {
		// TODO: объединять не по одной, а по несколько. А то тормозит. Переделать!
		if (this.nodes[i].type == "cyrtext" && this.nodes[i + 1].type == "cyrtext") {
			this.nodes[i].text += this.nodes[i + 1].text;
			this.nodes.splice(i + 1, 1);
			i--;
		}
	}
};

Nodes.prototype.separateNumbers = function() {
	//TODO: сейчас оно режет только крайние. В принципе, пока этого хватает.
	// Но в перспетиве - резать по-человечески и обобщить с separateSpaces

	// Мы предполагаем, что разрывы строки-то уж кодемирроровский парсер осилил
	for (var i = 0; i < this.nodes.length; i++) {
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
			this.nodes[i].text = this.nodes[i].text.replace(/^\d+/,"");
		}
		if (end) {
			this.insertNode(i + 1, { text: end[0], type: 'number' });
			this.nodes[i].text = this.nodes[i].text.replace(/\d+$/,"");
			i++;
		}
	}
};

Nodes.prototype.separateSpaces = function() {
	// Мы предполагаем, что разрывы строки-то уж кодемирроровский парсер осилил
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type === 'space' || this.nodes[i].type === 'linebreak') {
			continue;
		}
		var begin = this.nodes[i].text.match(/^\s+/);
		var end = this.nodes[i].text.match(/\s+$/);
		if (begin) {
			this.insertNode(i, { text: begin[0], type: 'space' });
			i++;
			this.nodes[i].text = this.nodes[i].text.replace(/^\s+/,"");
		}
		if (end) {
			this.insertNode(i + 1, { text: end[0], type: 'space' });
			this.nodes[i].text = this.nodes[i].text.replace(/\s+$/,"");
			i++;
		}
	}
};

Nodes.prototype.deleteEmptyNodes = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (!this.nodes[i].text) {
			this.nodes.splice(i,1);
			i--;
		}
	}
};

Nodes.prototype.joinNodesOfType = function(type) {
	for (var i = 0; i < this.nodes.length - 1; i++) {
		// TODO: объединять не по одной, а по несколько. А то тормозит. Переделать!
		if (this.nodes[i].type == type && this.nodes[i + 1].type == type) {
			this.nodes[i].text += this.nodes[i + 1].text;
			this.nodes.splice(i + 1, 1);
			i--;
		}
	}
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
	this.markCyrillicNodes();
	this.joinCyrillicNodes();
	this.markSubSup();
	this.remarkNumberNodes();
};


// Вспомогательные - вынести!

function isCyryllicText(text) {
	return /^[А-ЯЁ]+$/i.test(text);
}

};

