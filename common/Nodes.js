'use strict';

// Конструктор
function Nodes(text) {
  this.nodes = [];
  if (text) {
	  this.fromText(text);
  }
};

Nodes.prototype.fromText = function(text) {
	this.nodes = [];
	var self = this;
	CodeMirror.runMode(
		text,
		{ name:'stex' },
		function(node, style) {
			self.nodes.push({ text:node, type:style });
		}
	);
};

Nodes.prototype.getNodesQuantity = function(nodetype, nodetext) {
	var quantity = 0;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].type == nodetype && this.nodes[i].text == nodetext) {
			quantity++;
		}
	}
	return quantity;
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

Nodes.prototype.prepareNodes = function() {
	this.markSpaceNodes();
	this.markCyrillicNodes();
	this.joinCyrillicNodes();
};

// Вспомогательные - вынести!

function isCyryllicText(text) {
	return /^[А-ЯЁ]+$/i.test(text);
}

module.exports.Nodes = Nodes;
