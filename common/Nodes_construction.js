module.exports = function(Nodes) {


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


};

