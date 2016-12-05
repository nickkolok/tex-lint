const Nodes = require('../common/Nodes.js').Nodes;

// 1

var Nodes1 = new Nodes('\\frac{1}{2}3');

console.log(Nodes1);

console.log(Nodes1.getBraceGroup(1, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));

console.log(Nodes1.getBraceGroup(4, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));

