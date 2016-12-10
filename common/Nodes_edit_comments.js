'use strict';

module.exports = function(Nodes) {


Nodes.prototype.removeNontrivialComments = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.isNontrivialComment(i)) {
			// Прервать комментарий может только конец строки или пробел перед ним
			var itsLinebreakIndex = this.skipTypes(i + 1, ['space']) + 1;
			this.nodes.splice(i, itsLinebreakIndex - i);
			i--;
			/*
			var nextNonSpaceIndex = this.skipTypes(itsLinebreakIndex + 1,['space']);
			if (this.nodes[nextNonSpaceIndex].type !== 'linebreak') {
				this.nodes.splice(i,1);
			} else {
				this.nodes.splice(i,2);
			}
			i--;
			*/
		}
	}
};

Nodes.prototype.removeTrivialComments = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.isTrivialComment(i)) {
			// Прервать комментарий может только конец строки или пробел перед ним
			var itsLinebreakIndex = this.skipTypes(i + 1, ['space']) + 1;
			this.nodes.splice(i, itsLinebreakIndex - i);
			i--;
		}
	}
};


};
