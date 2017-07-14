'use strict';

module.exports = function(Nodes) {

Nodes.prototype.removeComment = function(i) {
	// Прервать комментарий может только конец строки или пробел перед ним
	var itsLinebreakIndex = this.skipTypes(i + 1, ['space']) + 1;
	this.nodes.splice(i, itsLinebreakIndex - i - 1);
	if (this.nodes[i - 1] && this.nodes[i - 1].type === 'linebreak') {
		this.nodes.splice(i - 1, 1);
	}
};

};
