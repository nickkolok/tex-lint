const Nodes = require('../common/Nodes.js').Nodes;

// 1

var Nodes1 = new Nodes('\\frac{1}{2}3');

console.log(Nodes1);

console.log(Nodes1.getBraceGroup(1,{type:'bracket',text:'{'},{type:'bracket',text:'}'}));

console.log(Nodes1.getBraceGroup(4,{type:'bracket',text:'{'},{type:'bracket',text:'}'}));

