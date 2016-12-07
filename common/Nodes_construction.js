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
	for (var i = 0; i < this.nodes.length; i++) {
		// TODO: объединять не по одной, а по несколько. А то тормозит. Переделать!
		if (this.nodes[i].type == "cyrtext" && this.nodes[i + 1].type == "cyrtext") {
			this.nodes[i].text += this.nodes[i + 1].text;
			this.nodes.splice(i + 1, 1);
			i--;
		}
	}
};

Nodes.prototype.separateSpaces = function() {
	// Мы предполагаем, что разрывы строки-то уж кодемирроровский парсер осилил
	for (var i = 0; i < this.nodes.length; i++) {
		var begin = this.nodes[i].text.match(/^\s+/);
		var end = this.nodes[i].text.match(/\s$/);
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

Nodes.prototype.prepareNodes = function() {
	this.separateSpaces();
	this.markSpaceNodes();
	this.markCyrillicNodes();
	this.joinCyrillicNodes();
	this.remarkNumberNodes();
};


// Вспомогательные - вынести!

function isCyryllicText(text) {
	return /^[А-ЯЁ]+$/i.test(text);
}

};

