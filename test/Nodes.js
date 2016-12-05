const Nodes = require('../common/Nodes.js').Nodes;

// 1

var Nodes1 = new Nodes('\\frac{1}{2}3[5]');

console.log(Nodes1);

console.log(Nodes1.getBraceGroup(1, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));

console.log(Nodes1.getBraceGroup(4, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));

console.log(Nodes1.getSubnodes(4, 5));

console.log(Nodes1.getGroupOrSingle(4));
console.log(Nodes1.getGroupOrSingle(5));
console.log(Nodes1.getGroupOrSingle(0));
console.log(Nodes1.getGroupOrSingle(6));
console.log(Nodes1.getGroupOrSingle(8));

var Nodes2 = new Nodes('\\frac12 34');
console.log(Nodes2);

var Nodes3 = new Nodes('\\frac   \n 1 2');
console.log(Nodes3);
console.log(Nodes3.skipTypes(1,['space']));
console.log(Nodes3.skipTypes(1,['space','linebreak']));

console.log(Nodes1.getArguments(1, 1));
console.log(Nodes1.getArguments(1, 2));
console.log(Nodes1.getArguments(1, 3));
console.log(JSON.stringify(Nodes1.getArguments(1, 4)));
