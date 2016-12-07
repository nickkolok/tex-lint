const Nodes = require('../common/Nodes.js').Nodes;

var Nodes1 = new Nodes('\\frac{1}{2}3[5]');

//console.log(Nodes1);

//console.log(Nodes1.getBraceGroup(1, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));

//console.log(Nodes1.getBraceGroup(4, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY));




//console.log(Nodes1.getSubnodes(4, 7));



//console.log(Nodes1.getGroupOrSingle(4));
//console.log(Nodes1.getGroupOrSingle(5));
//console.log(Nodes1.getGroupOrSingle(0));
//console.log(Nodes1.getGroupOrSingle(6));
//console.log(Nodes1.getGroupOrSingle(8));


var Nodes2 = new Nodes('\\frac12 34');
console.log(Nodes2);


/*
var Nodes3 = new Nodes('\\frac   \n 1 2');
console.log(Nodes3);
console.log(Nodes3.skipTypes(1,['space']));
console.log(Nodes3.skipTypes(1,['space','linebreak']));

console.log(Nodes1.getArguments(1, 1));
console.log(Nodes1.getArguments(1, 2));
console.log(Nodes1.getArguments(1, 3));
console.log(JSON.stringify(Nodes1.getArguments(1, 4)));
console.log(Nodes1.getArguments(1, 3)[2].toString());

var Nodes5 = new Nodes('\\frac{1+\\alpha}{2 - \\beta}')
console.log(Nodes5);

console.log(Nodes1.getWithArguments(0, 3));
console.log(Nodes3.getWithArguments(0, 2));

var Nodes6 = new Nodes('Some text with frac $\\frac{a}{b}+\\frac{1+\\alpha}{2-\\beta}+\\frac{1+C_0}{2}$ in it.');
console.log(Nodes6);
console.log(Nodes6.getNodesNumbers('keyword', '$'));

var Nodes7 = new Nodes('\\frac   \n 1 2');
Nodes7.nodes[2].text = '\\alpha 2 \\beta';
console.log(Nodes7);
Nodes7.reparse();
console.log(Nodes7);

var Nodes8 = new Nodes('\\frac{1+\\alpha}{2 - \\beta}');
Nodes8.nodes.splice(8,3);
console.log(Nodes8.toString());


var Nodes9 = new Nodes('\\alpha 2 \\beta');
console.log(Nodes9);
var Nodes10 = new Nodes('\\gamma 4 \\varepsilon');
Nodes9.insertSubnodes(2, Nodes10);
console.log(Nodes9);

console.log(Nodes9.slice());


var Nodes11 = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def');
Nodes11.inlinizeAllFracs();
console.log(Nodes11.toString());

var Nodes11a = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
Nodes11a.inlinizeAllFracs();
console.log(Nodes11a.toString());


var Nodes12 = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
Nodes12.groupInlineFormulas();
console.log(Nodes12.toString());
console.log(Nodes12);

var Nodes12 = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
Nodes12.inlinizeAllFracs();
console.log(Nodes12.toString());
*/
