'use strict';

var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;
var rulesets = require('../common/rulesets.js');


var fileName = 'saved.tex';

function codeLoad() {

	var readers = [];
	// Closure to capture the file information.
	var f = document.getElementById('file-load').files[0];
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try {
				myCodeMirror.setValue(e.target.result);
				fileName = theFile.name;
			} catch (err) {
				alert('Не удалось прочитать ' + theFile.name);
			}
		};
	})(f);
	reader.readAsText(f);
};

function codeSave() {
	var blob = new Blob([myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g,"},\r\n{")], {
		type: "text/plain;charset=utf-8"
	});
	var a = document.createElement('a');
	a.download = fileName + ".edited.tex";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить TeX-файл</button>";
	document.getElementById('span-save').innerHTML = '';
	document.getElementById('span-save').appendChild(a);
	console.log('codeSave()');
}


var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'));

myCodeMirror.on("change", codeSave);

function getNodesAsIs() {

	return new Nodes(myCodeMirror.getValue());
};

function checkRules(rulesetName,nodesObject) {
	var checkLog = [];
	for (var i = 0; i < rulesets[rulesetName].rules.length; i++) {
		var theRule = rules[rulesets[rulesetName].rules[i][0]];
		console.log(theRule);
		var result = theRule.findErrors(nodesObject);
		if (result.quantity) {
			checkLog.push(theRule.message + " : " + "ошибок: " + result.quantity);
		}
	}
	document.getElementById("result-container").innerHTML = checkLog.join('<br/>');
}

function runcheck() {
	var nodesObject = getNodesAsIs();
	nodesObject.prepareNodes();
	console.log(nodesObject.nodes);


	checkRules("vzmsh2017", nodesObject);
}

document.getElementById("codeload").onclick = codeLoad;
document.getElementById("runcheck").onclick = runcheck;
