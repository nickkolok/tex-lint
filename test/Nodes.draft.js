const util = require('util');

const Nodes = require('../common/Nodes.js').Nodes;

console.inspect = function(obj, opts) {
	console.log(util.inspect(obj, opts || {showHidden: false, depth: null}));
};

/*
var Nodes7 = new Nodes('\\frac   \n 1 2');
Nodes7.nodes[2].text = '\\alpha 2 \\beta';
console.log(Nodes7);
Nodes7.reparse();
console.log(Nodes7);

var Nodes8 = new Nodes('\\frac{1+\\alpha}{2 - \\beta}');
Nodes8.nodes.splice(8,3);
console.log(Nodes8.toString());
*/
