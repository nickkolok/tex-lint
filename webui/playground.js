'use strict';

var iconv = require('iconv-lite');

var Nodes = require('../common/Nodes.js').Nodes;
var rules = require('../common/Rule.js').rules;
var rulesets = require('../common/rulesets.js');
var texExamples = require('../build/webui/tex-examples.js');
var HTMLreport = require('./htmlreport.js');
var JSONfromHash = require('json-from-location-hash');
var autoenc = require('node-autodetect-utf8-cp1251-cp866');

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
				var encoding = document.getElementById('file-encoding').value;
				if (encoding === 'auto') {
					encoding = autoenc.detectEncoding(e.target.result).encoding;
					document.getElementById('file-encoding').value = encoding;
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
}

function codeSave() {
	console.time('codeSave()');
	var encoding = document.getElementById('file-save-encoding').value;
	var text = myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g, '\r\n');
	var blob = new Blob([iconv.encode(text, encoding)], {
//		type: "text/plain;charset=",
	});
	var a = $('<a>', {
		download : fileName + '.edited.tex',
		href : URL.createObjectURL(blob),
		html : '<button class="btn btn-default">Сохранить TeX-файл</button>',
	});
	document.getElementById('span-save').innerHTML = '';
	document.getElementById('span-save').appendChild(a[0]);
	console.timeEnd('codeSave()');
}


var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'), {
	lineNumbers: true,
});

myCodeMirror.on('change', codeSave);
document.getElementById('file-save-encoding').onchange = codeSave;

function getNodesAsIs() {
	return new Nodes(myCodeMirror.getValue());
}

function checkRules(rulesetName, nodesObject) {
	console.time('checkRules()');
	HTMLreport.createHTMLreport({
		rulesetName: rulesetName,
		nodesObject: nodesObject,
		targetElement: document.getElementById('result-container'),
		editor: myCodeMirror,
		getNodes: getNodesAsIs,
		recheck: runcheck,
	});
	console.timeEnd('checkRules()');
}

function runcheck() {
	console.time('runcheck()');
	var nodesObject = getNodesAsIs();
	checkRules(hashOptions.ruleset, nodesObject);
	console.timeEnd('runcheck()');
}

document.getElementById('file-load').onchange = codeLoad;
document.getElementById('runcheck').onclick = runcheck;

var hashOptions = JSONfromHash.getHashAsObject({
	defaults: {
		ruleset: 'defaultSet',
	},
});

function switchToRuleset(ruleset) {
	hashOptions.ruleset = ruleset;
	document.getElementById('ruleset-info').href = rulesets[ruleset].url;
	document.getElementById('ruleset-info').innerHTML = rulesets[ruleset].title;
	document.getElementById('ruleset-comment').innerHTML = rulesets[ruleset].comment;

	if (rulesets[ruleset].examples && rulesets[ruleset].examples.length) {
		var optionsString = '';
		var examples = rulesets[ruleset].examples;
		for (var i = 0; i < examples.length; i++) {
			optionsString += '<option value="' + i + '">' + examples[i].title + '</option>';
		}
		document.getElementById('tex-examples-list').innerHTML = optionsString;
	} else {
		document.getElementById('tex-examples').style.display = 'none';
	}
}

switchToRuleset(hashOptions.ruleset);

document.getElementById('paste-example').onclick = pasteExample;

function pasteExample() {
	var exampleNumber = document.getElementById('tex-examples-list').value;
	myCodeMirror.setValue(
		texExamples[
			rulesets[hashOptions.ruleset].examples[exampleNumber].source
		]
	);
}


// То, что должно торчать наружу для тестирования и отладки
window.exportedControls = {
	// Данные
	texExampless: texExamples,
	rulesets: rulesets,
	hashOptions: hashOptions,

	// Объект CodeMirror
	myCodeMirror: myCodeMirror,

	// Функции
	runcheck: runcheck,
	checkRules: checkRules,
	switchToRuleset: switchToRuleset,
	pasteExample: pasteExample,
};
