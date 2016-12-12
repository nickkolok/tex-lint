'use strict';

var iconv = require('iconv-lite');

var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;
var rulesets = require('../common/rulesets.js');
var texEmaples = require('../build/webui/tex-examples.js');

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
				var text = iconv.decode(new Buffer(e.target.result), encoding);
				myCodeMirror.setValue(text);
				fileName = theFile.name;
				fileEnc  = encoding;
			} catch (err) {
				alert('Не удалось прочитать ' + theFile.name);
			}
		};
	})(f);
	reader.readAsArrayBuffer(f);
};

function codeSave() {
	var encoding = document.getElementById("file-save-encoding").value;
	var text = myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g,"},\r\n{");
	var blob = new Blob([iconv.encode(text,encoding)], {
//		type: "text/plain;charset=",
	});
	var a = document.createElement('a');
	a.download = fileName + ".edited.tex";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить TeX-файл</button>";
	document.getElementById('span-save').innerHTML = '';
	document.getElementById('span-save').appendChild(a);
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
	var checkLog = [];
	for (var i = 0; i < rulesets[rulesetName].rules.length; i++) {
		var theRule = rules[rulesets[rulesetName].rules[i][0]];
		var result = theRule.findErrors(nodesObject);
		if (result.quantity) {
			var message = theRule.message + " : " + "ошибок: " + result.quantity;
			if (theRule.fixErrors) {
				message += ' <button id="fixErrors-' + theRule.name + '">Исправить</button>';
			}
			checkLog.push(message);
		}
	}
	document.getElementById("result-container").innerHTML = checkLog.join('<br/>');
	if (!checkLog.length) {
		document.getElementById("result-container").innerHTML = 'Ошибок не найдено';
	}

	// TODO: отрефакторить через какой-нибудь documentFragment
	for (var i = 0; i < rulesets[rulesetName].rules.length; i++) {
		var theRule = rules[rulesets[rulesetName].rules[i][0]];
		if (theRule.fixErrors && document.getElementById('fixErrors-' + theRule.name)) {
			document.getElementById('fixErrors-' + theRule.name).onclick = (function(rule) { return function() {
				try { // TODO: выляпаться из замыкания!!!
					console.log('Trying to fix ' + rule.name);
					var nodes = rule.fixErrors(getNodesAsIs());
					myCodeMirror.setValue(nodes.toString());
					runcheck();
				} catch (e) {
					console.log(e);
				}
			};})(theRule);
		}
	}
}

function runcheck() {
	var nodesObject = getNodesAsIs();
	console.log(nodesObject.nodes);
	console.log(nodesObject.getAllSingleDelimited('keyword','$'));


	checkRules(hashOptions.ruleset, nodesObject);
}

document.getElementById("codeload").onclick = codeLoad;
document.getElementById("runcheck").onclick = runcheck;

var hashOptions = {};
try {
	hashOptions = JSON.parse(document.location.hash.substr(1).replace(/&quot;/g,'"').replace(/%7b/gi,"{").replace(/%7d/gi,"}").replace(/%22/gi,'"'));
} catch (e) {
	console.log('Не удалось выделить настройки из адреса страницы');
}
hashOptions.ruleset = hashOptions.ruleset || "defaultSet";

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
