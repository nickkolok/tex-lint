const util = require('util');

const Nodes = require('../common/Nodes.js').Nodes;

console.inspect = function(obj, opts) {
	console.log(util.inspect(obj, opts || {showHidden: false, depth: null}));
};
