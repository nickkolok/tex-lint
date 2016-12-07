const util = require('util');

const Nodes = require('../common/Nodes.js').Nodes;

var Nodes1 = new Nodes('\\frac{1}{2}3[5]');


var Nodes3 = new Nodes('\\frac   \n 1 2');

console.inspect = function(obj, opts) {
	console.log(util.inspect(obj, opts || {showHidden: false, depth: null}));
};

/*
console.log(Nodes1.getWithArguments(0, 3));
console.log(Nodes3.getWithArguments(0, 2));

var Nodes7 = new Nodes('\\frac   \n 1 2');
Nodes7.nodes[2].text = '\\alpha 2 \\beta';
console.log(Nodes7);
Nodes7.reparse();
console.log(Nodes7);

var Nodes8 = new Nodes('\\frac{1+\\alpha}{2 - \\beta}');
Nodes8.nodes.splice(8,3);
console.log(Nodes8.toString());


var Nodes9 = new Nodes('\\alpha 2 \\beta');
var Nodes10 = new Nodes('\\gamma 4 \\varepsilon');
Nodes9.insertSubnodes(2, Nodes10);
console.log(Nodes9);
console.log(Nodes9.slice());

var Nodes12 = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
Nodes12.groupInlineFormulas();
console.log(Nodes12.toString());
console.log(Nodes12);

*/
