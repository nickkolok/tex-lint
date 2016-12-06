'use strict';

module.exports = function(Nodes) {


// Костыль =(
// С browserify такого быть не должно

try {
	if (typeof (navigator) === 'undefined') {
		Nodes.CodeMirror = require("../node_modules/codemirror/addon/runmode/runmode.node.js");
		require("../node_modules/codemirror/mode/meta.js");
		require("../node_modules/codemirror/mode/stex/stex.js");

	} else {
		Nodes.CodeMirror = window.CodeMirror;
	}
} catch (e) {
	console.log(e);
}


};