'use strict';

module.exports = function(Nodes) {

Nodes.prototype.setPropByRegExp = function(typereg, textreg, propname, propvalue) {
	this.nodes.forEach(function(node) {
		if (textreg.test(node.text) && typereg.test(node.type)) {
			node[propname] = propvalue;
		}
	});
};

Nodes.prototype.delPropByRegExp = function(typereg, textreg, propname) {
	this.nodes.forEach(function(node) {
		if (textreg.test(node.text) && typereg.test(node.type)) {
			delete node[propname];
		}
	});
};

Nodes.prototype.delAllPropsOfAllNodes = function() {
	this.nodes.forEach(function(node) {
		for (var prop in node) {
			if (prop !== 'type' && prop !== 'text') {
				delete node[prop];
			}
		}
	});
};

Nodes.prototype.setPropForRanges = function(ranges, propname, propvalue) {
	for (var i = 0; i < ranges.length; i++) {
		var range = ranges[i];
		for (var j = range[0]; j < range[1]; j++) {
			this.nodes[j][propname] = propvalue;
		}
	}
};

};
