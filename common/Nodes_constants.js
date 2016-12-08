'use strict';

module.exports = function(Nodes) {

function gen(node) {
	return function() {
		return {
			type: node.type,
			text: node.text,
		};
	};
}

Nodes. LEFT_CURLY  = { type:'bracket', text:'{' };
Nodes.RIGHT_CURLY  = { type:'bracket', text:'}' };
Nodes. LEFT_SQUARE = { type:'bracket', text:'[' };
Nodes.RIGHT_SQUARE = { type:'bracket', text:']' };

Nodes.NEW_LINEBREAK = gen({ type:'linebreak', text:'\n' });

};
