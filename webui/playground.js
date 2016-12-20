'use strict';

var iconv = require('iconv-lite');

var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;
var rulesets = require('../common/rulesets.js');
var texEmaples = require('../build/webui/tex-examples.js');
var HTMLreport = require('./htmlreport.js');
var JSONfromHash = require('./json-from-hash.js');
var autoenc = require('./autodetect-utf8-cp1251-cp866.js');


var fileName = 'saved.tex';
var fileEnc  = 'utf8';

function codeLoad() {

	var readers = [];
	// Closure to capture the file information.
	var f = document.getElementById('file-load').files[0];
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try {
				var encoding = document.getElementById("file-encoding").value;
				if (encoding === 'auto') {
					encoding = autoenc.detectEncoding(e.target.result).encoding;
					document.getElementById("file-encoding").value = encoding;
				}
				var text = iconv.decode(new Buffer(e.target.result), encoding);
				myCodeMirror.setValue(text);
				fileName = theFile.name;
				fileEnc  = encoding;
			} catch (err) {
				alert('Не удалось прочитать ' + theFile.name);
				console.log(err);
			}
		};
	})(f);
	reader.readAsArrayBuffer(f);
};

function codeSave() {
	var encoding = document.getElementById("file-save-encoding").value;
	var text = myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g,"\r\n");
	var blob = new Blob([iconv.encode(text,encoding)], {
//		type: "text/plain;charset=",
	});
	var a = $('<a>', {
		download : fileName + ".edited.tex",
		href : URL.createObjectURL(blob),
		html : "<button>Сохранить TeX-файл</button>",
	});
	document.getElementById('span-save').innerHTML = '';
	document.getElementById('span-save').appendChild(a[0]);
	console.log('codeSave()');
}


var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'),{
	lineNumbers: true,
});

myCodeMirror.on("change", codeSave);
document.getElementById("file-save-encoding").onchange = codeSave;

function getNodesAsIs() {
	return new Nodes(myCodeMirror.getValue());
};

function checkRules(rulesetName,nodesObject) {
	HTMLreport.createHTMLreport({
		rulesetName: rulesetName,
		nodesObject: nodesObject,
		targetElement: document.getElementById("result-container"),
		editor: myCodeMirror,
		getNodes: getNodesAsIs,
		recheck: runcheck,
	});
}

function runcheck() {
	var nodesObject = getNodesAsIs();
	console.log(nodesObject.nodes);
	console.log(nodesObject.getAllSingleDelimited('keyword','$'));


	checkRules(hashOptions.ruleset, nodesObject);
}

document.getElementById("codeload").onclick = codeLoad;
document.getElementById("runcheck").onclick = runcheck;

var hashOptions = JSONfromHash.getHashAsObject({
	defaults: {
		ruleset: "defaultSet",
	},
});

document.getElementById('ruleset-info').href = rulesets[hashOptions.ruleset].url;
document.getElementById('ruleset-info').innerHTML = rulesets[hashOptions.ruleset].title;
document.getElementById('ruleset-comment').innerHTML = rulesets[hashOptions.ruleset].comment;

if (rulesets[hashOptions.ruleset].examples && rulesets[hashOptions.ruleset].examples.length) {
	var optionsString = "";
	var examples = rulesets[hashOptions.ruleset].examples;
	for (var i = 0; i < examples.length; i++) {
		optionsString += '<option value="' + i + '">' + examples[i].title + '</option>';
	}
	document.getElementById("tex-examples-list").innerHTML = optionsString;
} else {
	document.getElementById("tex-examples").style.display = "none";
}

document.getElementById("paste-example").onclick = pasteExample;

function pasteExample() {
	var exampleNumber = document.getElementById("tex-examples-list").value;
	myCodeMirror.setValue(texEmaples[rulesets[hashOptions.ruleset].examples[exampleNumber].source]);
}
