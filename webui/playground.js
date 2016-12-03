
var fileName='saved.tex'

function codeLoad(){

	var readers=[];
	// Closure to capture the file information.
	var f=document.getElementById('file-load').files[0];
	reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try{
				myCodeMirror.setValue(e.target.result);
				fileName = theFile.name;
			}catch(e){
				alert('Не удалось прочитать '+theFile.name)
			}
		};
	})(f);
	reader.readAsText(f);
}

function codeSave(){
	var blob = new Blob([myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g,"},\r\n{")], {
		type: "text/plain;charset=utf-8"
	});
	var a = document.createElement('a');
	a.download = fileName+".edited.tex";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить TeX-файл</button>";
	document.getElementById('span-save').innerHTML='';
	document.getElementById('span-save').appendChild(a);
	console.log('codeSave()');
}



var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'));

myCodeMirror.on("change",codeSave);


function parseToNodes(text){
	var nodes = [];
	CodeMirror.runMode(
		text,
		{name:'stex'},
		function(node,style){
			nodes.push({text:node,type:style});
		}
	);
	return nodes;
}

function getNodesAsIs(){
	return parseToNodes(myCodeMirror.getValue());
};

function getNodesQuantity(nodes,nodetype,nodetext){
	var quantity = 0;
	for(var i=0; i<nodes.length; i++){
		if(nodes[i].type == nodetype && nodes[i].text == nodetext){
			quantity++;
		}
	}
	return quantity;
}

function isCyryllicText(text){
	return /^[А-ЯЁ]+$/i.test(text);
}


function markCyrillicNodes(nodes){
	for(var i = 0; i < nodes.length; i++){
		if(isCyryllicText(nodes[i].text)){
			nodes[i].type = "cyrtext";
		}
	}
}

function markSpaceNodes(nodes){
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].text=="\n"){
			nodes[i].type = "linebreak";
		} else if(/^\s+$/.test(nodes[i].text)) {
			nodes[i].type = "space";
		}
	}
}

function joinCyrillicNodes(nodes){
	for(var i = 0; i < nodes.length; i++){
		// TODO: объединять не по одной, а по несколько. А то тормозит. Переделать!
		if(nodes[i].type == "cyrtext" && nodes[i+1].type == "cyrtext"){
			nodes[i].text += nodes[i + 1].text;
			nodes.splice(i + 1, 1);
			i--;
		}
	}
}

function prepareNodes(nodes){
	markSpaceNodes(nodes);
	markCyrillicNodes(nodes);
	joinCyrillicNodes(nodes);
}

function runcheck(){
	var nodes = getNodesAsIs();
	prepareNodes(nodes);
	console.log(nodes);
	if(getNodesQuantity(nodes,"tag","\\newcommand")+getNodesQuantity(nodes,"tag","\\renewcommand")){
		alert('Команды переопределять нельзя!');
	};
}
